import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ChevronLeft,
  Layout,
  AlertCircle,
  Terminal,
} from "lucide-react";
import SandboxRunner from "../components/SandboxRunner";

export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await fetch(`https://elearning-platform-backend-seven.vercel.app//api/courses/${courseId}/`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setLessons(data);
          if (data.length > 0) setActiveLesson(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchCurriculum();
  }, [courseId]);

  return (
    <div className="flex h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100">

      {/* SIDEBAR */}
      <div className="w-80 backdrop-blur-xl bg-white/70 border-r border-white/40 shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur z-10">
          <Link to="/courses" className="text-xs text-gray-500 flex items-center gap-1 mb-2 hover:text-black">
            <ChevronLeft size={14}/> Back to Courses
          </Link>

          <h6 className="font-semibold text-gray-800">Course Content</h6>
          <p className="text-xs text-gray-500">{lessons.length} lessons</p>
        </div>

        {/* LESSON LIST */}
        <div className="overflow-y-auto flex-1 px-2 py-3 space-y-1">

          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 px-3 py-3 animate-pulse">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : lessons.length > 0 ? (
            lessons.map((lesson, index) => {
              const isActive = activeLesson?.id === lesson.id;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all
                    ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                >
                  {/* index */}
                  <span className={`text-xs w-5 ${isActive ? "text-white/70" : "text-gray-400"}`}>
                    {index + 1}
                  </span>

                  {/* content */}
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">
                      {lesson.title}
                    </p>

                    <div className={`text-xs flex items-center gap-1 ${isActive ? "text-white/70" : "text-gray-400"}`}>
                      {lesson.content_type === "video" && <PlayCircle size={12}/>}
                      {lesson.content_type === "sandbox" && <Terminal size={12}/>}
                      {lesson.content_type === "document" && <FileText size={12}/>}
                      {lesson.content_type}
                    </div>
                  </div>

                  {/* completed */}
                  {lesson.completed && (
                    <CheckCircle size={14} className="text-green-500" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-400">
              <Layout size={40} className="mx-auto mb-2 opacity-30"/>
              No lessons yet
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">

        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        ) : activeLesson ? (
          <div className="max-w-6xl mx-auto p-8">

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeLesson.title}
              </h2>
              <p className="text-sm text-gray-500 capitalize">
                {activeLesson.content_type}
              </p>
            </div>

            {/* CONTENT */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden mb-6">

              {/* VIDEO */}
              {activeLesson.content_type === "video" && (
                <video
                  src={activeLesson.content_url}
                  controls
                  className="w-full rounded-2xl"
                />
              )}

              {/* DOCUMENT */}
              {activeLesson.content_type === "document" && (
                <div className="p-12 text-center">
                  <FileText size={60} className="mx-auto text-black mb-4"/>
                  <h4 className="font-semibold mb-2 text-gray-900">
                    Reading Material
                  </h4>
                  <p className="text-gray-500 mb-6">
                    Open the document to continue learning.
                  </p>

                  <a
                    href={activeLesson.content_url}
                    target="_blank"
                    className="px-6 py-2 bg-black text-white rounded-xl hover:scale-[1.04] transition"
                  >
                    Open Document
                  </a>
                </div>
              )}

              {/* SANDBOX */}
              {activeLesson.content_type === "sandbox" && (
                <div className="h-[650px]">
                  <SandboxRunner
                    lesson={{
                      ...activeLesson,
                      language: activeLesson.language || "python",
                      starter_code:
                        activeLesson.starter_code ||
                        "# Write your code\nprint('Hello')",
                    }}
                  />
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h5 className="font-semibold mb-2 text-gray-900">
                Lesson Description
              </h5>
              <p className="text-gray-600 leading-relaxed">
                {activeLesson.description || "No description provided."}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={40} className="mx-auto mb-3 text-yellow-500"/>
              <p>No lesson selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}