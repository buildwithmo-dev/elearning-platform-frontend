import { useEffect, useState } from "react";
import { useAuth } from ".../hooks/AuthContext";
import { fetchMyCourses } from "../../api/courses";

const StudentDashboard = ({ isDesktop }) => {
  const { userProfile } = useAuth();
  const token = userProfile.access_token;
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses(token).then(setCourses);
  }, [token]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      {isDesktop && (
        <div className="w-64 bg-white border-r p-6">
          <h6 className="text-sm font-semibold text-gray-500 uppercase mb-4">
            Student Menu
          </h6>
          <ul className="space-y-3 text-gray-700">
            <li className="hover:text-blue-600 cursor-pointer">My Classes</li>
            <li className="hover:text-blue-600 cursor-pointer">Assignments</li>
            <li className="hover:text-blue-600 cursor-pointer">Progress</li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h3 className="text-2xl font-bold mb-6">Student Dashboard</h3>

        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-sm p-4 border hover:shadow-md transition"
            >
              <h5 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h5>
              <p className="text-gray-600 mt-1 text-sm">
                {course.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;