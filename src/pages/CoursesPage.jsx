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
        const [catRes, courseRes] = await Promise.all([
          axios.get("https://elearning-platform-backend-seven.vercel.app/api/courses/category-section"),
          axios.get(
            activeCategoryId
              ? `https://elearning-platform-backend-seven.vercel.app/api/courses/?category=${activeCategoryId}`
              : `https://elearning-platform-backend-seven.vercel.app/api/courses/`
          ),
        ]);
        setCategories(catRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error(err);
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
      delete params.q;
      setSearchParams(params);
    } else {
      setSearchParams({ ...params, q: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 px-6 lg:px-12">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeCategoryId || "Explore Courses"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filteredCourses.length} courses available
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-5 h-fit sticky top-24 shadow-xl">

          {/* SEARCH */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border shadow-sm focus-within:ring-2 focus-within:ring-black">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-transparent outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* FILTERS */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Filter size={14} /> Categories
            </h4>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery("");
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  !activeCategoryId
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <LayoutGrid size={14} className="inline mr-2" />
                All Courses
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSearchParams({ category: cat.title });
                    setSearchQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeCategoryId === cat.title
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COURSE GRID */}
        <div className="lg:col-span-3">

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white rounded-2xl shadow-sm border hover:shadow-lg transition overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                      }
                      className="h-44 w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                      {course.price == 0 ? "Free" : `$${course.price}`}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {course.lesson_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        4.8
                      </span>
                    </div>

                    <Link
                      to={`/course/${course.id}`}
                      className="mt-5 text-sm font-medium text-black hover:underline"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border text-center">
              <XCircle size={48} className="text-gray-300 mb-3" />
              <h3 className="font-semibold text-lg">
                No results for "{searchQuery}"
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Try a different keyword
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams({});
                }}
                className="mt-4 px-4 py-2 bg-black text-white rounded-xl text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}