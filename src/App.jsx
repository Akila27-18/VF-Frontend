import React from "react";
import { Routes, Route } from "react-router-dom";

/* Components */
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

/* Pages */
import Landing from "./components/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./components/ForgotPassword";
import NewsFeed from "./components/NewsFeed";
import LearnMore from "./components/LearnMore";
import GetStarted from "./components/GetStarted";
import Insights from "./pages/Insights";
import Payments from "./pages/Payments";

<<<<<<< HEAD
/* Public pages */
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./components/ForgotPassword";
import LearnMore from "./components/LearnMore";
import GetStarted from "./components/GetStarted";

/* Protected route wrapper */
=======
/* Protected wrapper */
>>>>>>> 53b22fd (first commit)
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
<<<<<<< HEAD
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
              path="/learn-more"
              element={<motion.div {...pageTransition}><LearnMore /></motion.div>}
            />
            <Route
              path="/get-started"
              element={<motion.div {...pageTransition}><GetStarted /></motion.div>}
            />

            {/* PROTECTED DASHBOARD ROUTES */}
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

            {/* RESOURCES PAGE */}
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
=======
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/get-started" element={<GetStarted />} />

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
        </Routes>
>>>>>>> 53b22fd (first commit)
      </main>
    </div>
  );
}