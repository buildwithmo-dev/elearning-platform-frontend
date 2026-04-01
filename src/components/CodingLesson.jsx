import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, Terminal, Code2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const CodingLesson = ({ lesson, studentId, onSubmit }) => {
  const [code, setCode] = useState(lesson.starter_code || "");
  const [language, setLanguage] = useState(lesson.language || "python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

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

        await window.pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
        `);

        const result = await window.pyodide.runPythonAsync(code);
        const stdout = await window.pyodide.runPythonAsync("sys.stdout.getvalue()");
        setOutput(stdout || String(result));
      } else {
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

      if (res.ok) {
        alert("Solution submitted!");
        onSubmit && onSubmit();
      }
    } catch {
      alert("Submission failed.");
    }
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-800 bg-[#0f172a]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#020617]">
        <div className="flex items-center gap-2 text-white">
          <Code2 size={18} className="text-blue-500" />
          <span className="font-semibold text-sm">
            {lesson.title || "Coding Challenge"}
          </span>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md border border-gray-700 focus:outline-none"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* IDE Body */}
      <div className="grid md:grid-cols-3 h-[450px]">

        {/* Editor */}
        <div className="md:col-span-2 border-r border-gray-800">
          <Editor
            height="100%"
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

        {/* Terminal */}
        <div className="flex flex-col bg-black">

          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800 text-gray-400 text-xs uppercase">
            <Terminal size={14} />
            Console
          </div>

          <div className="flex-1 p-3 overflow-auto text-sm font-mono text-green-400">
            {output || (
              <span className="text-gray-500">
                // Run your code to see output...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-[#020617]">

        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <AlertCircle size={14} />
          Use print() or console.log()
        </div>

        <div className="flex gap-3">

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm transition disabled:opacity-50"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={16} />
            )}
            Run
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg"
          >
            <Send size={16} />
            Submit
          </motion.button>

        </div>
      </div>
    </div>
  );
};

export default CodingLesson;