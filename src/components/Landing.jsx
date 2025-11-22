import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Hero Images
import finance1 from "../assets/illustrations/finance-1.jpg";
import finance2 from "../assets/illustrations/finance-2.jpg";
import finance3 from "../assets/illustrations/finance-3.jpg";

// Feature Icons
import iconBudget from "../assets/icon-budget.webp";
import iconExpense from "../assets/icon-expense.jpg";
import iconChat from "../assets/icon-chat.jpg";

// Highlight Images
import highlight1 from "../assets/illustrations/highlight-1.jpg";
import highlight2 from "../assets/illustrations/highlight-2.jpg";
import highlight3 from "../assets/illustrations/highlight-3.jpg";


// Feature Card Component
const FeatureCard = ({ imgSrc, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center"
  >
    <img src={imgSrc} alt={title} className="w-14 h-14 mb-4 object-contain" />
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-gray-500 text-sm mt-2">{description}</p>
  </motion.div>
);


export default function Landing() {
  return (
    <div
      className="px-6 md:px-16 py-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fff 0%, #fff7f2 40%, #ffe6d5 100%)",
      }}
    >

      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-300 opacity-20 blur-3xl rounded-full"></div>


      {/* ---------------------------- HERO SECTION ---------------------------- */}
      <section className="grid md:grid-cols-2 gap-12 items-center relative z-10 mt-10">

        {/* Left Text Section */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Manage money together — simply
          </h1>

          <p className="mt-4 text-gray-600 text-base md:text-lg">
            Vetri Finance helps couples and individuals track expenses, budget better,
            receive financial insights, and manage shared money effortlessly.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <Link
              to="/get-started"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Get Started
            </Link>

            <Link
              to="/learn-more"
              className="px-6 py-3 border rounded-lg hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Built for India-first UPI and bank integrations.
          </div>
        </motion.div>


        {/* Right Swiper Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl shadow-xl overflow-hidden h-72 md:h-80"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-full"
          >
            <SwiperSlide>
              <img src={finance1} className="w-full h-full object-cover" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={finance2} className="w-full h-full object-cover" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={finance3} className="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>
        </motion.div>

      </section>




      {/* ---------------------------- FEATURES ---------------------------- */}
      <section className="mt-24 grid md:grid-cols-3 gap-10">
        <FeatureCard
          imgSrc={iconBudget}
          title="Budget Planning"
          description="Plan smart budgets with real-time spending insights."
        />
        <FeatureCard
          imgSrc={iconExpense}
          title="Expense Tracking"
          description="Auto-track your spending via UPI & bank sync."
        />
        <FeatureCard
          imgSrc={iconChat}
          title="Partner Chat"
          description="Collaborate with your partner & split expenses easily."
        />
      </section>




      {/* ---------------------------- HIGHLIGHTS ---------------------------- */}
      <section className="mt-24 grid md:grid-cols-3 gap-6">
        <motion.img src={highlight1} className="rounded-xl h-48 md:h-52 w-full object-contain" whileHover={{ scale: 1.05 }} />
        <motion.img src={highlight2} className="rounded-xl h-48 md:h-52 w-full object-contain" whileHover={{ scale: 1.05 }} />
        <motion.img src={highlight3} className="rounded-xl h-48 md:h-52 w-full object-contain" whileHover={{ scale: 1.05 }} />
      </section>




      {/* ---------------------------- CTA SECTION ---------------------------- */}
      <section className="mt-28 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Start managing your finances today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 mb-6 max-w-xl mx-auto"
        >
          Join Vetri Finance and take control of your financial future with
          powerful tools designed for Indian users.
        </motion.p>

        <Link
          to="/get-started"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}
