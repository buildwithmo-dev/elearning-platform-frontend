import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, Terminal, Code2, AlertCircle } from 'lucide-react';

const CodingLesson = ({ lesson, studentId, onSubmit }) => {
  const [code, setCode] = useState(lesson.starter_code || "");
  const [language, setLanguage] = useState(lesson.language || "python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Sync editor language when prop or state changes
  useEffect(() => {
    if (lesson.language) setLanguage(lesson.language);
  }, [lesson.language]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    try {
      if (language === "python") {
        if (!window.pyodide) {
          setOutput("Initializing Python environment...");
          window.pyodide = await window.loadPyodide();
        }
        // Capture stdout for a better terminal experience
        await window.pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.String()
        `);
        const result = await window.pyodide.runPythonAsync(code);
        const stdout = await window.pyodide.runPythonAsync("sys.stdout.getvalue()");
        setOutput(stdout || String(result));
      } else if (language === "javascript") {
        const result = eval(code);
        setOutput(String(result));
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/courses/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, lessonId: lesson.id, code }),
      });
      if (res.ok) alert("Solution submitted successfully!");
      onSubmit && onSubmit();
    } catch (err) {
      alert("Submission failed.");
    }
  };

  return (
    <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
      {/* Header Bar */}
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2 px-3">
        <div className="d-flex align-items-center gap-2">
          <Code2 size={18} className="text-primary" />
          <span className="fw-bold small">{lesson.title || "Coding Challenge"}</span>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm bg-secondary text-white border-0"
            style={{ width: '120px' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>

      {/* Main IDE Body */}
      <div className="row g-0">
        {/* Editor Area */}
        <div className="col-md-8 border-end">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Terminal Area */}
        <div className="col-md-4 bg-dark d-flex flex-column" style={{ height: '400px' }}>
          <div className="p-2 border-bottom border-secondary d-flex align-items-center text-secondary">
            <Terminal size={14} className="me-2" />
            <span className="x-small fw-bold text-uppercase">Console Output</span>
          </div>
          <div className="p-3 flex-grow-1 overflow-auto">
            <pre className="text-light fw-mono small mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {output || <span className="text-muted opacity-50">// Run your code to see results...</span>}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="card-footer bg-white d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center text-muted small">
          <AlertCircle size={14} className="me-1" />
          Use <code>print()</code> to see output in the console.
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-dark d-flex align-items-center gap-2 px-4" 
            onClick={runCode}
            disabled={isRunning}
          >
            {isRunning ? <span className="spinner-border spinner-border-sm" /> : <Play size={16} />}
            Run
          </button>
          <button 
            className="btn btn-success d-flex align-items-center gap-2 px-4" 
            onClick={handleSubmit}
          >
            <Send size={16} />
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingLesson;