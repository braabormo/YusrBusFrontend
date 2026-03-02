import { Toaster } from "@/components/ui/sonner";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import { TooltipProvider } from "../components/ui/tooltip";
import useAppInitialization from "../hooks/useAppInitialization";
import { AuthProvider } from "./core/auth/authContext";
import ProtectedRoute from "./core/auth/protectedRoute";
import { ThemeProvider } from "./core/components/theme/themeProvider";
import { LoggedInUserProvider } from "./core/contexts/loggedInUserContext";
import { SettingProvider } from "./core/contexts/settingContext";
import RoutesService from "./core/services/constants/routesService";
import BranchesPage from "./features/branches/presentation/branchesPage";
import DashboardPage from "./features/dashboard/dashboardPage";
import LandingPage from "./features/landing/landingPage";
import LoginPage from "./features/login/loginPage";
import MainPage from "./features/main/mainPage";
import NotFoundPage from "./features/notFound/notFoundPage";
import PassengersPage from "./features/passengers/presentation/passengersPage";
import PrfilePage from "./features/profile/prfilePage";
import RoutesPage from "./features/routes/presentation/routesPage";
import SettingPage from "./features/setting/settingPage";
import TripsPage from "./features/trips/presentation/tripsPage";
import UsersPage from "./features/users/presentation/usersPage";

function App() {  
  const { isLoading } = useAppInitialization();

  if(isLoading)
    return <Apploading />;

  return <AppBody />;
}

function AppBody() {
  return (
  <TooltipProvider>   
      <SettingProvider>
        <LoggedInUserProvider>
          <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <AppRoutes />
              <Toaster 
                richColors 
                closeButton 
                position="top-center" 
                dir="rtl" 
              />
            </ThemeProvider>
          </AuthProvider>
        </LoggedInUserProvider>
      </SettingProvider>  
    </TooltipProvider>
  );
}

function Apploading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainPage />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/passengers" element={<PassengersPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path={RoutesService.Profile} element={<PrfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
