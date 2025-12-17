import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodingLesson = ({ lesson, studentId, onSubmit }) => {
  const [code, setCode] = useState(lesson.starter_code || "");
  const [language, setLanguage] = useState(lesson.language || "python");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      if (language === "python") {
        // Using Pyodide in-browser
        if (!window.pyodide) {
          setOutput("Loading Python runtime...");
          window.pyodide = await window.loadPyodide();
        }
        const result = await window.pyodide.runPythonAsync(code);
        setOutput(String(result));
      } else if (language === "javascript") {
        try {
          // JS sandbox
          const result = eval(code); // ⚠️ Only safe for JS exercises!
          setOutput(String(result));
        } catch (err) {
          setOutput(err.message);
        }
      }
    } catch (err) {
      setOutput(err.message);
    }
  };

  const handleSubmit = async () => {
    await fetch("/api/courses/submit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, lessonId: lesson.id, code }),
    });
    onSubmit && onSubmit();
  };

  return (
    <div className="coding-lesson">
      <h5>{lesson.title}</h5>
      <div className="mb-2">
        <select
          className="form-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <Editor
        height="300px"
        defaultLanguage={language}
        value={code}
        onChange={setCode}
        theme="vs-dark"
      />

      <div className="mt-2">
        <button className="btn btn-primary me-2" onClick={runCode}>
          Run
        </button>
        <button className="btn btn-success" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className="mt-2">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodingLesson;
