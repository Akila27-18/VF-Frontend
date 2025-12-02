import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Feature Illustrations
import featureBudget from "../assets/illustrations/feature-budget.jpg";
import featureExpense from "../assets/illustrations/feature-expense.jpg";
import featureChat from "../assets/illustrations/feature-chat.jpg";

// Showcase Images
import showcase1 from "../assets/illustrations/showcase-1.jpg";
import showcase2 from "../assets/illustrations/showcase-2.jpg";
import showcase3 from "../assets/illustrations/showcase-3.jpg";

const Feature = ({ img, title, text }) => (
<motion.div whileHover={{ y: -6 }} className="bg-white rounded-xl shadow p-6"> <img src={img} alt={title} className="w-full h-40 rounded-lg object-cover mb-3" loading="lazy" /> <div className="font-semibold mb-1">{title}</div> <div className="text-sm text-gray-500">{text}</div>
</motion.div>
);

const ShowcaseSlide = ({ img, title, text }) => (

  <div className="bg-white p-6 rounded-xl flex items-center gap-6 shadow">
    <img src={img} alt={title} className="w-40 h-32 rounded-lg object-cover" loading="lazy" />
    <div>
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm text-gray-500">{text}</div>
    </div>
  </div>
);

export default function LearnMore() {
return (
<div
className="min-h-screen px-6 md:px-16 py-12"
style={{ background: "linear-gradient(135deg,#fff 0%,#fff7f2 40%,#ffe6d5 100%)" }}
>
<motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-bold mb-3">
Learn more about Vetri Finance
</motion.h1>

```
  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600 mb-10 max-w-2xl">
    A modern finance app built for India-first payments. Track expenses, plan budgets, chat with your partner, and manage shared finances easily.
  </motion.p>

  {/* Features Grid */}
  <section className="grid md:grid-cols-3 gap-6">
    <Feature img={featureBudget} title="Smart Budgeting" text="Plan monthly or weekly budgets with alerts and insights." />
    <Feature img={featureExpense} title="Real-time Expense Tracking" text="Auto-capture from UPI and bank accounts." />
    <Feature img={featureChat} title="Partner Chat" text="Communicate with your partner and split bills instantly." />
  </section>

  {/* Showcase Carousel */}
  <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-semibold mt-16 mb-4">
    Feature Showcase
  </motion.h2>

  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 3500 }}
    pagination={{ clickable: true }}
    loop
    className="rounded-xl overflow-hidden"
  >
    {[showcase1, showcase2, showcase3].map((img, i) => (
      <SwiperSlide key={i}>
        <ShowcaseSlide
          img={img}
          title={`Feature ${i + 1}`}
          text={
            i === 0
              ? "Beautiful charts that summarize your month."
              : i === 1
              ? "Weekly summaries directly from your UPI activity."
              : "Track what you paid, what your partner paid, and what’s pending."
          }
        />
      </SwiperSlide>
    ))}
  </Swiper>

  {/* CTA Section */}
  <section className="mt-16 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-5">
    <div>
      <div className="font-semibold text-lg">See Vetri Finance in action.</div>
      <div className="text-sm text-gray-500">
        Start exploring with a free account — no card required.
      </div>
    </div>

    <Link
      to="/get-started"
      className="px-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
    >
      Get Started
    </Link>
  </section>
</div>


);
}
