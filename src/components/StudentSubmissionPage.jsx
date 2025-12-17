import { useState, useEffect } from "react";
import { useAuth } from ".../hooks/AuthContext";
import { useParams } from "react-router-dom";

export default function StudentSubmissionPage() {
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;

  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch lessons of the course
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        // Only sandbox lessons
        setLessons(data.filter((l) => l.content_type === "sandbox"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId, token]);

  const handleChange = (lessonId, value) => {
    setSubmissions({ ...submissions, [lessonId]: value });
  };

  const handleSubmit = async (lessonId) => {
    if (!submissions[lessonId]) return alert("Please enter your sandbox URL");

    try {
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ submission_url: submissions[lessonId] })
      });
      alert("Submission saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    }
  };

  if (loading) return <div>Loading lessons...</div>;
  if (lessons.length === 0) return <div>No sandbox lessons in this course.</div>;

  return (
    <div className="container p-3">
      <h3>Submit Your Code</h3>
      {lessons.map((l) => (
        <div key={l.id} className="card p-2 mb-2">
          <h5>{l.title}</h5>
          <p>
            Instructor Sandbox:{" "}
            <a href={l.sandbox_url} target="_blank" rel="noopener noreferrer">
              {l.sandbox_url}
            </a>
          </p>
          <input
            type="url"
            className="form-control mb-1"
            placeholder="Paste your sandbox URL here"
            value={submissions[l.id] || ""}
            onChange={(e) => handleChange(l.id, e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSubmit(l.id)}
            disabled={!submissions[l.id]}
          >
            Submit
          </button>
        </div>
      ))}
    </div>
  );
}
