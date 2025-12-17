import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useParams } from "react-router-dom";
import { PlayCircle, FileText, Code, CheckCircle } from 'lucide-react';
import SandboxRunner from "./SandboxRunner";

export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const { userProfile } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/`);
        const data = await res.json();
        setLessons(data);
        if (data.length > 0) setActiveLesson(data[0]); // Auto-select first lesson
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  if (loading) return <div className="p-5 text-center">Loading Course Content...</div>;

  return (
    <div className="container-fluid g-0" style={{ marginTop: '60px' }}>
      <div className="row g-0">
        {/* Sidebar: Lesson List */}
        <div className="col-md-3 bg-light border-end vh-100 overflow-auto">
          <div className="p-3 border-bottom bg-white sticky-top">
            <h6 className="fw-bold mb-0">Course Content</h6>
            <small className="text-muted">{lessons.length} Lessons</small>
          </div>
          <div className="list-group list-group-flush">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center ${
                  activeLesson?.id === lesson.id ? "bg-primary text-white" : ""
                }`}
              >
                <span className="me-3 opacity-75">{index + 1}</span>
                <div className="me-auto">
                  <div className="small fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                    {lesson.title}
                  </div>
                  <div className={`x-small ${activeLesson?.id === lesson.id ? "text-white-50" : "text-muted"}`}>
                    {lesson.content_type === 'video' && <><PlayCircle size={12} /> Video</>}
                    {lesson.content_type === 'document' && <><FileText size={12} /> PDF</>}
                    {lesson.content_type === 'sandbox' && <><Code size={12} /> Lab</>}
                  </div>
                </div>
                {lesson.completed && <CheckCircle size={16} className="text-success" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Viewport: Active Lesson Content */}
        <div className="col-md-9 vh-100 overflow-auto bg-white">
          {activeLesson ? (
            <div className="p-4 p-lg-5">
              <h2 className="fw-bold mb-4">{activeLesson.title}</h2>
              
              <div className="shadow-sm rounded overflow-hidden border">
                {activeLesson.content_type === "video" && (
                  <div className="ratio ratio-16x9 bg-dark">
                    <video src={activeLesson.content_url} controls poster="/thumb.png" />
                  </div>
                )}

                {activeLesson.content_type === "document" && (
                  <div className="p-5 text-center bg-light">
                    <FileText size={48} className="text-primary mb-3" />
                    <h4>Reading Material</h4>
                    <p className="text-muted">This lesson includes a downloadable resource.</p>
                    <a href={activeLesson.content_url} className="btn btn-primary px-4 rounded-pill" target="_blank">
                      Download PDF
                    </a>
                  </div>
                )}

                {activeLesson.content_type === "sandbox" && (
                  <div style={{ height: '600px' }}>
                    <SandboxRunner lesson={activeLesson} />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h5>About this lesson</h5>
                <p className="text-secondary">{activeLesson.description || "No description provided."}</p>
              </div>
            </div>
          ) : (
            <div className="d-flex vh-100 align-items-center justify-content-center">
              <p className="text-muted">Select a lesson to start learning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}