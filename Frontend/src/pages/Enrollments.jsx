import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Alert, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { bookingService, courseService, studentService } from '../services/api';

const Enrollments = () => {
    const [bookings, setBookings] = useState([]);
    const [courses, setcourses] = useState([]);
    const [students, setstudents] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filters, setFilters] = useState({ courseId: '', studentId: '' });
    const [formData, setFormData] = useState({ studentId: '', courseNumber: '', passengerName: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, bookings]);

    const refreshData = async () => {
        try {
            const [bRes, fRes, cRes] = await Promise.all([
                bookingService.getAll(),
                courseService.getAll(),
                studentService.getAll()
            ]);
            setBookings(bRes.data.data || []);
            setcourses(fRes.data.data || []);
            setstudents(cRes.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const applyFilters = () => {
        let filtered = [...bookings];
        if (filters.courseId) {
            filtered = filtered.filter(b => b.courseId === filters.courseId);
        }
        if (filters.studentId) {
            filtered = filtered.filter(b => b.studentId === filters.studentId);
        }
        setFilteredBookings(filtered);
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await bookingService.book(formData);
            setSuccess("Reservation completed successfully!");
            setFormData({ studentId: '', courseNumber: '', passengerName: '' });
            refreshData();
        } catch (err) { setError(err.response?.data?.message || err.message); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Confirm permanent cancellation of this selected record?")) {
            try {
                await bookingService.cancel(id);
                refreshData();
            } catch (err) { alert("Action failed"); }
        }
    };

    if (initialLoading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    return (
        <div className="animate-up">
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
                        <i className="bi bi-card-checklist text-white fs-5"></i>
                    </div>
                    <div>
                        <h2 className="fw-bold mb-0" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px' }}>Enrollment Center</h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Process student enrollments and manage registrations</p>
                    </div>
                </div>
            </header>

            <Row className="g-4">
                <Col lg={4}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '24px', position: 'sticky', top: '2rem' }}>
                        <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <div 
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'linear-gradient(135deg, #6366f115 0%, #4f46e515 100%)',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <i className="bi bi-person-fill-add" style={{ color: '#4f46e5', fontSize: '1rem' }}></i>
                                </div>
                                <h5 className="fw-bold mb-0">New Enrollment</h5>
                            </div>
                            <p className="text-muted small mb-0">Register a student for a course</p>
                        </div>
                        
                        <Form onSubmit={handleBook}>
                            {error && (
                                <Alert variant="danger" className="py-3 mb-3 d-flex align-items-center gap-2" style={{ borderRadius: '12px' }}>
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                    <span className="small">{error}</span>
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" className="py-3 mb-3 d-flex align-items-center gap-2" style={{ borderRadius: '12px' }}>
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span className="small">{success}</span>
                                </Alert>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                    Select Student
                                </Form.Label>
                                <Form.Select
                                    className="form-input-brand shadow-none" 
                                    required
                                    value={formData.studentId} 
                                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                    Select Course
                                </Form.Label>
                                <Form.Select
                                    className="form-input-brand shadow-none" 
                                    required
                                    value={formData.courseNumber} 
                                    onChange={e => setFormData({ ...formData, courseNumber: e.target.value })}
                                >
                                    <option value="">Choose a course...</option>
                                    {courses.map(f => (
                                        <option key={f.id} value={f.courseNumber}>
                                            {f.courseNumber} - {f.origin} ({f.availableSeats} seats available)
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                    Student Display Name
                                </Form.Label>
                                <Form.Control
                                    type="text" 
                                    placeholder="e.g., John Smith" 
                                    className="form-input-brand shadow-none"
                                    value={formData.passengerName} 
                                    onChange={e => setFormData({ ...formData, passengerName: e.target.value })}
                                    required
                                />
                                <Form.Text className="text-muted small">
                                    Name as it will appear on enrollment records
                                </Form.Text>
                            </Form.Group>

                            <button 
                                type="submit" 
                                className="btn-brand w-100 py-3" 
                                disabled={loading}
                                style={{ fontSize: '0.95rem', fontWeight: '600' }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>
                                        Confirm Enrollment
                                    </>
                                )}
                            </button>
                        </Form>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                        <div className="p-4 bg-white border-bottom">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div 
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'linear-gradient(135deg, #6366f115 0%, #4f46e515 100%)',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <i className="bi bi-funnel text-muted"></i>
                                    </div>
                                    <h5 className="fw-bold mb-0">Enrollment Records</h5>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-funnel text-muted"></i>
                                    <span className="small text-muted">Filter Results</span>
                                </div>
                            </div>
                            <Row className="g-2">
                                <Col md={5}>
                                    <Form.Select
                                        size="sm" 
                                        className="form-input-brand shadow-none"
                                        value={filters.courseId} 
                                        onChange={e => setFilters({ ...filters, courseId: e.target.value })}
                                    >
                                        <option value="">All Courses</option>
                                        {courses.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.courseNumber} - {f.origin}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col md={5}>
                                    <Form.Select
                                        size="sm" 
                                        className="form-input-brand shadow-none"
                                        value={filters.studentId} 
                                        onChange={e => setFilters({ ...filters, studentId: e.target.value })}
                                    >
                                        <option value="">All Students</option>
                                        {students.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>
                                </Col>
                                <Col md={2}>
                                    <Button 
                                        variant="light" 
                                        size="sm" 
                                        className="w-100" 
                                        onClick={() => setFilters({ courseId: '', studentId: '' })}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Clear
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                        <Table responsive className="table-brand mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>STUDENT NAME</th>
                                    <th>COURSE CODE</th>
                                    <th>SEAT NO.</th>
                                    <th>STATUS</th>
                                    <th>COURSE FEE</th>
                                    <th className="text-end">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div 
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        background: '#f1f5f9',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    <i className="bi bi-person text-muted"></i>
                                                </div>
                                                <span className="fw-semibold text-dark">{b.studentName || b.passengerName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-monospace fw-semibold" style={{ color: '#4f46e5', fontSize: '0.9rem' }}>
                                                {b.courseNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <span 
                                                className="px-3 py-1 rounded-pill fw-semibold" 
                                                style={{ 
                                                    background: '#6366f115', 
                                                    color: '#4f46e5',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {b.seatNumber || 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${b.status === 'CONFIRMED' ? 'badge-confirm' : 'badge-cancel'}`}>
                                                <i className={`bi ${b.status === 'CONFIRMED' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                                                ${b.totalAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            {b.status === 'CONFIRMED' && (
                                                <Button 
                                                    variant="link" 
                                                    className="p-2" 
                                                    title="Cancel Enrollment" 
                                                    onClick={() => handleCancel(b.id)}
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    <i className="bi bi-x-circle fs-5"></i>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
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
                                                    <i className="bi bi-inbox fs-2 text-muted"></i>
                                                </div>
                                                <div>
                                                    <p className="fw-semibold text-dark mb-1">No enrollment records found</p>
                                                    <p className="text-muted small mb-0">Enroll students to see records here</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Enrollments;
