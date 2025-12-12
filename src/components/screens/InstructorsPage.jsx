import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import InstructorSettingsForm from '../InstructorSettingsForm'; 

export default function InstructorsPage() {
    const { userProfile, loading } = useAuth();
    // State to track the active view: 'dashboard' or 'settings'
    const [activeView, setActiveView] = useState('dashboard');

    // 1. Handle Loading State
    if (loading && !userProfile) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading profile data...</p>
                </div>
            </div>
        );
    }

    // 2. Handle Unauthorized Access
    if (!userProfile || !userProfile.is_instructor) {
        return (
            <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: '80vh' }}>
                <div className="text-center alert alert-danger p-5 shadow-lg" style={{ maxWidth: '450px' }}>
                    <h2>Access Denied</h2>
                    <p className="mt-3">You must be logged in as an instructor to view this page.</p>
                    <Link to="/auth" className="btn btn-primary mt-3">Go to Login</Link>
                </div>
            </div>
        );
    }
    
    // Function to render the correct content based on the active view
    const renderMainContent = () => {
        switch (activeView) {
            case 'settings':
                return <InstructorSettingsForm />;
            case 'dashboard':
            default:
                return (
                    <>
                        <h2>Instructor Dashboard</h2>
                        <p className="text-muted">Manage your courses, students, and earnings here.</p>
        
                        {/* Stats */}
                        <div className="row mt-4">
                            <div className="col-sm-6 mb-3">
                                <div className="card p-3 text-center border-primary">
                                    <h6>Total Published Courses</h6>
                                    <p className="display-6">**0**</p>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <div className="card p-3 text-center border-success">
                                    <h6>Pending Drafts</h6>
                                    <p className="display-6">**0**</p>
                                </div>
                            </div>
                        </div>
        
                        {/* Placeholder sections */}
                        <div className="mt-4">
                            <h5>Weekly Performance</h5>
                            <p className="text-muted">Performance graphs go here.</p>
        
                            <h5 className="mt-4">Latest Student Reviews</h5>
                            <p className="text-muted">Recent feedback from students will be displayed here.</p>
        
                            <h5 className="mt-4">Quick Actions</h5>
                            <p><Link to="#" className="btn btn-outline-primary">Create New Course</Link></p>
                        </div>
        
                        <p className="text-muted mt-4">Instructor ID: {userProfile.id}</p>
                    </>
                );
        }
    };


    // 3. Dashboard (Authorized View)
    return (
        // Wrapper remains full width with manual padding
        <div className="w-100 py-5 px-5"> 
            
            {/* FINAL BRUTE-FORCE FIX: Added w-100 to the row */}
            <div className="row mt-4 w-100"> 
                
                {/* Sidebar (col-md-3) */}
                <div className="col-md-3 mb-3">
                    <div className="card p-3 shadow-sm w-100">
                        <h5 className="card-title text-primary">Welcome, {userProfile.full_name}!</h5>
                        <hr />
                        <ul className="list-unstyled">
                            {/* Dashboard Overview */}
                            <li className="mb-2">
                                <Link 
                                    to="#" 
                                    onClick={() => setActiveView('dashboard')}
                                    className={activeView === 'dashboard' ? 'fw-bold text-dark' : 'text-decoration-none'}
                                >
                                    Dashboard Overview
                                </Link>
                            </li>

                            <li className="mb-2"><Link to="#">Manage Courses</Link></li>
                            <li className="mb-2"><Link to="#">View Students</Link></li>
                            <li className="mb-2"><Link to="#">Earnings Report</Link></li>

                            {/* Profile Settings */}
                            <li className="mb-2">
                                <Link 
                                    to="#" 
                                    onClick={() => setActiveView('settings')}
                                    className={activeView === 'settings' ? 'fw-bold text-dark' : 'text-decoration-none'}
                                >
                                    Profile Settings
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content (col-md-9) */}
                <div className="col-md-9 mb-3">
                    <div className="card p-4 shadow-sm w-100">
                        {renderMainContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}