import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useParams } from "react-router-dom";
import { ExternalLink, CheckCircle, Send, Code, Link as LinkIcon } from 'lucide-react';

export default function StudentSubmissionPage() {
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [submitting, setSubmitting] = useState({}); // Track loading state per button
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/`);
        const data = await res.json();
        // Filter for sandbox types and sort them
        setLessons(data.filter((l) => l.content_type === "sandbox"));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleSubmit = async (lessonId) => {
    const url = submissions[lessonId];
    if (!url) return;

    // Start loading for this specific lesson
    setSubmitting(prev => ({ ...prev, [lessonId]: true }));

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/${lessonId}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ submission_url: url })
      });

      if (res.ok) {
        alert("Success! Your solution has been submitted.");
        // You could also update a 'submitted' status in your local state here
      }
    } catch (err) {
      alert("Submission failed. Check your connection.");
    } finally {
      setSubmitting(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4" style={{ maxWidth: '850px' }}>
      <div className="mb-4">
        <h3 className="fw-bold">Project Submissions</h3>
        <p className="text-muted">Paste your live sandbox or GitHub repository links below for grading.</p>
      </div>

      {lessons.length === 0 ? (
        <div className="alert alert-info border-0 shadow-sm">
          No coding assignments found for this course.
        </div>
      ) : (
        lessons.map((l) => (
          <div key={l.id} className="card border-0 shadow-sm mb-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Code size={20} className="text-primary" /> {l.title}
                </h5>
                <span className="badge bg-light text-dark border fw-normal px-3 py-2 rounded-pill">
                  Sandbox Assignment
                </span>
              </div>
            </div>

            <div className="card-body px-4 pb-4">
              <div className="bg-light p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '10px' }}>Instructor Base Template</small>
                  <code className="text-primary small">{l.sandbox_url}</code>
                </div>
                <a 
                  href={l.sandbox_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-white border shadow-sm"
                >
                  Open Template <ExternalLink size={14} className="ms-1" />
                </a>
              </div>

              <label className="form-label fw-semibold small">Your Solution URL</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <LinkIcon size={16} className="text-muted" />
                </span>
                <input
                  type="url"
                  className="form-control border-start-0 ps-0"
                  placeholder="https://codesandbox.io/s/your-project..."
                  value={submissions[l.id] || ""}
                  onChange={(e) => setSubmissions({ ...submissions, [l.id]: e.target.value })}
                />
                <button
                  className="btn btn-primary px-4 d-flex align-items-center gap-2"
                  onClick={() => handleSubmit(l.id)}
                  disabled={!submissions[l.id] || submitting[l.id]}
                >
                  {submitting[l.id] ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <><Send size={16} /> Submit</>
                  )}
                </button>
              </div>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>
                Note: Ensure your sandbox is set to "Public" so the instructor can view it.
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}