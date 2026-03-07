import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { login, register, googleLogin } from '../services/authService';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isLogin && formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            const response = isLogin 
                ? await login(formData.email, formData.password)
                : await register(formData.name, formData.email, formData.password);

            if (response.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/');
            } else {
                setError(response.message || 'Authentication failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <i className="bi bi-mortarboard-fill"></i>
                        </div>
                        <h2 className="logo-text">EduFlow</h2>
                    </div>
                    <p className="login-subtitle">
                        {isLogin ? 'Welcome back! Please login to continue' : 'Create your account to get started'}
                    </p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    )}

                    <Button 
                        type="submit" 
                        className="w-100 login-btn mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <><Spinner animation="border" size="sm" /> Processing...</>
                        ) : (
                            isLogin ? 'Login' : 'Register'
                        )}
                    </Button>
                </Form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <Button 
                    variant="outline-dark" 
                    className="w-100 google-btn"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    <i className="bi bi-google me-2"></i>
                    Continue with Google
                </Button>

                <div className="text-center mt-4">
                    <p className="toggle-text">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span 
                            className="toggle-link" 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                            }}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
