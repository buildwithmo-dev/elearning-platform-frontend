import { useEffect, useState } from "react";
import { useAuth } from ".../hooks/AuthContext";
import {
  fetchMyCourses,
  createCourse,
  updateCourse,
  fetchStudents
} from "../../api/courses";

import {
  BookOpen,
  Users,
  PlusCircle,
  Save,
  Sparkles
} from "lucide-react";

const InstructorDashboard = ({ isDesktop }) => {
  const { userProfile } = useAuth();
  const token = userProfile?.access_token;

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeView, setActiveView] = useState("courses");

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (token) fetchMyCourses(token).then(setCourses);
  }, [token]);

  const handleCreate = async () => {
    if (!form.title) return;

    const newCourse = await createCourse(token, form);
    setCourses((prev) => [...prev, newCourse]);
    setForm({ title: "", description: "" });
  };

  const handleUpdate = async (course) => {
    await updateCourse(token, course.id, course);
  };

  const loadStudents = async (courseId) => {
    const data = await fetchStudents(token, courseId);
    setStudents(data);
    setActiveView("students");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* SIDEBAR */}
      {isDesktop && (
        <aside className="w-72 p-6 border-r bg-white/70 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Sparkles size={18} /> Instructor
          </h2>

          <nav className="space-y-2">
            {[
              ["courses", BookOpen, "My Courses"],
              ["students", Users, "Students"]
            ].map(([key, Icon, label]) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    activeView === key
                      ? "bg-black text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>
      )}

      {/* MAIN */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your courses and students
          </p>
        </div>

        {/* CREATE COURSE */}
        <div className="mb-10 bg-white/80 backdrop-blur border rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={18} /> Create Course
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Course title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              className="p-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Short description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleCreate}
            className="mt-4 flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:scale-[1.02] transition shadow"
          >
            <PlusCircle size={16} />
            Create Course
          </button>
        </div>

        {/* COURSES VIEW */}
        {activeView === "courses" && (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <input
                  className="w-full text-lg font-semibold mb-2 bg-transparent outline-none"
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
                  className="w-full text-sm text-gray-600 bg-gray-50 p-3 rounded-xl outline-none mb-4"
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(course)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    <Save size={14} /> Save
                  </button>

                  <button
                    onClick={() => loadStudents(course.id)}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition"
                  >
                    View Students
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS VIEW */}
        {activeView === "students" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h3 className="font-semibold mb-4">Enrolled Students</h3>

            {students.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No students loaded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {students.map((s) => (
                  <div
                    key={s.student_id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {s.profiles.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {s.profiles.email}
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1 bg-black text-white rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;