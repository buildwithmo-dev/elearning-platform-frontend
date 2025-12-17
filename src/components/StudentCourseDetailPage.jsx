import { useState, useEffect } from "react";
import { useAuth } from ".../hooks/AuthContext";
import { useParams } from "react-router-dom";
import SandboxRunner from "./SandboxRunner";

export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId, token]);

  if (loading) return <div>Loading lessons...</div>;
  if (lessons.length === 0) return <div>No lessons in this course.</div>;

  return (
    <div className="container p-3">
      <h3>Course Lessons</h3>
      {lessons.map((lesson) => (
        <div key={lesson.id} className="mb-3">
          {lesson.content_type === "video" && (
            <video src={lesson.content_url} controls width="100%" />
          )}
          {lesson.content_type === "document" && (
            <a href={lesson.content_url} target="_blank">Download Document</a>
          )}
          {lesson.content_type === "sandbox" && <SandboxRunner lesson={lesson} />}
        </div>
      ))}
    </div>
  );
}
