import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { studentService } from '../services/api';

const students = () => {
    const [students, setstudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchstudents();
    }, []);

    const fetchstudents = async () => {
        try {
            const res = await studentService.getAll();
            setstudents(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingStudent) {
                await studentService.update(editingStudent.id, formData);
            } else {
                await studentService.register(formData);
            }
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '' });
            setEditingStudent(null);
            fetchstudents();
        } catch (err) { setError(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ name: student.name, email: student.email, phone: student.phone });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await studentService.delete(id);
                fetchstudents();
            } catch (err) { 
                alert("Failed to delete student: " + (err.response?.data?.message || err.message)); 
            }
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchstudents();
            return;
        }
        try {
            const res = await studentService.search(searchTerm);
            setstudents(res.data.data || []);
        } catch (err) { 
            console.error('Search error:', err);
            console.error('Error response:', JSON.stringify(err.response?.data, null, 2));
            alert('Search failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingStudent(null);
        setFormData({ name: '', email: '', phone: '' });
        setError(null);
    };

    if (initialLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="animate-up">
            <div className="d-flex justify-content-between align-items-start mb-5">
                <div>
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
                            <i className="bi bi-people-fill text-white fs-5"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px' }}>Student Directory</h2>
                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Manage student profiles and account information</p>
                        </div>
                    </div>
                </div>
                <button className="btn-brand" onClick={() => setShowModal(true)}>
                    <i className="bi bi-person-plus-fill me-2"></i> Add New Student
                </button>
            </div>

            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                <div className="p-3">
                    <Row className="g-2">
                        <Col md={10}>
                            <Form.Control
                                type="text"
                                placeholder="Search by student name, email, or phone number..."
                                className="form-input-brand shadow-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </Col>
                        <Col md={2}>
                            <Button 
                                className="w-100 btn-brand" 
                                onClick={handleSearch}
                                style={{ height: '100%' }}
                            >
                                <i className="bi bi-search me-2"></i>Search
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                <Table responsive className="table-brand mb-0 align-middle">
                    <thead>
                        <tr>
                            <th>STUDENT ID</th>
                            <th>FULL NAME</th>
                            <th>EMAIL ADDRESS</th>
                            <th>PHONE NUMBER</th>
                            <th className="text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map(student => (
                            <tr key={student.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div 
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                background: 'linear-gradient(135deg, #6366f115 0%, #4f46e515 100%)',
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <i className="bi bi-hash" style={{ color: '#4f46e5', fontSize: '1.1rem' }}></i>
                                        </div>
                                        <span className="small font-monospace text-muted">
                                            {student.id.substring(0, 8)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                            {student.name}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-envelope text-muted" style={{ fontSize: '0.9rem' }}></i>
                                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                            {student.email}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-phone text-muted" style={{ fontSize: '0.9rem' }}></i>
                                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                                            {student.phone}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-end">
                                    <Button 
                                        variant="link" 
                                        className="p-2 me-2" 
                                        onClick={() => handleEdit(student)}
                                        style={{ color: '#4f46e5' }}
                                    >
                                        <i className="bi bi-pencil-square fs-5"></i>
                                    </Button>
                                    <Button 
                                        variant="link" 
                                        className="p-2" 
                                        onClick={() => handleDelete(student.id)}
                                        style={{ color: '#dc2626' }}
                                    >
                                        <i className="bi bi-trash3 fs-5"></i>
                                    </Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5">
                                    <div className="d-flex flex-column align-items-center gap-3">
                                        <div 
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '64px',
                                                height: '64px',
                                                background: '#f1f5f9',
                                                borderRadius: '16px'
                                            }}
                                        >
                                            <i className="bi bi-person-slash fs-2 text-muted"></i>
                                        </div>
                                        <div>
                                            <p className="fw-semibold text-dark mb-1">No students found</p>
                                            <p className="text-muted small mb-0">Click "Add New Student" to register your first student</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleModalClose} centered contentClassName="border-0 shadow-lg" style={{ borderRadius: '24px' }}>
                <Modal.Header closeButton className="p-4 border-0">
                    <Modal.Title className="fw-bold">
                        {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4">
                        {error && (
                            <Alert variant="danger" className="py-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: '12px' }}>
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <span>{error}</span>
                            </Alert>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                Full Name
                            </Form.Label>
                            <Form.Control
                                type="text" 
                                placeholder="e.g., John Michael Smith" 
                                className="form-input-brand shadow-none"
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                Email Address
                            </Form.Label>
                            <Form.Control
                                type="email" 
                                placeholder="e.g., john.smith@university.edu" 
                                className="form-input-brand shadow-none"
                                value={formData.email} 
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Form.Text className="text-muted small">
                                This will be used for account login and notifications
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                Phone Number
                            </Form.Label>
                            <Form.Control
                                type="text" 
                                placeholder="e.g., +1 (555) 123-4567" 
                                className="form-input-brand shadow-none"
                                value={formData.phone} 
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                            <Form.Text className="text-muted small">
                                Include country code for international numbers
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 p-4 pt-0">
                        <Button 
                            variant="light" 
                            onClick={handleModalClose}
                            className="px-4 py-2"
                            style={{ borderRadius: '12px' }}
                        >
                            Cancel
                        </Button>
                        <button 
                            type="submit" 
                            className="btn-brand px-4" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className={`bi ${editingStudent ? 'bi-check-lg' : 'bi-person-plus-fill'} me-2`}></i>
                                    {editingStudent ? 'Update Profile' : 'Register Student'}
                                </>
                            )}
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default students;