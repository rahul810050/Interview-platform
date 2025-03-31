import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon, Play, RefreshCw, Save, TerminalIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";

function CodeEditor() {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java" | "cpp">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);
  const [output, setOutput] = useState<string>("");
  const [userInput, setUserInput] = useState<string>(""); // ⬅️ New Input State

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java" | "cpp") => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  // 🛠️ Running Code Logic
  const runCode = async () => {
    setOutput("Running...");

    const languageMap: { [key: string]: number } = {
      javascript: 63, // Node.js
      python: 71, // Python 3
      java: 62, // Java
      cpp: 54, // C++ (g++ 17.2)
    };

    const languageId = languageMap[language];

    if (!languageId) {
      setOutput("Unsupported language");
      return;
    }

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "7a238ee83fmsh7b716b1e3b370dcp174c6djsna6f6dc98dbf7", // Replace with your actual API Key
          },
          body: JSON.stringify({
            source_code: code,
            language_id: languageId,
            stdin: userInput, // 🔥 Pass user input dynamically
            expected_output: null,
            cpu_time_limit: 5,
            memory_limit: 128000,
          }),
        }
      );

      const data = await response.json();

      if (!data || !data.status) {
        setOutput("Error: Invalid response from API.");
        return;
      }

      if (data.status.id === 3) {
        setOutput(data.stdout || "No Output");
      } else {
        setOutput(`Error: ${data.status.description}\n${data.stderr || "Execution Error"}`);
      }
    } catch (error) {
      setOutput("Error executing code");
    }
  };

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      {/* SELECT VALUE */}
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    {/* SELECT CONTENT */}
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PROBLEM DESC. */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* PROBLEM EXAMPLES */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">Example {index + 1}:</p>
                          <ScrollArea className="h-full w-full rounded-md">
                            <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                              <div>Input: {example.input}</div>
                              <div>Output: {example.output}</div>
                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">
                                  Explanation: {example.explanation}
                                </div>
                              )}
                            </pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map((constraint, index) => (
                        <li key={index} className="text-muted-foreground">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={60} maxSize={100} className="rounded-xl border border-gray-700 bg-[#1e1e2e]">
        <div className="relative flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-3 bg-[#252530] border-b border-gray-700 text-gray-300">
            <span className="text-sm font-semibold uppercase tracking-wide">{language.toUpperCase()}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={runCode}>
                <Play className="w-5 h-5 text-teal-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCode(selectedQuestion.starterCode[language])}>
                <RefreshCw className="w-5 h-5 text-teal-600" />
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              automaticLayout: true,
              wordWrap: "on",
            }}
            className="rounded-b-xl"
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* USER INPUT SECTION */}
      <div className="p-4 border-t bg-gray-900">
        <label className="text-sm font-medium text-white">Input:</label>
        <textarea
          className="w-full p-2 mt-1 text-sm bg-gray-800 text-white border rounded-md"
          rows={3}
          placeholder="Enter input here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>

      {/* OUTPUT TERMINAL */}
      <ResizablePanel defaultSize={30}>
        <div className="h-full bg-black text-white p-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
            <TerminalIcon className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-teal-400">Terminal</h3>
          </div>
          <pre className="whitespace-pre-wrap mt-2">{output}</pre>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;
