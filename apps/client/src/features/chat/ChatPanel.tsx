import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import { askQuestion } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { showToast } from "../../components/ui/Toast";

export function ChatPanel() {
  const { datasetId, chatMessages, addChatMessage, toggleChat } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || !datasetId || isLoading) return;

    const question = input.trim();
    setInput("");

    addChatMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    });

    setIsLoading(true);
    try {
      const result = await askQuestion(datasetId, question);
      addChatMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      showToast("error", "Chat failed", err instanceof Error ? err.message : "Unknown error");
      addChatMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm sorry, I couldn't process that question. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-96 h-[600px] z-40 p-4 animate-slide-up">
      <Card padding="none" className="h-full flex flex-col shadow-modal overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-surface-900">PulseBI AI</h3>
              <p className="text-xs text-surface-400">Ask about your data</p>
            </div>
          </div>
          <button onClick={toggleChat} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-10 w-10 text-surface-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-surface-600">Ask me anything</p>
              <p className="text-xs text-surface-400 mt-1">I can explain trends, compare metrics, and more</p>
              <div className="space-y-2 mt-4">
                {["What are the top performers?", "Show me trends over time", "Any outliers?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-surface-50 border border-surface-200 text-xs text-surface-600 hover:bg-surface-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-brand-500 text-white rounded-br-md"
                    : "bg-surface-100 text-surface-800 rounded-bl-md"
                }`}
              >
                <div className="prose prose-sm max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
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
              disabled={isLoading}
            />
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
