import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* Components */
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

/* Public Pages */
import Landing from "./components/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import LearnMore from "./components/LearnMore";
import GetStarted from "./components/GetStarted";

/* Protected Pages */
import Insights from "./pages/Insights";
import Payments from "./pages/Payments";

/* Optional Resource Page */
import ResourcePage from "./pages/ResourcePage";

/* Page transition animation */
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25 },
};

/* Wrapper for motion animation */
const PageWrapper = ({ children }) => (
  <motion.div {...pageTransition}>{children}</motion.div>
);

export default function App() {
  const location = useLocation();

  const hiddenRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/password-reset-confirm/:uid/:token",
  ];

  const shouldHideHeader = hiddenRoutes.some((path) =>
    location.pathname.startsWith(path.replace(/:\w+/g, ""))
  );

  return (
    <div className="min-h-screen bg-white">
      {!shouldHideHeader && <Header />}

      <main className="max-w-6xl mx-auto p-6 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path="/password-reset-confirm/:uid/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />
            <Route path="/learn-more" element={<PageWrapper><LearnMore /></PageWrapper>} />
            <Route path="/get-started" element={<PageWrapper><GetStarted /></PageWrapper>} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={<PageWrapper><ProtectedRoute><Dashboard /></ProtectedRoute></PageWrapper>}
            />
            <Route
              path="/dashboard/insights"
              element={<PageWrapper><ProtectedRoute><Insights /></ProtectedRoute></PageWrapper>}
            />
            <Route
              path="/dashboard/payments"
              element={<PageWrapper><ProtectedRoute><Payments /></ProtectedRoute></PageWrapper>}
            />

            {/* OPTIONAL RESOURCE PAGE */}
            <Route
              path="/resources/:slug"
              element={<PageWrapper><ProtectedRoute><ResourcePage /></ProtectedRoute></PageWrapper>}
            />

          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
