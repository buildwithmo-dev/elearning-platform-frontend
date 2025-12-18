import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, BookOpen, Star, LayoutGrid, XCircle } from 'lucide-react';

export default function CoursesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get values from URL
    const activeCategoryId = searchParams.get("category");
    const urlSearchQuery = searchParams.get("q") || "";
    
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Internal input state (for typing)
    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

    // 1. Fetch Data when Category changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catRes, courseRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/courses/category-section"),
                    axios.get(activeCategoryId 
                        ? `http://127.0.0.1:8000/api/courses/?category=${activeCategoryId}`
                        : `http://127.0.0.1:8000/api/courses/`)
                ]);
                setCategories(catRes.data);
                setCourses(courseRes.data);
            } catch (err) {
                console.error("Error loading public course data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategoryId]);

    // 2. Sync internal input if URL changes (e.g. browser back button)
    useEffect(() => {
        setSearchQuery(urlSearchQuery);
    }, [urlSearchQuery]);

    // 3. Search Filtering Logic
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showSearchError = searchQuery.length > 0 && filteredCourses.length === 0;

    // 4. Handle "Enter" Key or Form Submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const currentParams = Object.fromEntries([...searchParams]);
        
        if (searchQuery.trim() === "") {
            delete currentParams.q;
            setSearchParams(currentParams);
        } else {
            setSearchParams({ ...currentParams, q: searchQuery.trim() });
        }
    };

    const CourseCardSkeleton = () => (
        <div className="col-md-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="skeleton w-100" style={{ height: '200px' }}></div>
                <div className="card-body p-4">
                    <div className="skeleton rounded-pill mb-2 w-75" style={{ height: '20px' }}></div>
                    <div className="skeleton rounded-pill mb-3 w-50" style={{ height: '14px' }}></div>
                    <div className="skeleton rounded-pill w-100" style={{ height: '40px' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                    @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
                    .skeleton {
                        background: #f6f7f8;
                        background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
                        background-repeat: no-repeat;
                        background-size: 800px 104px;
                        animation: shimmer 1.2s linear infinite forwards;
                    }
                    .hover-up:hover { transform: translateY(-5px); }
                    .transition-all { transition: all 0.3s ease; }
                    .line-clamp-2 {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;  
                        overflow: hidden;
                    }
                    .search-error-ring {
                        border: 1px solid #dc3545 !important;
                        box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
                    }
                `}
            </style>

            <div className="container-fluid bg-light min-vh-100 py-5" style={{ marginTop: '60px' }}>
                <div className="container">
                    <div className="row g-4">
                        
                        {/* --- Sidebar Filters --- */}
                        <div className="col-lg-3">
                            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <Filter size={18} className="text-primary"/> Filters
                                </h5>
                                
                                <form onSubmit={handleSearchSubmit} className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Search</label>
                                    <div className={`input-group bg-light rounded-3 overflow-hidden border transition-all ${showSearchError ? 'search-error-ring' : ''}`}>
                                        <span className={`input-group-text border-0 bg-transparent ${showSearchError ? 'text-danger' : 'text-muted'}`}>
                                            <Search size={16}/>
                                        </span>
                                        <input 
                                            type="text" 
                                            className="form-control border-0 bg-transparent ps-0 shadow-none" 
                                            placeholder="Press enter to search..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {showSearchError && (
                                            <span className="input-group-text border-0 bg-transparent text-danger small fw-bold pe-3 animate-fade-in">
                                                0 found
                                            </span>
                                        )}
                                    </div>
                                </form>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Categories</label>
                                    <div className="nav flex-column nav-pills gap-1">
                                        <button 
                                            onClick={() => { setSearchParams({}); setSearchQuery(""); }} 
                                            className={`nav-link text-start border-0 py-2 px-3 rounded-3 transition-all ${!activeCategoryId ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
                                        >
                                            <LayoutGrid size={16} className="me-2" /> All Courses
                                        </button>
                                        {categories.map(cat => (
                                            <button 
                                                key={cat.id}
                                                onClick={() => { setSearchParams({ category: cat.title }); setSearchQuery(""); }} 
                                                className={`nav-link text-start border-0 py-2 px-3 rounded-3 transition-all ${activeCategoryId === cat.title ? 'bg-primary text-white shadow-sm' : 'text-dark'}`}
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
                                        {activeCategoryId ? activeCategoryId : "Explore Courses"}
                                    </h2>
                                    <p className="text-muted mb-0">{filteredCourses.length} professional courses available</p>
                                </div>
                            </div>

                            <div className="row g-4">
                                {loading ? (
                                    [1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)
                                ) : filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => (
                                        <div key={course.id} className="col-md-6 col-xl-4">
                                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-up transition-all bg-white border">
                                                <div className="position-relative">
                                                    <img 
                                                        src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop`} 
                                                        className="card-img-top" 
                                                        alt={course.title} 
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div className="position-absolute top-0 end-0 m-3 badge bg-dark bg-opacity-75 backdrop-blur px-3 py-2 rounded-pill">
                                                        {parseFloat(course.price) === 0 ? "Free" : `$${course.price}`}
                                                    </div>
                                                </div>
                                                <div className="card-body p-4 d-flex flex-column">
                                                    <h6 className="fw-bold text-dark mb-2 line-clamp-2" style={{ height: '42px' }}>{course.title}</h6>
                                                    <div className="d-flex align-items-center gap-3 text-muted small mb-4">
                                                        <span className="d-flex align-items-center gap-1"><BookOpen size={14} className="text-primary"/> {course.lesson_count || 0} Lessons</span>
                                                        <span className="d-flex align-items-center gap-1"><Star size={14} className="text-warning"/> 4.8</span>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <Link 
                                                        to={`/course/${course.id}`} // This matches the path="/course/:courseId"
                                                        className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm"
                                                        >
                                                            View Course Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-5">
                                        <div className="bg-white p-5 rounded-4 shadow-sm border">
                                            <XCircle size={48} className="text-danger mb-3 opacity-25" />
                                            <h4>No results found for "{searchQuery}"</h4>
                                            <p className="text-muted">Try a different keyword or check your spelling.</p>
                                            <button onClick={() => {setSearchQuery(""); setSearchParams({});}} className="btn btn-outline-primary rounded-pill px-4">Reset Filters</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}