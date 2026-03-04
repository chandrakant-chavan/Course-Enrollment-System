import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, Spinner, Row, Col, Badge, Alert } from 'react-bootstrap';
import { courseService } from '../services/api';

const courses = () => {
    const [courses, setcourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ courseCode: '', courseName: '', description: '', startDate: '', maxCapacity: 30, fees: 0, duration: 1 });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchcourses();
    }, []);

    const fetchcourses = async () => {
        try {
            const res = await courseService.getAll();
            setcourses(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setInitialLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Validate required fields
            if (!formData.courseCode || !formData.courseName || !formData.description || !formData.startDate) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            // Create payload with proper field mapping for backend
            const payload = {
                courseCode: formData.courseCode.trim().toUpperCase(),
                courseName: formData.courseName.trim(),
                description: formData.description.trim(),
                startDate: formData.startDate, // ISO format from datetime-local input
                maxCapacity: parseInt(formData.maxCapacity) || 30,
                fees: parseFloat(formData.fees) || 0,
                duration: parseInt(formData.duration) || 1
            };
            
            console.log('Sending course payload:', payload);
            
            if (editingCourse) {
                const response = await courseService.update(editingCourse.id, payload);
                console.log('Update response:', response.data);
            } else {
                const response = await courseService.add(payload);
                console.log('Add response:', response.data);
            }
            
            setShowModal(false);
            setFormData({ courseCode: '', courseName: '', description: '', startDate: '', maxCapacity: 30, fees: 0, duration: 1 });
            setEditingCourse(null);
            await fetchcourses();
        } catch (err) { 
            console.error('Course submission error:', err);
            console.error('Error response:', err.response);
            
            // Handle different error types
            if (err.response?.status === 400) {
                // Validation error
                if (err.response.data?.data && typeof err.response.data.data === 'object') {
                    const validationErrors = Object.entries(err.response.data.data)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join('\n');
                    setError(validationErrors);
                } else {
                    setError(err.response.data?.message || 'Validation failed. Please check all fields.');
                }
            } else if (err.response?.status === 409) {
                // Duplicate course
                setError('A course with this code already exists. Please use a different course code.');
            } else if (err.message === 'Network Error') {
                setError('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to save course. Please try again.');
            }
        }
        finally { setLoading(false); }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        const formattedTime = course.startDate ? new Date(course.startDate).toISOString().slice(0, 16) : '';
        setFormData({
            courseCode: course.courseCode || course.courseNumber,
            courseName: course.courseName || course.origin,
            description: course.description || course.destination,
            startDate: formattedTime,
            maxCapacity: course.maxCapacity || course.totalSeats,
            fees: course.fees || course.price,
            duration: course.duration || 1
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        console.log('=== DELETE FUNCTION CALLED ===');
        console.log('Course ID to delete:', id);
        console.log('Current courses in state:', courses.length);
        
        if (!id) {
            alert("Invalid course ID");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this course? This action cannot be undone.");
        console.log('User confirmed delete:', confirmDelete);
        
        if (confirmDelete) {
            try {
                console.log('Calling API to delete course...');
                const response = await courseService.delete(id);
                console.log('✓ Delete API response:', response.data);
                
                // Immediately update the UI by removing the deleted course from state
                console.log('Updating state to remove course...');
                setcourses(prevCourses => {
                    const newCourses = prevCourses.filter(course => course.id !== id);
                    console.log('Previous courses count:', prevCourses.length);
                    console.log('New courses count:', newCourses.length);
                    return newCourses;
                });
                
                alert("✓ Course deleted successfully!");
                
                // Also refresh from server to ensure sync
                console.log('Fetching updated course list from server...');
                await fetchcourses();
                console.log('✓ Course list refreshed');
            } catch (err) { 
                console.error('✗ Delete error:', err);
                console.error('Error response:', err.response);
                
                let errorMessage = "Failed to delete course";
                
                if (err.response?.status === 400) {
                    errorMessage = err.response.data?.message || "Cannot delete course. It may have active enrollments.";
                } else if (err.response?.status === 404) {
                    errorMessage = "Course not found. It may have been already deleted.";
                    // Remove from UI anyway if 404
                    setcourses(prevCourses => prevCourses.filter(course => course.id !== id));
                } else if (err.message === 'Network Error') {
                    errorMessage = "Cannot connect to server. Please make sure the backend is running.";
                } else {
                    errorMessage = err.response?.data?.message || err.message || "Failed to delete course";
                }
                
                alert("✗ " + errorMessage);
            }
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchcourses();
            return;
        }
        try {
            const res = await courseService.search(searchTerm);
            setcourses(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCourse(null);
        setFormData({ courseCode: '', courseName: '', description: '', startDate: '', maxCapacity: 30, fees: 0, duration: 1 });
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
                            <i className="bi bi-book-half text-white fs-5"></i>
                        </div>
                        <div>
                            <h2 className="fw-bold mb-0" style={{ fontSize: '1.85rem', letterSpacing: '-0.5px' }}>Course Catalog</h2>
                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Manage and organize your academic courses</p>
                        </div>
                    </div>
                </div>
                <button className="btn-brand" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-2"></i> Add New Course
                </button>
            </div>

            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                <div className="p-3">
                    <Row className="g-2">
                        <Col md={10}>
                            <Form.Control
                                type="text"
                                placeholder="Search by course code, name, or instructor..."
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
                            <th>COURSE CODE</th>
                            <th>COURSE DETAILS</th>
                            <th>START DATE</th>
                            <th>ENROLLMENT</th>
                            <th>COURSE FEE</th>
                            <th className="text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? courses.map(course => (
                            <tr key={course.id}>
                                <td>
                                    <span className="fw-bold" style={{ color: '#4f46e5', fontSize: '0.95rem' }}>
                                        {course.courseNumber}
                                    </span>
                                </td>
                                <td>
                                    <div>
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>
                                            {course.origin}
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-person-badge text-muted" style={{ fontSize: '0.85rem' }}></i>
                                            <span className="text-muted small">{course.destination}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-check text-muted"></i>
                                        <span className="small text-muted">
                                            {new Date(course.departureTime).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div 
                                            className="px-3 py-2 rounded-pill fw-semibold d-inline-flex align-items-center gap-2" 
                                            style={{ 
                                                background: course.availableSeats > 0 ? '#dcfce7' : '#fee2e2', 
                                                color: course.availableSeats > 0 ? '#166534' : '#991b1b',
                                                fontSize: '0.8rem' 
                                            }}
                                        >
                                            <i className={`bi ${course.availableSeats > 0 ? 'bi-person-check-fill' : 'bi-person-x-fill'}`}></i>
                                            {course.availableSeats}/{course.totalSeats} Available
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                                        ${course.price.toFixed(2)}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <Button 
                                        variant="link" 
                                        className="p-2 me-2" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Edit clicked for course:', course.id);
                                            handleEdit(course);
                                        }}
                                        style={{ color: '#4f46e5', cursor: 'pointer' }}
                                        title="Edit Course"
                                    >
                                        <i className="bi bi-pencil-square fs-5"></i>
                                    </Button>
                                    <Button 
                                        variant="link" 
                                        className="p-2" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Delete clicked for course:', course.id);
                                            handleDelete(course.id);
                                        }}
                                        style={{ color: '#dc2626', cursor: 'pointer' }}
                                        title="Delete Course"
                                    >
                                        <i className="bi bi-trash3 fs-5"></i>
                                    </Button>
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
                                            <p className="fw-semibold text-dark mb-1">No courses available</p>
                                            <p className="text-muted small mb-0">Click "Add New Course" to create your first course</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showModal} onHide={handleModalClose} centered size="lg" contentClassName="border-0 shadow-lg" style={{ borderRadius: '24px' }}>
                <Modal.Header closeButton className="p-4 border-0">
                    <Modal.Title className="fw-bold">{editingCourse ? 'Edit Course Details' : 'Create New Course'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="p-4">
                        {error && (
                            <Alert variant="danger" className="py-3 mb-4" style={{ borderRadius: '12px' }}>
                                <div className="d-flex align-items-start gap-2">
                                    <i className="bi bi-exclamation-triangle-fill mt-1"></i>
                                    <div>
                                        <strong>Error:</strong>
                                        <div className="small mt-1">{error}</div>
                                    </div>
                                </div>
                            </Alert>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                Course Code
                            </Form.Label>
                            <Form.Control
                                type="text" 
                                placeholder="e.g., CS-101, MATH-201" 
                                className="form-input-brand shadow-none"
                                value={formData.courseCode} 
                                onChange={e => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                        Course Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder="e.g., Introduction to Computer Science" 
                                        className="form-input-brand shadow-none"
                                        value={formData.courseName} 
                                        onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                        Instructor Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text" 
                                        placeholder="e.g., Dr. John Smith" 
                                        className="form-input-brand shadow-none"
                                        value={formData.description} 
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                Course Start Date & Time
                            </Form.Label>
                            <Form.Control
                                type="datetime-local" 
                                className="form-input-brand shadow-none"
                                value={formData.startDate} 
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                        Duration (Weeks)
                                    </Form.Label>
                                    <Form.Control
                                        type="number" 
                                        className="form-input-brand shadow-none"
                                        value={formData.duration} 
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        min="1"
                                        placeholder="e.g., 12"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                        Max Capacity
                                    </Form.Label>
                                    <Form.Control
                                        type="number" 
                                        className="form-input-brand shadow-none"
                                        value={formData.maxCapacity} 
                                        onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                                        min="1"
                                        placeholder="e.g., 30"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted small fw-semibold text-uppercase mb-2" style={{ letterSpacing: '0.5px' }}>
                                        Course Fee ($)
                                    </Form.Label>
                                    <Form.Control
                                        type="number" 
                                        step="0.01" 
                                        className="form-input-brand shadow-none"
                                        value={formData.fees} 
                                        onChange={e => setFormData({ ...formData, fees: e.target.value })}
                                        min="0"
                                        placeholder="e.g., 299.99"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
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
                                    <i className={`bi ${editingCourse ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                    {editingCourse ? 'Update Course' : 'Create Course'}
                                </>
                            )}
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default courses;
