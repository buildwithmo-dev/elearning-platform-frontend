import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Terminal, Code2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const SandboxRunner = ({ lesson }) => {
  const language = (lesson?.language || "python").toLowerCase();
  const [code, setCode] = useState(lesson?.starter_code || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  
  // Use a ref to keep track of the pyodide instance across renders
  const pyodideInstance = useRef(null);

  // Initialize Pyodide on mount
  useEffect(() => {
    const initPyodide = async () => {
      if (language === "python" && !pyodideInstance.current) {
        try {
          if (!window.loadPyodide) {
            setOutput("❌ Error: Pyodide script not found in index.html");
            return;
          }
          
          // Load the WASM engine
          pyodideInstance.current = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
          });
          
          setIsPyodideReady(true);
        } catch (err) {
          console.error("Pyodide Init Failed:", err);
          setOutput("❌ Failed to initialize Python engine.");
        }
      }
    };

    initPyodide();
  }, [language]);

  // Reset code when lesson changes
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
        if (!pyodideInstance.current) {
          throw new Error("Python engine is still loading... please wait.");
        }

        // Redirect Python's stdout (print statements) to a string buffer
        await pyodideInstance.current.runPythonAsync(`
          import sys, io
          sys.stdout = io.StringIO()
        `);

        // Execute user code
        await pyodideInstance.current.runPythonAsync(code);
        
        // Retrieve the captured output
        const result = pyodideInstance.current.runPython("sys.stdout.getvalue()");
        setOutput(result || "✔ Code executed successfully (no output)");
        
      } else if (language === "javascript") {
        const logs = [];
        const customLog = (...args) => logs.push(args.join(" "));

        // Safely execute JS using a Function constructor
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
          <span className="uppercase font-medium tracking-wider">{language}</span>
          {!isPyodideReady && language === "python" && (
            <span className="text-xs text-yellow-500 animate-pulse flex items-center gap-1">
              • Initializing Engine...
            </span>
          )}
        </div>

        <button
          onClick={runCode}
          disabled={loading || (language === "python" && !isPyodideReady)}
          className="
            flex items-center gap-2
            bg-green-600 hover:bg-green-700
            text-white text-sm font-semibold
            px-4 py-1.5 rounded-lg transition-all
            active:scale-95 disabled:opacity-50 disabled:active:scale-100
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

      {/* Editor Area */}
      <div className="flex-1 min-h-[300px]">
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
            padding: { top: 16 },
          }}
        />
      </div>

      {/* Terminal / Console */}
      <div className="h-48 bg-black border-t border-gray-800 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Terminal size={14} />
            Console Output
          </div>
          {output && (
            <button 
              onClick={() => setOutput("")}
              className="hover:text-white transition"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
          {output ? (
            <motion.pre
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={output.startsWith("❌") ? "text-red-400" : "text-green-400"}
            >
              {output}
            </motion.pre>
          ) : (
            <span className="text-gray-600 italic">
              {loading ? "Executing script..." : "> Click Run to see output"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SandboxRunner;