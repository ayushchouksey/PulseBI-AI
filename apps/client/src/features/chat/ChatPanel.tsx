import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import { useAskQuestion } from "../../hooks/useApi";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  X, Send, Bot, User, Loader2, BarChart3, MessageSquareText,
  TrendingUp, Brain, Shield, Target, Lightbulb, Settings2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { showToast } from "../../components/ui/Toast";

const LEVEL_CONFIG = {
  information: { icon: MessageSquareText, label: "Answer", color: "text-surface-500" },
  analysis: { icon: BarChart3, label: "Analysis", color: "text-brand-500" },
  recommendation: { icon: TrendingUp, label: "Recommendation", color: "text-amber-500" },
  executive_brief: { icon: Brain, label: "Executive Brief", color: "text-purple-500" },
  decision_support: { icon: Shield, label: "Decision", color: "text-emerald-500" },
  highlight: { icon: Target, label: "Highlight", color: "text-rose-500" },
  explain: { icon: Lightbulb, label: "Explanation", color: "text-sky-500" },
  dashboard_modification: { icon: Settings2, label: "Dashboard Update", color: "text-emerald-600" },
} as const;

const SUGGESTIONS = [
  { q: "What is my total revenue?", level: "information" as const },
  { q: "Why is profit decreasing?", level: "explain" as const },
  { q: "Compare Electronics and Furniture.", level: "analysis" as const },
  { q: "What should I focus on this week?", level: "recommendation" as const },
  { q: "Give me today's executive briefing.", level: "executive_brief" as const },
  { q: "Should I invest more in Electronics?", level: "decision_support" as const },
  { q: "Which region performs best?", level: "highlight" as const },
  { q: "Add Customer KPI to my dashboard.", level: "dashboard_modification" as const },
];

export function ChatPanel() {
  const { chatMessages, toggleChat } = useAppStore();
  const [input, setInput] = useState("");
  const askMutation = useAskQuestion();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || askMutation.isPending) return;
    const question = input.trim();
    setInput("");
    askMutation.mutate(question, {
      onError: (err) => showToast("error", "Failed", err instanceof Error ? err.message : "Unknown error"),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-[420px] h-[600px] z-40 p-4 animate-slide-up">
      <Card padding="none" className="h-full flex flex-col shadow-modal overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">PulseBI AI</h3>
              <p className="text-xs text-surface-400">Ask anything about your data</p>
            </div>
          </div>
          <button onClick={toggleChat} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-6">
              <Bot className="h-10 w-10 text-surface-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-surface-600">Ask me anything</p>
              <p className="text-xs text-surface-400 mt-1">I answer questions, analyze data, recommend actions, and modify your dashboard</p>
              <div className="space-y-1.5 mt-4">
                {SUGGESTIONS.map(({ q, level }) => {
                  const cfg = LEVEL_CONFIG[level];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-surface-50 border border-surface-200 text-xs text-surface-600 hover:bg-surface-100 transition-colors"
                    >
                      <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {chatMessages.map((msg) => {
            const level = msg.aiResponse?.intent.level;
            const cfg = level ? LEVEL_CONFIG[level] : null;
            const LevelIcon = cfg?.icon;

            return (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : "space-y-1.5"}`}>
                  {level && msg.role === "assistant" && LevelIcon && cfg && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                      <LevelIcon className="h-3 w-3" />
                      {cfg.label}
                    </div>
                  )}
                  <div
                    className={`px-3 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-brand-500 text-white rounded-br-md"
                        : "bg-surface-100 text-surface-800 rounded-bl-md"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  </div>
                  {msg.aiResponse?.analysis?.chart && (
                    <div className="text-xs text-brand-500 font-medium mt-1">
                      Chart available in Analysis Panel
                    </div>
                  )}
                  {msg.aiResponse?.dashboardPatch && (
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      Dashboard updated
                    </div>
                  )}
                  {msg.aiResponse?.highlight && (
                    <div className="text-xs text-rose-500 font-medium mt-1">
                      Chart highlighted below
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {askMutation.isPending && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-bl-md bg-surface-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-surface-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-surface-200 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              disabled={askMutation.isPending}
            />
            <Button size="sm" onClick={handleSend} disabled={!input.trim() || askMutation.isPending} className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
