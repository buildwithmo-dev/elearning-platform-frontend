import React from "react";
import { useAuth } from "../hooks/AuthContext";
import {
  Linkedin,
  Globe,
  FileText,
  Link as LinkIcon,
  Award,
  CheckCircle,
  Plus
} from "lucide-react";

export default function UserAccountPage() {
  const { userProfile } = useAuth();
  const isInstructor = userProfile?.is_instructor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <div className="relative bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-6 flex items-center gap-6 shadow-sm">
          
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/[0.02] to-transparent pointer-events-none"></div>

          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {userProfile?.full_name?.charAt(0)}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {userProfile?.full_name}
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <span className="px-3 py-1 text-xs rounded-full bg-black text-white font-medium">
                {isInstructor ? "Instructor" : "Student"}
              </span>

              <span className="text-xs text-gray-500">
                Joined recently
              </span>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT PANEL */}
          <div className="space-y-6">

            {/* LINKS */}
            <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                Professional Links
              </h3>

              <div className="space-y-3">

                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2.5 rounded-xl border hover:border-gray-300 transition">
                  <Linkedin size={18} className="text-blue-600" />
                  <input
                    className="bg-transparent outline-none w-full text-sm"
                    placeholder="LinkedIn URL"
                  />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2.5 rounded-xl border hover:border-gray-300 transition">
                  <Globe size={18} className="text-green-600" />
                  <input
                    className="bg-transparent outline-none w-full text-sm"
                    placeholder="Portfolio Website"
                  />
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-gray-100 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  <FileText size={16} />
                  Upload Resume
                </button>
              </div>
            </div>

            {/* PUBLICATIONS */}
            {isInstructor && (
              <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Publications
                  </h3>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-center py-8 border border-dashed rounded-2xl bg-gray-50">
                  <p className="text-sm text-gray-500">
                    No publications yet
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">

            {isInstructor ? (
              <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-6 shadow-sm">
                
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Featured Projects
                  </h2>

                  <button className="px-4 py-2 text-sm bg-black text-white rounded-xl hover:scale-[1.03] transition shadow">
                    + Add Project
                  </button>
                </div>

                {/* EMPTY STATE */}
                <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50 relative overflow-hidden">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02]"></div>

                  <LinkIcon className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">
                    Showcase your best work and portfolio here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">

                {/* BADGES */}
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                  <Award size={28} className="text-yellow-500 mb-3" />
                  <h3 className="font-semibold text-gray-900">
                    Achievements
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Earn certificates as you progress.
                  </p>
                </div>

                {/* COMPLETED */}
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                  <CheckCircle size={28} className="text-green-500 mb-3" />
                  <h3 className="font-semibold text-gray-900">
                    Courses Completed
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-gray-900">
                    0
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}