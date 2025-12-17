import { useState, useEffect } from "react";
import { useAuth } from ".../hooks/AuthContext";
import { Link } from "react-router-dom";

export default function StudentCoursesPage() {
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/student/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  if (loading) return <div>Loading courses...</div>;
  if (courses.length === 0) return <div>You have no courses enrolled.</div>;

  return (
    <div className="container p-3">
      <h3>My Courses</h3>
      {courses.map((c) => (
        <div key={c.id} className="card p-3 mb-2">
          <h5>{c.title}</h5>
          <p>{c.description}</p>
          <Link to={`/student/course/${c.id}`}>Go to course</Link>
        </div>
      ))}
    </div>
  );
}
