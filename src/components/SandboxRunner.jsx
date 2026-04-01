import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Code2 } from "lucide-react";
import { motion } from "framer-motion";

/* ---------- Pyodide Loader ---------- */
const loadPyodide = async () => {
  if (!window.pyodide) {
    window.pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
    });
  }
  return window.pyodide;
};

const SandboxRunner = ({ lesson }) => {
  const language = (lesson?.language || "python").toLowerCase();

  const [code, setCode] = useState(lesson?.starter_code || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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

        pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
        `);

        await pyodide.runPythonAsync(code);
        const result = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(result || "✔ Code executed successfully");
      } else if (language === "javascript") {
        const logs = [];
        const customLog = (...args) => logs.push(args.join(" "));

        const fn = new Function("console", code);
        fn({ log: customLog });

        setOutput(logs.join("\n") || "✔ Code executed successfully");
      } else {
        setOutput(`Language "${language}" not supported`);
      }
    } catch (err) {
      setOutput(`❌ ${err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-gray-800 shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#020617] border-b border-gray-800">

        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Code2 size={16} />
          <span className="uppercase">{language}</span>
        </div>

        <button
          onClick={runCode}
          disabled={loading}
          className="
            flex items-center gap-2
            bg-green-600 hover:bg-green-700
            text-white text-sm font-semibold
            px-4 py-1.5 rounded-lg transition
            disabled:opacity-50
          "
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Terminal */}
      <div className="h-52 bg-black border-t border-gray-800 flex flex-col">

        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 text-xs text-gray-400">
          <Terminal size={14} />
          Console
        </div>

        <div className="flex-1 p-4 overflow-y-auto text-sm font-mono text-green-400">
          <motion.pre
            key={output}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-pre-wrap"
          >
            {output || "> Ready..."}
          </motion.pre>
        </div>

      </div>
    </div>
  );
};

export default SandboxRunner;