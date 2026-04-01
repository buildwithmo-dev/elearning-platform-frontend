import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useParams } from "react-router-dom";
import { ExternalLink, Send, Code, Link as LinkIcon } from 'lucide-react';

export default function StudentSubmissionPage() {
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;
  const { courseId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`https://elearning-platform-backend-seven.vercel.app//api/courses/${courseId}/lessons/`);
        const data = await res.json();
        setLessons(data.filter((l) => l.content_type === "sandbox"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  const handleSubmit = async (lessonId) => {
    const url = submissions[lessonId];
    if (!url) return;

    setSubmitting(prev => ({ ...prev, [lessonId]: true }));

    try {
      const res = await fetch(
        `https://elearning-platform-backend-seven.vercel.app//api/courses/${courseId}/lessons/${lessonId}/submit/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ submission_url: url })
        }
      );

      if (res.ok) {
        alert("Success! Your solution has been submitted.");
      }
    } catch {
      alert("Submission failed. Check your connection.");
    } finally {
      setSubmitting(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Project Submissions
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Submit your sandbox or GitHub project links for grading.
        </p>
      </div>

      {/* Empty State */}
      {lessons.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm">
          No coding assignments found for this course.
        </div>
      ) : (
        <div className="space-y-6">
          {lessons.map((l) => (
            <div
              key={l.id}
              className="bg-white border rounded-2xl shadow-sm p-6"
            >
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Code size={18} className="text-blue-500" />
                  {l.title}
                </h3>

                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  Sandbox
                </span>
              </div>

              {/* Template Box */}
              <div className="bg-gray-50 border rounded-xl p-4 flex justify-between items-center mb-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase text-gray-400 font-semibold mb-1">
                    Instructor Template
                  </p>
                  <code className="text-blue-600 text-xs break-all">
                    {l.sandbox_url}
                  </code>
                </div>

                <a
                  href={l.sandbox_url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-4 inline-flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-full border hover:bg-gray-100 transition"
                >
                  Open
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Input */}
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Your Solution URL
              </label>

              <div className="mt-2 flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <LinkIcon size={16} className="text-gray-400 mr-2" />
                
                <input
                  type="url"
                  placeholder="https://codesandbox.io/..."
                  value={submissions[l.id] || ""}
                  onChange={(e) =>
                    setSubmissions({ ...submissions, [l.id]: e.target.value })
                  }
                  className="flex-1 outline-none text-sm"
                />

                <button
                  onClick={() => handleSubmit(l.id)}
                  disabled={!submissions[l.id] || submitting[l.id]}
                  className="ml-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition disabled:opacity-50"
                >
                  {submitting[l.id] ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      Submit
                    </>
                  )}
                </button>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 mt-2">
                Ensure your project is public so instructors can review it.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}