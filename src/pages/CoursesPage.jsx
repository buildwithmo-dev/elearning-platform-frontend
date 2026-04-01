import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  BookOpen,
  Star,
  LayoutGrid,
  XCircle,
} from "lucide-react";

// Use environment variable for the backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://elearning-platform-backend-seven.vercel.app/api";

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryId = searchParams.get("category");
  const urlSearchQuery = searchParams.get("q") || "";

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Added trailing slashes to API endpoints to prevent 308 redirect issues in production
        const [catRes, courseRes] = await Promise.all([
          axios.get(`${API_BASE}/courses/category-section/`),
          axios.get(
            activeCategoryId
              ? `${API_BASE}/courses/?category=${activeCategoryId}`
              : `${API_BASE}/courses/`
          ),
        ]);
        setCategories(catRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeCategoryId]);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = Object.fromEntries([...searchParams]);

    if (!searchQuery.trim()) {
      const newParams = { ...params };
      delete newParams.q;
      setSearchParams(newParams);
    } else {
      setSearchParams({ ...params, q: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
            {activeCategoryId || "Explore Courses"}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {filteredCourses.length} high-quality courses available
          </p>
        </div>

        {/* Use Flex instead of Grid for the main layout to prevent sidebar/content overlap */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - Fixed Width and Sticky */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-6 z-10">
              
              {/* SEARCH */}
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* FILTERS */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Filter size={14} /> Categories
                </h4>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSearchParams({});
                      setSearchQuery("");
                    }}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      !activeCategoryId
                        ? "bg-black text-white shadow-md"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <LayoutGrid size={16} /> All Courses
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSearchParams({ category: cat.title });
                        setSearchQuery("");
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeCategoryId === cat.title
                          ? "bg-black text-white shadow-md"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* COURSE GRID */}
          <main className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 rounded-3xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    
                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        alt={course.title}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {course.price == 0 ? "FREE" : `$${course.price}`}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 h-14">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 text-gray-500 text-xs">
                          <span className="flex items-center gap-1 font-medium">
                            <BookOpen size={14} className="text-blue-500" /> 
                            {course.lesson_count || 0} Lessons
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" /> 
                            4.8
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/course/${course.id}`}
                        className="mt-5 block w-full text-center py-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl text-sm font-bold transition-colors"
                      >
                        View Course Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <XCircle size={40} className="text-gray-300" />
                </div>
                <h3 className="font-bold text-xl text-gray-900">No courses found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                  We couldn't find anything matching "{searchQuery}".
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setSearchParams({}); }}
                  className="mt-6 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}