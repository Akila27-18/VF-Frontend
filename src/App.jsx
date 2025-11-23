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
import ResetPassword from "./pages/ResetPassword";
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
            <Route
              path="/"
              element={<motion.div {...pageTransition}><Landing /></motion.div>}
            />
            <Route
              path="/signup"
              element={<motion.div {...pageTransition}><Signup /></motion.div>}
            />
            <Route
              path="/login"
              element={<motion.div {...pageTransition}><Login /></motion.div>}
            />
            <Route
              path="/forgot-password"
              element={<motion.div {...pageTransition}><ForgotPassword /></motion.div>}
            />
            <Route
              path="/password-reset-confirm/:uid/:token"
              element={<motion.div {...pageTransition}><ResetPassword /></motion.div>}
            />
            <Route
              path="/learn-more"
              element={<motion.div {...pageTransition}><LearnMore /></motion.div>}
            />
            <Route
              path="/get-started"
              element={<motion.div {...pageTransition}><GetStarted /></motion.div>}
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </motion.div>
              }
            />
            <Route
              path="/dashboard/insights"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                </motion.div>
              }
            />
            <Route
              path="/dashboard/payments"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                </motion.div>
              }
            />

            {/* OPTIONAL RESOURCE PAGE */}
            <Route
              path="/resources/:slug"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <ResourcePage />
                  </ProtectedRoute>
                </motion.div>
              }
            />

          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
