import SandboxRunner from "./SandboxRunner";
import StudentSubmissionPage from "./StudentSubmissionPage";
import CodingLesson from "./CodingLesson";

export default function StudentLessonPage({ lessons, studentId }) {
  if (!lessons || lessons.length === 0) return <div>No lessons found.</div>;

  return (
    <div className="container p-3">
      {lessons.map((lesson) => {
        if (lesson.content_type === "sandbox") {
          // Option 1: Use external sandbox URL
          // return <StudentSubmissionPage lesson={lesson} />;

          // Option 2: Live sandbox runner in-browser
          return <SandboxRunner key={lesson.id} lesson={lesson} />;

          // Option 3: Coding assignment with submit
          // return <CodingLesson key={lesson.id} lesson={lesson} studentId={studentId} />;
        } else if (lesson.content_type === "video") {
          return (
            <div key={lesson.id}>
              <h5>{lesson.title}</h5>
              <video src={lesson.content_url} controls width="100%" />
            </div>
          );
        } else if (lesson.content_type === "document") {
          return (
            <div key={lesson.id}>
              <h5>{lesson.title}</h5>
              <iframe src={lesson.content_url} width="100%" height="400px"></iframe>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
