import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export default function StudentCoursesPage() {
  const { userProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://elearning-platform-backend-seven.vercel.app/api/student/courses/");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">
          Loading your learning dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          Welcome back, {userProfile?.full_name?.split(" ")[0] || "Learner"} 👋
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Pick up where you left off and keep building momentum.
        </p>
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 ? (
        <div className="max-w-lg mx-auto">
          <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-10 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-gray-100 mb-5">
              <BookOpen className="text-gray-400" size={28} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No courses yet
            </h2>

            <p className="text-gray-500 mt-2 mb-6 text-sm">
              Start your journey by exploring high-quality courses.
            </p>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:scale-[1.03] transition shadow"
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        /* GRID */
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {courses.map((c) => (
            <div
              key={c.id}
              className="group relative bg-white/70 backdrop-blur border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    c.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                  }
                  alt={c.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Category badge */}
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-xs px-3 py-1 rounded-full font-medium shadow">
                  {c.category || "Course"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {c.title}
                </h3>

                {/* PROGRESS */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-1 text-gray-500">
                    <span>Progress</span>
                    <span className="font-semibold text-black">
                      {c.progress || 0}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-black to-gray-700 transition-all duration-500"
                      style={{ width: `${c.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto pt-6">
                  <Link
                    to={`/student/course/${c.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl font-medium hover:scale-[1.02] transition shadow"
                  >
                    Continue Learning <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent group-hover:ring-black/10 transition pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}