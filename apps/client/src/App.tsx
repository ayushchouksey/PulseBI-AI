import { lazy, Suspense } from "react";
import { useAppStore } from "./stores/appStore";
import { ToastContainer } from "./components/ui/Toast";

const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage").then(m => ({ default: m.DashboardPage })));

export default function App() {
  const datasetId = useAppStore((s) => s.datasetId);
  const isUploading = useAppStore((s) => s.isUploading);

  const showDashboard = datasetId && !isUploading;

  return (
    <>
      <Suspense fallback={<div className="min-h-screen bg-surface-50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
        {showDashboard ? <DashboardPage /> : <LandingPage />}
      </Suspense>
      <ToastContainer />
    </>
  );
}
