import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Button, Navbar, Offcanvas } from 'react-bootstrap';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Enrollments from './pages/Enrollments';

const App = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <Router>
            {/* Sidebar Desktop */}
            <aside className="sidebar d-none d-lg-block">
                <LogoSection />
                <NavigationLinks />
                <SidebarFooter />
            </aside>

            {/* Navbar Mobile only */}
            <Navbar bg="white" className="d-lg-none px-3 shadow-sm sticky-top">
                <Button variant="link" className="p-0 me-3 text-dark" onClick={() => setShowSidebar(true)}>
                    <i className="bi bi-list fs-2"></i>
                </Button>
                <Navbar.Brand className="fw-bold">EduFlow</Navbar.Brand>
            </Navbar>

            {/* Sidebar Mobile (Offcanvas) */}
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="sidebar p-0 scroll-hidden" style={{ width: '280px', border: 'none' }}>
                <Offcanvas.Body className="p-0">
                    <div className="p-4">
                        <LogoSection />
                        <div className="mt-5">
                            <NavigationLinks onLinkClick={() => setShowSidebar(false)} />
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            <main className="main-content">
                <div className="animate-up">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/enrollments" element={<Enrollments />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
};

const LogoSection = () => (
    <div className="text-center mb-5 px-3">
        <div className="position-relative mb-3">
            <div 
                className="d-inline-flex align-items-center justify-content-center" 
                style={{ 
                    width: '70px', 
                    height: '70px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 12px 24px rgba(79, 70, 229, 0.4)'
                }}
            >
                <i className="bi bi-mortarboard-fill fs-2 text-white"></i>
            </div>
        </div>
        <h3 className="fw-bold mb-1" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>EduFlow</h3>
        <small style={{ 
            color: '#c7d2fe', 
            fontSize: '0.7rem', 
            letterSpacing: '3px', 
            fontWeight: '600',
            textTransform: 'uppercase'
        }}>Smart Enrollment</small>
    </div>
);

const NavigationLinks = ({ onLinkClick }) => (
    <nav className="nav flex-column gap-2 px-3">
        <NavLink to="/" className={({ isActive }) => `nav-link-side ${isActive ? 'active' : ''}`} onClick={onLinkClick}>
            <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `nav-link-side ${isActive ? 'active' : ''}`} onClick={onLinkClick}>
            <i className="bi bi-book-half"></i> Course Hub
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `nav-link-side ${isActive ? 'active' : ''}`} onClick={onLinkClick}>
            <i className="bi bi-people-fill"></i> Students
        </NavLink>
        <NavLink to="/enrollments" className={({ isActive }) => `nav-link-side ${isActive ? 'active' : ''}`} onClick={onLinkClick}>
            <i className="bi bi-card-checklist"></i> Enrollments
        </NavLink>
    </nav>
);

const SidebarFooter = () => (
    <div className="position-absolute bottom-0 start-0 w-100 p-4 border-top border-secondary border-opacity-10 mt-auto">
        <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                    width: '36px', 
                    height: '36px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    borderRadius: '10px'
                }}
            >
                <i className="bi bi-sliders text-white"></i>
            </div>
            <span className="small text-white fw-medium">Settings</span>
        </div>
        <p className="small mb-0" style={{ fontSize: '0.7rem', color: '#c7d2fe' }}>
            &copy; 2026 EduFlow Inc. All rights reserved.
        </p>
    </div>
);

export default App;
