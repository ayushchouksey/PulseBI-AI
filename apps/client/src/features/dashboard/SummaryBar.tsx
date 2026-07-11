import { useSummary } from "../../hooks/useApi";
import { useAppStore } from "../../stores/appStore";
import { Card } from "../../components/ui/Card";
import { Sparkles } from "lucide-react";

export function SummaryBar() {
  const { datasetId, setPendingQuestion, openChat } = useAppStore();
  const { data: summary, isLoading } = useSummary(datasetId);

  const handleSuggestionClick = (question: string) => {
    setPendingQuestion(question);
    openChat();
  };

  if (isLoading) {
    return (
      <Card className="mb-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-200" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-48 bg-surface-200 rounded" />
            <div className="h-3 w-full bg-surface-200 rounded max-w-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-brand-50/80 to-white border-brand-100">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-surface-900">
            {summary.greeting}
          </h2>
          <p className="text-sm text-surface-600 mt-1">{summary.summary}</p>
          {summary.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {summary.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 text-xs font-medium text-surface-700 border border-surface-200"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
          {summary.followUpQuestions.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-surface-400 mb-1.5">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {summary.followUpQuestions.map((q, i) => (
                  <SuggestedQuestion key={i} question={q} onClick={() => handleSuggestionClick(q)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function SuggestedQuestion({ question, onClick }: { question: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-surface-200 text-xs font-medium text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-colors cursor-pointer"
    >
      {question}
    </button>
  );
}
