import SandboxRunner from "./SandboxRunner";
import { FileText, Code, Download, BookOpen } from 'lucide-react';

export default function StudentLessonPage({ lesson }) {
  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <BookOpen size={48} className="mb-3 opacity-30" />
        <p className="text-sm">Select a lesson from the sidebar to begin.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (lesson.content_type) {
      case "sandbox":
        return (
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-200px)]">
            <div className="bg-gray-900 text-white px-4 py-2 flex items-center gap-2 text-sm font-medium">
              <Code size={16} className="text-blue-400" />
              Interactive Lab: {lesson.title}
            </div>
            <SandboxRunner key={lesson.id} lesson={lesson} />
          </div>
        );

      case "video":
        return (
          <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
            <div className="aspect-video">
              <video
                src={lesson.content_url}
                controls
                controlsList="nodownload"
                className="w-full h-full"
              />
            </div>
          </div>
        );

      case "document":
        return (
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-500" size={18} />
                <span className="font-semibold text-gray-800 text-sm">
                  Reading Material
                </span>
              </div>

              <a
                href={lesson.content_url}
                download
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border hover:bg-gray-100 transition"
              >
                <Download size={14} />
                Download PDF
              </a>
            </div>

            <iframe
              src={`${lesson.content_url}#toolbar=0`}
              title={lesson.title}
              className="w-full h-[600px]"
            />
          </div>
        );

      default:
        return (
          <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl text-sm">
            Unknown content type.
          </div>
        );
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      
      {/* Header */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
          Module 1 / Current Lesson
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {lesson.title}
        </h1>

        <div className="mt-3 h-px bg-gray-200" />
      </div>

      {/* Main Content */}
      {renderContent()}

      {/* Description */}
      <div className="mt-8 bg-gray-50 border rounded-2xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Lesson Description
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {lesson.description ||
            "In this lesson, you will learn the fundamental concepts required to master this module. Please follow along with the provided materials."}
        </p>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}