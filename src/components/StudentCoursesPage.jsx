import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function StudentCoursesPage() {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Updated to your local API pattern
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
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading your classroom...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '60px' }}>
      <header className="mb-5">
        <h2 className="fw-bold text-dark">Welcome back, {userProfile?.full_name || 'Student'}!</h2>
        <p className="text-muted">You have {courses.length} active courses in progress.</p>
      </header>

      {courses.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border border-dashed">
          <BookOpen size={48} className="text-muted mb-3" />
          <h4>No courses enrolled yet</h4>
          <p className="text-muted">Explore our catalog to start your learning journey.</p>
          <Link to="/courses" className="btn btn-primary rounded-pill px-4">Browse Catalog</Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((c) => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                {/* Course Thumbnail */}
                <img 
                  src={c.image || 'https://via.placeholder.com/400x225?text=Course+Thumbnail'} 
                  className="card-img-top" 
                  alt={c.title}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary-soft text-primary rounded-pill px-3 py-2" style={{ fontSize: '11px', backgroundColor: '#e7f0ff' }}>
                      {c.category || 'General'}
                    </span>
                    <small className="text-muted d-flex align-items-center">
                      <Clock size={14} className="me-1" /> {c.duration || 'Self-paced'}
                    </small>
                  </div>

                  <h5 className="card-title fw-bold mb-2 text-truncate-2" style={{ minHeight: '48px' }}>
                    {c.title}
                  </h5>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted small">Progress</small>
                      <small className="fw-bold">{c.progress || 0}%</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${c.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link 
                    to={`/student/course/${c.id}`} 
                    className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                  >
                    Continue Learning <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}