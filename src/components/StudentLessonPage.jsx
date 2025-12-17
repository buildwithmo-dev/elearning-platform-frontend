import SandboxRunner from "./SandboxRunner";
import '../App.css';
import { FileText, PlayCircle, Code, Download } from 'lucide-react';

export default function StudentLessonPage({ lesson, studentId }) {
  if (!lesson) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-muted">
      <BookOpen size={48} className="mb-3 opacity-20" />
      <p>Select a lesson from the sidebar to begin.</p>
    </div>
  );

  const renderContent = () => {
    switch (lesson.content_type) {
      case "sandbox":
        return (
          <div className="card border-0 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="bg-dark text-white p-2 d-flex align-items-center px-3">
              <Code size={18} className="me-2 text-primary" />
              <span className="small fw-mono">Interactive Lab: {lesson.title}</span>
            </div>
            <SandboxRunner key={lesson.id} lesson={lesson} />
          </div>
        );

      case "video":
        return (
          <div className="video-container shadow-lg rounded-3 overflow-hidden bg-black">
            <div className="ratio ratio-16x9">
              <video 
                src={lesson.content_url} 
                controls 
                controlsList="nodownload"
                className="w-100"
              />
            </div>
          </div>
        );

      case "document":
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                  <FileText className="text-primary me-2" />
                  <h6 className="mb-0 fw-bold">Reading Material</h6>
                </div>
                <a href={lesson.content_url} download className="btn btn-sm btn-outline-primary">
                  <Download size={16} className="me-1" /> Download PDF
                </a>
              </div>
              <iframe 
                src={`${lesson.content_url}#toolbar=0`} 
                title={lesson.title}
                width="100%" 
                height="600px" 
                className="border-0"
              />
            </div>
          </div>
        );

      default:
        return <div className="alert alert-warning">Unknown content type.</div>;
    }
  };

  return (
    <div className="lesson-viewport p-4 animate-fade-in">
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-2">
            <li className="breadcrumb-item small text-uppercase tracking-wider">Module 1</li>
            <li className="breadcrumb-item active small text-uppercase" aria-current="page">Current Lesson</li>
          </ol>
        </nav>
        <h2 className="fw-bold">{lesson.title}</h2>
        <hr className="opacity-10" />
      </div>

      {renderContent()}

      <div className="mt-5 p-4 bg-light rounded-3 border">
        <h5 className="fw-bold mb-3">Lesson Description</h5>
        <p className="text-secondary mb-0" style={{ lineHeight: '1.7' }}>
          {lesson.description || "In this lesson, you will learn the fundamental concepts required to master this module. Please follow along with the provided materials."}
        </p>
      </div>
    </div>
  );
}