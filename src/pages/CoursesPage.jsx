import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, BookOpen, Clock, Star } from 'lucide-react';

export default function CoursesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategoryId = searchParams.get("category");
    
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch categories for the sidebar filter
                const catRes = await axios.get("http://127.0.0.1:8000/api/courses/category-section");
                setCategories(catRes.data);

                // Fetch courses (optionally filtered by category)
                const url = activeCategoryId 
                    ? `http://127.0.0.1:8000/api/courses/list?category=${activeCategoryId}`
                    : `http://127.0.0.1:8000/api/courses/list`;
                
                const courseRes = await axios.get(url);
                setCourses(courseRes.data);
            } catch (err) {
                console.error("Error loading courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategoryId]);

    // Client-side search filtering
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-fluid bg-light min-vh-100 py-5" style={{ marginTop: '60px' }}>
            <div className="container">
                <div className="row g-4">
                    
                    {/* --- Sidebar Filters --- */}
                    <div className="col-lg-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                <Filter size={18} className="text-primary"/> Filters
                            </h5>
                            
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">SEARCH</label>
                                <div className="input-group bg-light rounded-3 overflow-hidden">
                                    <span className="input-group-text border-0 bg-transparent text-muted"><Search size={16}/></span>
                                    <input 
                                        type="text" 
                                        className="form-control border-0 bg-transparent ps-0" 
                                        placeholder="Find a course..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">CATEGORIES</label>
                                <div className="nav flex-column nav-pills gap-1">
                                    <button 
                                        onClick={() => setSearchParams({})} 
                                        className={`nav-link text-start border-0 py-2 px-3 rounded-3 ${!activeCategoryId ? 'active shadow-sm' : 'text-dark'}`}
                                    >
                                        All Courses
                                    </button>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSearchParams({ category: cat.id })} 
                                            className={`nav-link text-start border-0 py-2 px-3 rounded-3 ${activeCategoryId == cat.id ? 'active shadow-sm' : 'text-dark'}`}
                                        >
                                            {cat.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Course Grid --- */}
                    <div className="col-lg-9">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div>
                                <h2 className="fw-bold mb-0">
                                    {activeCategoryId 
                                        ? categories.find(c => c.id == activeCategoryId)?.title 
                                        : "All Courses"}
                                </h2>
                                <p className="text-muted mb-0">{filteredCourses.length} results found</p>
                            </div>
                        </div>

                        <div className="row g-4">
                            {loading ? (
                                <div className="col-12 text-center py-5"><div className="spinner-border text-primary"></div></div>
                            ) : filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <div key={course.id} className="col-md-6 col-xl-4">
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-up transition-all">
                                            <div className="position-relative">
                                                <img src={course.thumbnail || "https://via.placeholder.com/400x225"} className="card-img-top" alt={course.title} />
                                                <div className="position-absolute top-0 end-0 m-3 badge bg-primary">
                                                    {course.price === 0 ? "Free" : `$${course.price}`}
                                                </div>
                                            </div>
                                            <div className="card-body p-4">
                                                <h6 className="fw-bold text-dark mb-2 line-clamp-2">{course.title}</h6>
                                                <div className="d-flex align-items-center gap-3 text-muted small mb-3">
                                                    <span className="d-flex align-items-center gap-1"><BookOpen size={14}/> {course.lesson_count} Lessons</span>
                                                    <span className="d-flex align-items-center gap-1"><Clock size={14}/> {course.duration}h</span>
                                                </div>
                                                <Link to={`/course/${course.id}`} className="btn btn-outline-primary w-100 rounded-pill fw-bold">View Course</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5">
                                    <div className="bg-white p-5 rounded-4 shadow-sm">
                                        <h4>No courses found</h4>
                                        <p className="text-muted">Try adjusting your filters or search terms.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}