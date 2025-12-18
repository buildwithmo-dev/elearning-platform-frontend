import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PlayCircle, FileText, Code, CheckCircle, ChevronLeft, Layout, AlertCircle, Terminal } from 'lucide-react';
import SandboxRunner from "../components/SandboxRunner";

export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
            setLessons(data);
            if (data.length > 0) setActiveLesson(data[0]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        // Slight delay to make the transition feel smoother
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchCurriculum();
  }, [courseId]);

  // --- SKELETON UI COMPONENTS ---
  const SidebarSkeleton = () => (
    <div className="p-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="mb-4 d-flex align-items-center gap-3">
          <div className="skeleton-box" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
          <div className="flex-grow-1">
            <div className="skeleton-box mb-2" style={{ width: '70%', height: '14px' }}></div>
            <div className="skeleton-box" style={{ width: '40%', height: '10px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );

  const PlayerSkeleton = () => (
    <div className="p-4 p-lg-5 w-100">
      <div className="skeleton-box mb-4" style={{ width: '40%', height: '32px' }}></div>
      <div className="skeleton-box rounded-4 mb-4" style={{ width: '100%', height: '500px' }}></div>
      <div className="skeleton-box" style={{ width: '100%', height: '100px' }}></div>
    </div>
  );

  return (
    <div className="container-fluid g-0" style={{ marginTop: '60px' }}>
      <style>{`
        .skeleton-box {
          background: #eee;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: shine 1.5s linear infinite;
        }
        @keyframes shine {
          to { background-position-x: -200%; }
        }
        .sidebar-panel { height: calc(100vh - 60px); overflow-y: auto; background: #fff; }
        .content-panel { height: calc(100vh - 60px); overflow-y: auto; background: #fcfcfc; }
        .lesson-active { border-left: 4px solid #0d6efd !important; background-color: #f0f7ff !important; color: #0d6efd !important; }
        .content-card { min-height: 500px; }
      `}</style>

      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 border-end sidebar-panel">
          <div className="p-3 border-bottom sticky-top bg-white z-1">
            <Link to="/courses" className="text-decoration-none small text-muted d-flex align-items-center mb-2">
                <ChevronLeft size={14}/> Catalog
            </Link>
            <h6 className="fw-bold mb-0">Course Content</h6>
            <small className="text-muted">{lessons.length} Lessons Available</small>
          </div>

          {loading ? (
            <SidebarSkeleton />
          ) : lessons.length > 0 ? (
            <div className="list-group list-group-flush">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 ${
                    activeLesson?.id === lesson.id ? "lesson-active" : ""
                  }`}
                >
                  <span className="opacity-50 small fw-bold text-center" style={{width: '20px'}}>{index + 1}</span>
                  <div className="flex-grow-1 text-truncate">
                    <div className="small fw-bold text-truncate">{lesson.title}</div>
                    <div className="x-small text-muted text-uppercase d-flex align-items-center gap-1">
                        {lesson.content_type === 'video' && <PlayCircle size={10}/>}
                        {lesson.content_type === 'sandbox' && <Terminal size={10}/>}
                        {lesson.content_type === 'document' && <FileText size={10}/>}
                        {lesson.content_type}
                    </div>
                  </div>
                  {lesson.completed && <CheckCircle size={14} className="text-success" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center mt-5">
              <Layout size={40} className="text-muted mb-3 opacity-25" />
              <p className="text-muted small">No curriculum available for this course.</p>
            </div>
          )}
        </div>

        {/* Player View */}
        <div className="col-md-9 content-panel">
          {loading ? (
            <PlayerSkeleton />
          ) : activeLesson ? (
            <div className="p-4 p-lg-5 mx-auto" style={{ maxWidth: '1100px' }}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1">{activeLesson.title}</h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 small">
                            <li className="breadcrumb-item text-primary">Curriculum</li>
                            <li className="breadcrumb-item active text-capitalize">{activeLesson.content_type}</li>
                        </ol>
                    </nav>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white content-card">
                {activeLesson.content_type === "video" && (
                  <div className="ratio ratio-16x9 bg-dark shadow-inner">
                    <video 
                        key={activeLesson.content_url} 
                        src={activeLesson.content_url} 
                        controls 
                        className="w-100" 
                        poster="/video-placeholder.png"
                    />
                  </div>
                )}

                {activeLesson.content_type === "document" && (
                  <div className="p-5 text-center my-auto">
                    <div className="bg-light rounded-circle d-inline-flex p-4 mb-4">
                        <FileText size={64} className="text-primary opacity-75" />
                    </div>
                    <h4>Supplemental Material</h4>
                    <p className="text-muted mx-auto" style={{maxWidth: '400px'}}>
                        This lesson includes a downloadable resource to assist your learning. 
                        Click the button below to open the PDF in a new tab.
                    </p>
                    <a href={activeLesson.content_url} target="_blank" rel="noreferrer" className="btn btn-primary px-5 rounded-pill fw-bold shadow-sm">
                        Open Document
                    </a>
                  </div>
                )}

                {activeLesson.content_type === "sandbox" && (
                  <div className="h-100" style={{ minHeight: '600px' }}>
                    <SandboxRunner 
                        lesson={{
                            ...activeLesson,
                            // Crash-proofing fallback values for missing DB columns
                            language: activeLesson.language || "python",
                            starter_code: activeLesson.starter_code || "# Write your code here\nprint('Hello World')"
                        }} 
                    />
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-4 border shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="bg-primary p-1 rounded"></div>
                    <h5 className="fw-bold mb-0">Lesson Description</h5>
                </div>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    {activeLesson.description || "The instructor hasn't provided a detailed description for this lesson, but the provided content is ready for your review."}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-light border-start">
              <div className="text-center p-5 bg-white rounded-5 shadow-sm border" style={{ maxWidth: '400px' }}>
                <AlertCircle size={48} className="text-warning mb-3 opacity-50" />
                <h5 className="fw-bold">Curriculum Empty</h5>
                <p className="text-muted small">
                  This course currently has no lessons or modules assigned. Please check back later or browse other courses.
                </p>
                <Link to="/courses" className="btn btn-outline-dark btn-sm rounded-pill px-4 mt-2">Browse Catalog</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}