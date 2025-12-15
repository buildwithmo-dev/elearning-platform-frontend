import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useSearchParams } from "react-router-dom";
import {
  fetchMyCourses,
  createCourse,
  updateCourse,
  fetchStudents
} from "../../api/courses";

const UserPage = () => {
  const { userProfile, loading } = useAuth();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  if (loading) return <div className="container-fluid">Loading...</div>;
  if (!userProfile) return <div className="container-fluid">No user profile found</div>;

  const token = userProfile.access_token;
  const isInstructor = userProfile.is_instructor === true;

  /* ================== TAB PERSISTENCE ================== */
  const [searchParams, setSearchParams] = useSearchParams();
  const allowedInstructorTabs = ["courses", "create", "students"];
  const allowedStudentTabs = ["courses", "assignments", "progress"];
  const defaultTab = "courses";
  const activeTab = searchParams.get("tab") || defaultTab;

  useEffect(() => {
    const allowedTabs = isInstructor ? allowedInstructorTabs : allowedStudentTabs;
    if (!allowedTabs.includes(activeTab)) {
      setSearchParams({ tab: defaultTab });
    }
  }, [activeTab, isInstructor, setSearchParams]);

  const changeTab = (tab) => setSearchParams({ tab });

  /* ================== DATA STATE ================== */
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  /* ================== CREATE COURSE FORM ================== */
  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: null,
    modules: [{ title: "", description: "" }],
    totalCost: "",
    courseType: "pre-recorded",
    liveQuestionsTime: "",
    sandboxClass: false,
    peerReview: false
  });

  /* ================== FETCH COURSES ================== */
  useEffect(() => {
    fetchMyCourses(token).then(setCourses);
  }, [token]);

  const loadStudents = async (courseId) => {
    const data = await fetchStudents(token, courseId);
    setStudents(data);
    changeTab("students");
  };

  const handleCreateCourse = async () => {
    const payload = {
      ...form,
      modules: form.modules.filter((m) => m.title.trim() !== "")
    };
    await createCourse(token, payload);
    fetchMyCourses(token).then(setCourses);
    setForm({
      title: "",
      description: "",
      coverImage: null,
      modules: [{ title: "", description: "" }],
      totalCost: "",
      courseType: "pre-recorded",
      liveQuestionsTime: "",
      sandboxClass: false,
      peerReview: false
    });
    changeTab("courses");
  };

  const handleUpdateCourse = async (course) => {
    await updateCourse(token, course.id, {
      title: course.title,
      description: course.description
    });
    alert("Course updated");
  };

  /* ================== DYNAMIC MODULES ================== */
  const addModule = () =>
    setForm((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", description: "" }]
    }));

  const removeModule = (index) =>
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));

  const updateModule = (index, key, value) =>
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.map((m, i) =>
        i === index ? { ...m, [key]: value } : m
      )
    }));

  /* ================== RESPONSIVE ================== */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================== UI ================== */
  return (
    <div className="container-fluid">
      {/* ================== TABS ================== */}
      <div className="row">
        <div className="col-12 p-2">
          <div className="btn-group w-100">
            <button
              className={`btn ${activeTab === "courses" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => changeTab("courses")}
            >
              Courses
            </button>
            {isInstructor && (
              <button
                className={`btn ${activeTab === "create" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => changeTab("create")}
              >
                Create
              </button>
            )}
            {isInstructor && (
              <button
                className={`btn ${activeTab === "students" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => changeTab("students")}
              >
                Students
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================== MAIN CONTENT ================== */}
      <div className="row">
        {isDesktop && (
          <div className="col-sm-3 bg-light p-3">
            {isInstructor ? (
              <ul className="list-unstyled">
                <li className={`p-2 ${activeTab === "courses" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("courses")}>My Courses</li>
                <li className={`p-2 ${activeTab === "create" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("create")}>Create Course</li>
                <li className={`p-2 ${activeTab === "students" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("students")}>Students</li>
              </ul>
            ) : (
              <ul className="list-unstyled">
                <li className={`p-2 ${activeTab === "courses" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("courses")}>My Classes</li>
                <li className={`p-2 ${activeTab === "assignments" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("assignments")}>Assignments</li>
                <li className={`p-2 ${activeTab === "progress" ? "fw-bold text-primary" : ""}`} onClick={() => changeTab("progress")}>Progress</li>
              </ul>
            )}
          </div>
        )}

        <div className={isDesktop ? "col-sm-9 p-3" : "col-12 p-3"}>
          {/* ================== COURSES ================== */}
          {activeTab === "courses" && (
            <>
              {courses.length === 0 ? (
                <p>{isInstructor ? "You have no courses yet." : "You are not enrolled in any courses."}</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="card mb-2 p-2">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                    {isInstructor && (
                      <div>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateCourse(course)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => loadStudents(course.id)}>View Students</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* ================== CREATE COURSE ================== */}
          {isInstructor && activeTab === "create" && (
            <>
              <h4>Create Course</h4>
              <input
                className="form-control mb-2"
                placeholder="Course Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Course Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) => setForm({ ...form, coverImage: e.target.files[0] })}
              />

              <h5>Modules</h5>
              {form.modules.map((m, index) => (
                <div key={index} className="card p-2 mb-2">
                  <input
                    className="form-control mb-1"
                    placeholder={`Module ${index + 1} Title`}
                    value={m.title}
                    onChange={(e) => updateModule(index, "title", e.target.value)}
                  />
                  <textarea
                    className="form-control mb-1"
                    placeholder={`Module ${index + 1} Description`}
                    value={m.description}
                    onChange={(e) => updateModule(index, "description", e.target.value)}
                  />
                  {form.modules.length > 1 && (
                    <button className="btn btn-sm btn-danger" onClick={() => removeModule(index)}>Remove Module</button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary mb-2" onClick={addModule}>Add Module</button>

              <input
                type="number"
                className="form-control mb-2"
                placeholder="Total Course Cost"
                value={form.totalCost}
                onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
              />

              <h5>Course Type</h5>
              <div className="mb-2">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="courseType"
                    value="pre-recorded"
                    checked={form.courseType === "pre-recorded"}
                    onChange={(e) => setForm({ ...form, courseType: e.target.value })}
                  />
                  <label className="form-check-label">Pre-recorded</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="courseType"
                    value="live"
                    checked={form.courseType === "live"}
                    onChange={(e) => setForm({ ...form, courseType: e.target.value })}
                  />
                  <label className="form-check-label">Live</label>
                </div>
              </div>

              {form.courseType === "live" && (
                <>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Live Questions Time (minutes)"
                    value={form.liveQuestionsTime}
                    onChange={(e) => setForm({ ...form, liveQuestionsTime: e.target.value })}
                  />
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.sandboxClass}
                      onChange={(e) => setForm({ ...form, sandboxClass: e.target.checked })}
                    />
                    <label className="form-check-label">Sandbox Class</label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.peerReview}
                      onChange={(e) => setForm({ ...form, peerReview: e.target.checked })}
                    />
                    <label className="form-check-label">Enable Peer Review</label>
                  </div>
                </>
              )}

              <button className="btn btn-primary mt-2" onClick={handleCreateCourse}>Create Course</button>
            </>
          )}

          {/* ================== STUDENTS ================== */}
          {isInstructor && activeTab === "students" && (
            <>
              <h4>Students</h4>
              {students.length === 0 ? <p>No students enrolled yet.</p> : (
                <ul>
                  {students.map((s) => (
                    <li key={s.student_id}>
                      {s.profiles.full_name} ({s.profiles.email})
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
