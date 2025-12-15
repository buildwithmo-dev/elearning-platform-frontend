import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  fetchMyCourses,
  createCourse,
  updateCourse,
  fetchStudents
} from "../../api/courses";

const InstructorDashboard = ({ isDesktop }) => {
  const { userProfile } = useAuth();
  const token = userProfile.access_token;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    fetchMyCourses(token).then(setCourses);
  }, [token]);

  const handleCreate = async () => {
    const newCourse = await createCourse(token, form);
    setCourses([...courses, ...newCourse]);
    setForm({ title: "", description: "" });
  };

  const handleUpdate = async (course) => {
    await updateCourse(token, course.id, {
      title: course.title,
      description: course.description
    });
    alert("Course updated");
  };

  const loadStudents = async (courseId) => {
    const data = await fetchStudents(token, courseId);
    setStudents(data);
  };

  return (
    <div className="row">
      {isDesktop && (
        <div className="col-sm-3 bg-light p-3">
          <h6>Instructor Menu</h6>
          <ul>
            <li>My Courses</li>
            <li>Create Course</li>
            <li>Students</li>
          </ul>
        </div>
      )}

      <div className="col-sm-9 p-3">
        <h3>Instructor Dashboard</h3>

        {/* CREATE COURSE */}
        <div className="mb-4">
          <h5>Create Course</h5>
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <button className="btn btn-primary" onClick={handleCreate}>
            Create
          </button>
        </div>

        {/* COURSES */}
        <h5>My Courses</h5>
        {courses.map((course) => (
          <div key={course.id} className="card mb-2 p-2">
            <input
              className="form-control mb-1"
              value={course.title}
              onChange={(e) =>
                setCourses((prev) =>
                  prev.map((c) =>
                    c.id === course.id
                      ? { ...c, title: e.target.value }
                      : c
                  )
                )
              }
            />
            <textarea
              className="form-control mb-1"
              value={course.description}
              onChange={(e) =>
                setCourses((prev) =>
                  prev.map((c) =>
                    c.id === course.id
                      ? { ...c, description: e.target.value }
                      : c
                  )
                )
              }
            />
            <button
              className="btn btn-sm btn-success me-2"
              onClick={() => handleUpdate(course)}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => loadStudents(course.id)}
            >
              View Students
            </button>
          </div>
        ))}

        {/* STUDENTS */}
        {students.length > 0 && (
          <>
            <h5 className="mt-4">Enrolled Students</h5>
            <ul>
              {students.map((s) => (
                <li key={s.student_id}>
                  {s.profiles.full_name} ({s.profiles.email})
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
