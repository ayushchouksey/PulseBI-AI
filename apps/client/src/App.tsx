import { useAppStore } from "./stores/appStore";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ToastContainer } from "./components/ui/Toast";

export default function App() {
  const { datasetId, isUploading } = useAppStore();

  const showDashboard = datasetId && !isUploading;

  return (
    <>
      {showDashboard ? <DashboardPage /> : <LandingPage />}
      <ToastContainer />
    </>
  );
}
