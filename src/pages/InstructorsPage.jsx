import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import InstructorSettingsForm from "../components/InstructorSettingsForm";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  PlusCircle,
  BarChart3,
  Target,
  Award,
} from "lucide-react";

export default function InstructorsPage() {
  const { userProfile, loading } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setCourses([
        { id: 1, title: "React Hooks", studentCount: 154, revenue: 4500 },
        { id: 2, title: "UI Design", studentCount: 89, revenue: 1200 },
      ]);
      setStudents([
        { id: 1, name: "Alex", progress: 85 },
        { id: 2, name: "Sarah", progress: 40 },
      ]);
    }, 500);
  }, [activeView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f10]">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userProfile?.is_instructor) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f10] text-white">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-lg font-semibold">Instructor Access Only</h2>
          <Link
            to="/auth"
            className="px-5 py-2.5 bg-white text-black rounded-xl hover:opacity-90"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex">

      {/* SIDEBAR */}
      <aside className="w-72 p-6 border-r border-white/10 hidden lg:block">
        <div className="mb-10">
          <div className="w-14 h-14 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
            {userProfile.full_name?.charAt(0)}
          </div>
          <h4 className="mt-3 font-semibold">
            {userProfile.full_name?.split(" ")[0]}
          </h4>
          <p className="text-xs text-white/50">Instructor Panel</p>
        </div>

        <nav className="space-y-1">
          {[
            ["dashboard", LayoutDashboard, "Dashboard"],
            ["courses", BookOpen, "Courses"],
            ["students", Users, "Students"],
            ["settings", Settings, "Settings"],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeView === key
                  ? "bg-white text-black shadow"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-10 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {activeView === "dashboard" && "Dashboard"}
              {activeView === "courses" && "Courses"}
              {activeView === "students" && "Students"}
              {activeView === "settings" && "Settings"}
            </h1>
            <p className="text-sm text-white/50">
              Manage and scale your teaching business
            </p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:scale-[1.03] transition">
            <PlusCircle size={16} />
            New Course
          </button>
        </div>

        {/* DASHBOARD */}
        {activeView === "dashboard" && (
          <>
            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ["Courses", courses.length],
                ["Students", 842],
                ["Revenue", "$2,450"],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
                >
                  <p className="text-sm text-white/50">{label}</p>
                  <h3 className="text-2xl font-semibold mt-1">{value}</h3>
                </div>
              ))}
            </div>

            {/* ANALYTICS */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={16} />
                  <span className="text-sm font-medium">
                    Analytics Overview
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center text-white/30">
                  Chart placeholder
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} />
                  <span className="text-sm font-medium">Goal</span>
                </div>

                <div className="h-2 bg-white/10 rounded-full mb-4">
                  <div className="w-3/4 h-full bg-white rounded-full"></div>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Award size={14} />
                  Top 10% Instructor
                </div>
              </div>
            </div>
          </>
        )}

        {/* COURSES */}
        {activeView === "courses" && (
          <div className="space-y-4">
            {courses.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition"
              >
                <div>
                  <h4 className="font-medium">{c.title}</h4>
                  <p className="text-sm text-white/50">
                    {c.studentCount} students
                  </p>
                </div>
                <span className="text-white/80">${c.revenue}</span>
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS */}
        {activeView === "students" && (
          <div className="space-y-4">
            {students.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex justify-between mb-2 text-sm">
                  <span>{s.name}</span>
                  <span className="text-white/50">{s.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${s.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {activeView === "settings" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <InstructorSettingsForm />
          </div>
        )}
      </main>
    </div>
  );
}