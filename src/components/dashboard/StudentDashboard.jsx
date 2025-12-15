import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchMyCourses } from "../../api/courses";

const StudentDashboard = ({ isDesktop }) => {
  const { userProfile } = useAuth();
  const token = userProfile.access_token;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses(token).then(setCourses);
  }, [token]);

  return (
    <div className="row">
      {isDesktop && (
        <div className="col-sm-3 bg-light p-3">
          <h6>Student Menu</h6>
          <ul>
            <li>My Classes</li>
            <li>Assignments</li>
            <li>Progress</li>
          </ul>
        </div>
      )}

      <div className="col-sm-9 p-3">
        <h3>Student Dashboard</h3>
        {courses.map((course) => (
          <div key={course.id} className="card mb-2 p-2">
            <h5>{course.title}</h5>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
