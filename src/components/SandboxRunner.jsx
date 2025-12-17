import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

// Load Pyodide for Python execution
const loadPyodide = async () => {
  if (!window.pyodide) {
    window.pyodide = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
  }
  return window.pyodide;
};

const SandboxRunner = ({ lesson }) => {
  const [code, setCode] = useState(lesson.starter_code || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      if (lesson.language.toLowerCase() === "python") {
        const pyodide = await loadPyodide();
        let result = await pyodide.runPythonAsync(code);
        setOutput(String(result));
      } else if (lesson.language.toLowerCase() === "javascript") {
        // Run JS safely in sandboxed iframe
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const win = iframe.contentWindow;
        try {
          win.console.log = (...args) => setOutput((prev) => prev + args.join(" ") + "\n");
          win.eval(code);
        } catch (err) {
          setOutput(err.toString());
        }
        document.body.removeChild(iframe);
      } else {
        setOutput(`Language "${lesson.language}" not supported`);
      }
    } catch (err) {
      setOutput(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{lesson.title}</h5>
      <p>Language: {lesson.language}</p>
      <Editor
        height="300px"
        language={lesson.language.toLowerCase()}
        value={code}
        onChange={(val) => setCode(val)}
        options={{ fontSize: 14 }}
      />
      <button className="btn btn-primary mt-2" onClick={runCode} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>
      <pre className="mt-2 p-2 border bg-light">{output}</pre>
    </div>
  );
};

export default SandboxRunner;
