import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const loadPyodide = async () => {
  if (!window.pyodide) {
    window.pyodide = await window.loadPyodide({ 
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" 
    });
  }
  return window.pyodide;
};

const SandboxRunner = ({ lesson }) => {
  // Use safe defaults to prevent .toLowerCase() crashes
  const language = (lesson?.language || "python").toLowerCase();
  const [code, setCode] = useState(lesson?.starter_code || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // This ensures that when you switch lessons, the code editor updates
  useEffect(() => {
    if (lesson) {
      setCode(lesson.starter_code || "# Write your code here");
      setOutput("");
    }
  }, [lesson]);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      if (language === "python") {
        const pyodide = await loadPyodide();
        // Redirect python stdout to capture 'print' statements
        pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const result = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(result || "Code executed successfully (no output).");
      } else if (language === "javascript") {
        const logs = [];
        const customLog = (...args) => logs.push(args.join(" "));
        
        // Execute JS logic
        const fn = new Function("console", code);
        fn({ log: customLog });
        setOutput(logs.join("\n") || "Code executed successfully.");
      } else {
        setOutput(`Language "${language}" not supported yet.`);
      }
    } catch (err) {
      setOutput(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100 bg-dark text-white rounded-bottom overflow-hidden">
      <div className="p-2 bg-secondary d-flex justify-content-between align-items-center">
        <span className="badge bg-dark text-uppercase">{language}</span>
        <button 
          className="btn btn-success btn-sm px-4 fw-bold" 
          onClick={runCode} 
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>
      
      <div className="flex-grow-1 border-bottom border-secondary">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(val) => setCode(val)}
          options={{ 
            fontSize: 14, 
            minimap: { enabled: false },
            scrollBeyondLastLine: false 
          }}
        />
      </div>

      <div className="bg-black p-3" style={{ height: '200px', overflowY: 'auto' }}>
        <small className="text-secondary d-block mb-1 font-monospace">CONSOLE OUTPUT:</small>
        <pre className="text-info mb-0 font-monospace">{output || "> _"}</pre>
      </div>
    </div>
  );
};

export default SandboxRunner;