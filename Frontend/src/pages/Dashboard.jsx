import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { courseService, studentService, bookingService } from '../services/api';

const Dashboard = () => {
    const [counts, setCounts] = useState({ courses: 0, students: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                console.log('Fetching dashboard data...');
                setLoading(true);
                setError(null);
                
                const [f, c, b] = await Promise.all([
                    courseService.getAll(),
                    studentService.getAll(),
                    bookingService.getAll()
                ]);
                
                console.log('Courses response:', f.data);
                console.log('Students response:', c.data);
                console.log('Bookings response:', b.data);
                
                const coursesData = f.data.data || [];
                const studentsData = c.data.data || [];
                const bookingsData = b.data.data || [];
                
                setCounts({
                    courses: coursesData.length,
                    students: studentsData.length,
                    bookings: bookingsData.length
                });
                
                console.log('Dashboard counts updated:', {
                    courses: coursesData.length,
                    students: studentsData.length,
                    bookings: bookingsData.length
                });
            } catch (err) { 
                console.error('Dashboard fetch error:', err);
                setError('Failed to load dashboard data. Please check if the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    const cards = [
        { label: 'Total Courses', value: counts.courses, icon: 'bi-book-half', color: '#6366f1' },
        { label: 'Active Students', value: counts.students, icon: 'bi-people-fill', color: '#4f46e5' },
        { label: 'Enrollments', value: counts.bookings, icon: 'bi-card-checklist', color: '#4338ca' }
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-up">
            {error && (
                <Alert variant="danger" className="mb-4" style={{ borderRadius: '16px' }}>
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div>
                            <strong>Error:</strong> {error}
                            <div className="small mt-1">
                                Make sure the backend is running on http://localhost:8080
                            </div>
                        </div>
                    </div>
                </Alert>
            )}
            
            <header className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <div 
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            borderRadius: '14px',
                            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
                        }}
                    >
                        <i className="bi bi-speedometer2 text-white fs-5"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px' }}>Dashboard Overview</h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Monitor your enrollment system performance in real-time</p>
                    </div>
                </div>
            </header>

            <Row className="g-4 mb-5">
                {cards.map((card, i) => (
                    <Col md={4} key={i}>
                        <Card className="stat-card border-0 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-2 text-uppercase fw-semibold" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                                        {card.label}
                                    </p>
                                    <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem', color: card.color }}>
                                        {card.value}
                                    </h2>
                                </div>
                                <div 
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        background: `${card.color}10`,
                                        borderRadius: '16px',
                                        border: `3px solid ${card.color}`,
                                        boxShadow: `0 8px 20px ${card.color}30`
                                    }}
                                >
                                    <i className={`bi ${card.icon} fs-2`} style={{ color: card.color }}></i>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="stat-card border-0 h-100" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="fw-bold mb-3" style={{ fontSize: '1.5rem' }}>Welcome to EduFlow</h4>
                                <p className="mb-3 opacity-90" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                    Streamline your academic operations with our intelligent enrollment management platform. 
                                    Track courses, manage students, and monitor enrollments all in one place.
                                </p>
                                <div className="d-flex gap-3 mt-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-lightning-charge-fill"></i>
                                        <span className="small">Real-time Updates</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-stars"></i>
                                        <span className="small">Easy Management</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-shield-fill-check"></i>
                                        <span className="small">Secure & Reliable</span>
                                    </div>
                                </div>
                            </div>
                            <i className="bi bi-rocket-takeoff-fill d-none d-lg-block" style={{ fontSize: '8rem', opacity: '0.15' }}></i>
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="stat-card border-0 h-100">
                        <div className="text-center">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center mb-3"
                                style={{
                                    width: '72px',
                                    height: '72px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    borderRadius: '18px',
                                    boxShadow: '0 12px 24px rgba(79, 70, 229, 0.3)'
                                }}
                            >
                                <i className="bi bi-activity text-white fs-2"></i>
                            </div>
                            <h5 className="fw-bold mb-2">System Status</h5>
                            <p className="text-muted small mb-3">All systems operational</p>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <div 
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        background: '#10b981',
                                        borderRadius: '50%',
                                        boxShadow: '0 0 8px #10b981',
                                        animation: 'pulse 2s infinite'
                                    }}
                                ></div>
                                <span className="small text-success fw-semibold">Online</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
