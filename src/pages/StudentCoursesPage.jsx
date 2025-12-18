import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, Layout } from 'lucide-react';

export default function StudentCoursesPage() {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Ensure your Django backend has this endpoint configured
        const res = await fetch("http://127.0.0.1:8000/api/student/courses/");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted fw-medium">Preparing your classroom...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '70px' }}>
      <style>{`
        .bg-primary-soft {
            background-color: rgba(13, 110, 253, 0.1) !important;
            color: #0d6efd;
        }
        .hover-shadow {
            transition: all 0.3s ease;
            border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .hover-shadow:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important;
        }
        .text-truncate-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }
        .progress-thin {
            height: 6px;
            border-radius: 10px;
            background-color: #eee;
        }
      `}</style>

      <header className="mb-5">
        <div className="d-flex align-items-center gap-2 mb-2">
            <Layout size={20} className="text-primary" />
            <span className="text-uppercase small fw-bold text-primary tracking-wider">Student Dashboard</span>
        </div>
        <h2 className="fw-bold text-dark display-6">Welcome back, {userProfile?.full_name || 'Learner'}!</h2>
        <p className="text-muted fs-5">Pick up exactly where you left off.</p>
      </header>

      {courses.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed border-primary border-opacity-25">
          <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
            <BookOpen size={48} className="text-muted opacity-50" />
          </div>
          <h4 className="fw-bold">Your classroom is empty</h4>
          <p className="text-muted mb-4">You haven't enrolled in any courses yet. Ready to start?</p>
          <Link to="/courses" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow">
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((c) => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow rounded-4 overflow-hidden bg-white">
                {/* Course Thumbnail */}
                <div className="position-relative">
                    <img 
                      src={c.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'} 
                      className="card-img-top" 
                      alt={c.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-dark bg-opacity-75 backdrop-blur px-3 py-2 rounded-pill small">
                             {c.category || 'Course'}
                        </span>
                    </div>
                </div>
                
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-3 text-truncate-2" style={{ minHeight: '48px', lineHeight: '1.4' }}>
                    {c.title}
                  </h5>
                  
                  {/* Progress Section */}
                  <div className="mb-4 bg-light p-3 rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted fw-medium">Your Progress</small>
                      <small className="fw-bold text-primary">{c.progress || 0}%</small>
                    </div>
                    <div className="progress progress-thin">
                      <div 
                        className="progress-bar bg-primary shadow-sm" 
                        role="progressbar" 
                        style={{ width: `${c.progress || 0}%` }}
                        aria-valuenow={c.progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    <Link 
                        to={`/student/course/${c.id}`} 
                        className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-bold transition-all"
                    >
                        Continue Learning <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}