import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useSearchParams } from "react-router-dom";
import {fetchMyCourses, updateCourse, fetchStudents} from "../services/api/courses";

const DRAFT_KEY = "course_create_draft";

const UserAccountPage = () => {
  const { userProfile, loading, session } = useAuth();
  const token = session?.access_token;

  const isInstructor = userProfile?.is_instructor === true;
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "courses";
  const step = Number(searchParams.get("step")) || 0;
  const setStep = (s) => setSearchParams({ tab: "create", step: s });

  // ================== COURSES & STUDENTS ==================
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchMyCourses(token).then(setCourses);
  }, [token]);

  const loadStudents = async (courseId) => {
    if (!token) return;
    const data = await fetchStudents(token, courseId);
    setStudents(data);
    setSearchParams({ tab: "students" });
  };

  const handleUpdateCourse = async (course) => {
    if (!token) return;
    await updateCourse(token, course.id, {
      title: course.title,
      description: course.description
    });
    alert("Course updated");
    fetchMyCourses(token).then(setCourses);
  };

  // ================== COURSE CREATION ==================
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          title: "",
          description: "",
          price_amount: "",
          price_currency: "USD",
          is_published: false,
          related_categories: [],
          modules: [
            {
              title: "",
              lessons: [
                {
                  title: "",
                  content_type: "video",
                  content_url: "",
                  content_file: null,
                  language: "",
                  starter_code: ""
                }
              ]
            }
          ]
        };
  });

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/courses/category-section");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [dragModuleIndex, setDragModuleIndex] = useState(null);
  const [dragLesson, setDragLesson] = useState(null);
  const reorder = (arr, from, to) => {
    const copy = [...arr];
    const item = copy.splice(from, 1)[0];
    copy.splice(to, 0, item);
    return copy;
  };

  const addModule = () =>
    setForm((p) => ({ ...p, modules: [...p.modules, { title: "", lessons: [] }] }));

  const addLesson = (mi) =>
    setForm((p) => ({
      ...p,
      modules: p.modules.map((m, i) =>
        i === mi
          ? {
              ...m,
              lessons: [
                ...m.lessons,
                {
                  title: "",
                  content_type: "video",
                  content_url: "",
                  content_file: null,
                  language: "",
                  starter_code: ""
                }
              ]
            }
          : m
      )
    }));

  const isStepValid = () => {
    if (step === 0)
      return (
        form.title?.trim() &&
        form.description?.trim() &&
        form.price_amount &&
        form.related_categories.length
      );
    if (step === 1) return form.modules.length && form.modules.every((m) => m.title?.trim());
    if (step === 2)
      return form.modules.every((m) =>
        m.lessons.every((l) => {
          if (l.content_type === "sandbox") return l.language?.trim();
          if (l.content_type === "video" || l.content_type === "document")
            return l.title?.trim() && (l.content_url?.trim() || l.content_file);
          return false;
        })
      );
    return false;
  };

  const handleCreateCourse = async () => {
    if (!token) return;

    // Convert price to USD
    let rateToUSD = 1;
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${form.price_currency || "USD"}`);
      const data = await res.json();
      rateToUSD = data.rates?.USD ?? 1;
    } catch (err) {
      console.error(err);
    }
    const usdPrice = parseFloat(form.price_amount) * rateToUSD;

    // Prepare FormData payload
    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("price", usdPrice);
    payload.append("is_published", form.is_published);
    payload.append("related_categories", JSON.stringify(form.related_categories));

    form.modules.forEach((m, mi) => {
      payload.append(`modules[${mi}][title]`, m.title);
      m.lessons.forEach((l, li) => {
        payload.append(`modules[${mi}][lessons][${li}][title]`, l.title);
        payload.append(`modules[${mi}][lessons][${li}][content_type]`, l.content_type);
        if (l.content_type === "sandbox") {
          payload.append(`modules[${mi}][lessons][${li}][language]`, l.language);
          payload.append(`modules[${mi}][lessons][${li}][starter_code]`, l.starter_code);
        } else {
          if (l.content_file) payload.append(`modules[${mi}][lessons][${li}][file]`, l.content_file);
          else payload.append(`modules[${mi}][lessons][${li}][content_url]`, l.content_url);
        }
      });
    });

    await fetch("http://127.0.0.1:8000/api/courses/create-course", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    });

    localStorage.removeItem(DRAFT_KEY);
    fetchMyCourses(token).then(setCourses);
    setSearchParams({ tab: "courses" });
  };

  // ================== WINDOW RESIZE ==================
  useEffect(() => {
    const r = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // ================== UI ==================
  return (
    <div className="container-fluid">
      {loading && <div>Loading...</div>}
      {!loading && !userProfile && <div>No user profile</div>}
      {!loading && userProfile && (
        <>
          {/* ================== TABS ================== */}
          <div className="btn-group w-100 mb-3">
            <button
              className={`btn ${activeTab === "courses" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setSearchParams({ tab: "courses" })}
            >
              Courses
            </button>
            {isInstructor && (
              <>
                <button
                  className={`btn ${activeTab === "create" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setSearchParams({ tab: "create", step: 0 })}
                >
                  Create
                </button>
                <button
                  className={`btn ${activeTab === "students" ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setSearchParams({ tab: "students" })}
                >
                  Students
                </button>
              </>
            )}
          </div>

          <div className="row">
            {isDesktop && (
              <div className="col-sm-3 bg-light p-3">
                <ul className="list-unstyled">
                  <li
                    className={`p-2 ${activeTab === "courses" ? "fw-bold text-primary" : ""}`}
                    onClick={() => setSearchParams({ tab: "courses" })}
                  >
                    {isInstructor ? "My Courses" : "My Classes"}
                  </li>
                  {isInstructor && (
                    <>
                      <li
                        className={`p-2 ${activeTab === "create" ? "fw-bold text-primary" : ""}`}
                        onClick={() => setSearchParams({ tab: "create", step: 0 })}
                      >
                        Create Course
                      </li>
                      <li
                        className={`p-2 ${activeTab === "students" ? "fw-bold text-primary" : ""}`}
                        onClick={() => setSearchParams({ tab: "students" })}
                      >
                        Students
                      </li>
                    </>
                  )}
                </ul>
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
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateCourse(course)}>
                              Save
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={() => loadStudents(course.id)}>
                              View Students
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {/* ================== COURSE CREATION ================== */}
              {isInstructor && activeTab === "create" && (
                <div className="row">
            <div className={isDesktop ? "col-sm-9 p-3" : "col-12 p-3"}>
              {isInstructor && activeTab === "create" && (
                <>
                  <p className="text-muted">Step {step + 1} of 3</p>

                  {/* ========== Step 0: Course Info ========== */}
                  {step === 0 && (
                    <>
                      <input
                        className="form-control mb-2"
                        placeholder="Title"
                        value={form.title || ""}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                      <textarea
                        className="form-control mb-2"
                        placeholder="Description"
                        value={form.description || ""}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                      />
                      <div className="input-group mb-2">
                        <select
                          className="form-select"
                          value={form.price_currency || "USD"}
                          onChange={(e) => setForm({ ...form, price_currency: e.target.value })}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GHS">GHS</option>
                          <option value="GBP">GBP</option>
                        </select>
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Amount"
                          value={form.price_amount || ""}
                          onChange={(e) => setForm({ ...form, price_amount: e.target.value })}
                        />
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={form.is_published || false}
                          onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                        />
                        <label className="form-check-label">Published</label>
                      </div>

                      <h6 className="mt-3">Category</h6>
                      {categoriesLoading && <p>Loading categories...</p>}
                      {!categoriesLoading &&
                        categories.map((cat) => (
                          <div className="form-check mb-1" key={cat.id}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="category"
                              id={`category-${cat.id}`}
                              checked={form.related_categories[0] === cat.id}
                              onChange={() => setForm({ ...form, related_categories: [cat.id] })}
                            />
                            <label className="form-check-label" htmlFor={`category-${cat.id}`}>
                              {cat.title} {cat.careers ? `(${cat.careers})` : ""}
                            </label>
                          </div>
                        ))}
                    </>
                  )}

                  {/* ========== Step 1: Modules ========== */}
                  {step === 1 && (
                    <>
                      {form.modules.map((m, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={() => setDragModuleIndex(i)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragModuleIndex === null) return;
                            setForm({ ...form, modules: reorder(form.modules, dragModuleIndex, i) });
                            setDragModuleIndex(null);
                          }}
                          className="border p-2 mb-2"
                          style={{ cursor: "grab" }}
                        >
                          <input
                            className="form-control mb-2"
                            placeholder={`Module ${i + 1} Title`}
                            value={m.title || ""}
                            onChange={(e) => {
                              const modules = [...form.modules];
                              modules[i].title = e.target.value;
                              setForm({ ...form, modules });
                            }}
                          />
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addModule}>
                        Add Module
                      </button>
                    </>
                  )}

                  {/* ========== Step 2: Lessons ========== */}
                  {step === 2 &&
                    form.modules.map((m, mi) => (
                      <div key={mi} className="card p-2 mb-2">
                        <strong>{m.title}</strong>
                        {m.lessons.map((l, li) => (
                          <div
                            key={li}
                            draggable
                            onDragStart={() => setDragLesson({ mi, li })}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (!dragLesson || dragLesson.mi !== mi) return;
                              const lessons = reorder(m.lessons, dragLesson.li, li);
                              const modules = [...form.modules];
                              modules[mi].lessons = lessons;
                              setForm({ ...form, modules });
                              setDragLesson(null);
                            }}
                            className="border p-2 mb-1"
                            style={{ cursor: "grab" }}
                          >
                            <input
                              className="form-control mb-1"
                              placeholder="Lesson Title"
                              value={l.title || ""}
                              onChange={(e) => {
                                const modules = [...form.modules];
                                modules[mi].lessons[li].title = e.target.value;
                                setForm({ ...form, modules });
                              }}
                            />
                            <select
                              className="form-select mb-1"
                              value={l.content_type || "video"}
                              onChange={(e) => {
                                const modules = [...form.modules];
                                modules[mi].lessons[li].content_type = e.target.value;
                                setForm({ ...form, modules });
                              }}
                            >
                              <option value="video">Video</option>
                              <option value="document">Document</option>
                              <option value="sandbox">Coding Sandbox</option>
                            </select>

                            {l.content_type === "sandbox" ? (
                              <>
                                <input
                                  className="form-control mb-1"
                                  placeholder="Language (Python, JS)"
                                  value={l.language || ""}
                                  onChange={(e) => {
                                    const modules = [...form.modules];
                                    modules[mi].lessons[li].language = e.target.value;
                                    setForm({ ...form, modules });
                                  }}
                                />
                                <textarea
                                  className="form-control mb-1"
                                  placeholder="Starter code"
                                  value={l.starter_code || ""}
                                  onChange={(e) => {
                                    const modules = [...form.modules];
                                    modules[mi].lessons[li].starter_code = e.target.value;
                                    setForm({ ...form, modules });
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <input
                                  className="form-control mb-1"
                                  placeholder="Content URL"
                                  value={l.content_url || ""}
                                  onChange={(e) => {
                                    const modules = [...form.modules];
                                    modules[mi].lessons[li].content_url = e.target.value;
                                    modules[mi].lessons[li].content_file = null;
                                    setForm({ ...form, modules });
                                  }}
                                />
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="form-control mb-1"
                                  onChange={(e) => {
                                    const modules = [...form.modules];
                                    modules[mi].lessons[li].content_file = e.target.files[0];
                                    modules[mi].lessons[li].content_url = "";
                                    setForm({ ...form, modules });
                                  }}
                                />

                                {/* Video preview */}
                                {l.content_url && (
                                  <video
                                    src={l.content_url}
                                    controls
                                    width="100%"
                                    className="mb-2"
                                    style={{ maxHeight: "300px" }}
                                  />
                                )}
                                {l.content_file && (
                                  <video
                                    src={URL.createObjectURL(l.content_file)}
                                    controls
                                    width="100%"
                                    className="mb-2"
                                    style={{ maxHeight: "300px" }}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        ))}
                        <button className="btn btn-secondary" onClick={() => addLesson(mi)}>
                          Add Lesson
                        </button>
                      </div>
                    ))}

                  {/* Navigation */}
                  <div className="d-flex justify-content-between mt-3">
                    <button disabled={step === 0} onClick={() => setStep(step - 1)}>
                      Back
                    </button>
                    {step < 2 ? (
                      <button disabled={!isStepValid()} onClick={() => setStep(step + 1)}>
                        Next
                      </button>
                    ) : (
                      <button disabled={!isStepValid()} onClick={handleCreateCourse}>
                        Create Course
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
              )}

              {/* ================== STUDENTS ================== */}
              {isInstructor && activeTab === "students" && (
                <>
                  <h4>Students</h4>
                  {students.length === 0 ? (
                    <p>No students enrolled yet.</p>
                  ) : (
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
        </>
      )}
    </div>
  );
};

export default UserAccountPage;
