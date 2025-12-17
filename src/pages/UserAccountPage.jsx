import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { 
  Linkedin, Globe, FileText, Link as LinkIcon, 
  Award, BookOpen, CheckCircle, ExternalLink, Plus 
} from 'lucide-react';

export default function UserAccountPage() {
    const { userProfile } = useAuth();
    const isInstructor = userProfile?.is_instructor;

    return (
        <div className="container py-5" style={{ marginTop: '70px' }}>
            <div className="row g-4">
                {/* Profile Header */}
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <div className="d-flex align-items-center gap-4">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2" style={{width: '100px', height: '100px'}}>
                                {userProfile?.full_name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="fw-bold mb-1">{userProfile?.full_name}</h2>
                                <span className="badge bg-light text-primary border border-primary-subtle rounded-pill">
                                    {isInstructor ? 'Verified Instructor' : 'Active Student'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column: Personal Info & Links */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h6 className="fw-bold mb-4">Connect & Professional</h6>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center gap-2 text-muted">
                                <Linkedin size={18} className="text-primary"/> 
                                <input className="form-control form-control-sm border-0 bg-light" placeholder="LinkedIn URL" />
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted">
                                <Globe size={18} className="text-success"/> 
                                <input className="form-control form-control-sm border-0 bg-light" placeholder="Portfolio Website" />
                            </div>
                            <div className="d-flex align-items-center gap-2 text-muted">
                                <FileText size={18} className="text-danger"/> 
                                <button className="btn btn-sm btn-light w-100 text-start border-0 text-muted">Upload CV / Resume</button>
                            </div>
                        </div>
                    </div>

                    {isInstructor && (
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                                Articles & Publications <Plus size={16} className="cursor-pointer text-primary"/>
                            </h6>
                            <p className="text-muted x-small">No articles linked yet.</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Experience / Projects or Learning Progress */}
                <div className="col-lg-8">
                    {isInstructor ? (
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4 d-flex justify-content-between">
                                Featured Projects
                                <button className="btn btn-sm btn-outline-primary rounded-pill">+ Add Project</button>
                            </h5>
                            <div className="bg-light p-5 rounded-4 text-center border border-dashed">
                                <LinkIcon className="text-muted mb-2" />
                                <p className="text-muted mb-0">Showcase your work to your students.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <Award className="text-warning mb-3" size={32}/>
                                    <h6 className="fw-bold">My Badges</h6>
                                    <p className="text-muted small">Complete courses to earn certificates.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <CheckCircle className="text-success mb-3" size={32}/>
                                    <h6 className="fw-bold">Courses Completed</h6>
                                    <h2 className="fw-bold">0</h2>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}