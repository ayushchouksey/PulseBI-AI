import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, ArrowRight, Sparkles, BarChart3, Brain, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useUploadCSV } from "../hooks/useApi";
import { showToast } from "../components/ui/Toast";
import { useAppStore } from "../stores/appStore";

export function LandingPage() {
  const uploadMutation = useUploadCSV();
  const setUploading = useAppStore((s) => s.setUploading);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      showToast("error", "Invalid file type", "Please upload a CSV file");
      return;
    }
    try {
      setUploading(true);
      await uploadMutation.mutateAsync(file);
      showToast("success", "Dataset loaded", "Your dashboard is ready");
    } catch (err) {
      showToast("error", "Upload failed", err instanceof Error ? err.message : "Unknown error");
    }
  }, [uploadMutation, setUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
  });

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Natural language queries and intelligent summaries powered by Ollama",
    },
    {
      icon: BarChart3,
      title: "Auto-Generated Dashboards",
      description: "Upload CSV and get an executive dashboard instantly",
    },
    {
      icon: Zap,
      title: "Verified Statistics",
      description: "Every number is calculated by Node.js, never by AI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">PulseBI</span>
            <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2 py-0.5 rounded-full">AI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-surface-500 hidden sm:block">Powered by verified analytics</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="animate-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-first Business Intelligence
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-surface-900 tracking-tight animate-in delay-100">
            Your data, instantly
            <br />
            <span className="gradient-text">understood</span>
          </h1>

          <p className="text-xl text-surface-500 max-w-2xl mx-auto animate-in delay-200">
            Upload a CSV. Get an executive dashboard. Ask questions in plain English.
            <br />
            No building. No coding. Just insights.
          </p>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto animate-in delay-300">
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 cursor-pointer ${
                isDragActive || dragActive
                  ? "border-brand-500 bg-brand-50/50 scale-[1.02]"
                  : "border-surface-300 bg-white hover:border-brand-300 hover:bg-surface-50"
              } ${uploadMutation.isPending ? "pointer-events-none opacity-70" : ""}`}
            >
              <input {...getInputProps()} />

              {uploadMutation.isPending ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center animate-pulse">
                    <FileSpreadsheet className="h-8 w-8 text-brand-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-surface-900">Processing your data...</p>
                    <div className="w-64 h-2 bg-surface-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all duration-300" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                    <Upload className="h-8 w-8 text-surface-400 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-surface-900">
                      Drop your CSV here or click to browse
                    </p>
                    <p className="text-sm text-surface-400">
                      Supports any CSV up to 50MB. Dashboard generates instantly.
                    </p>
                  </div>
                  <Button size="lg" className="mt-2">
                    Choose File
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`card-base p-6 text-left animate-in`}
                style={{ animationDelay: `${400 + i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-brand-500" />
                </div>
                <h3 className="text-base font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Trust */}
          <div className="mt-16 animate-in delay-500">
            <p className="text-sm text-surface-400">
              Every calculation performed by Node.js. AI only explains — never estimates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
