import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import heroImage from "../assets/dashboard/hero.jpg";
import iconBudget from "../assets/icon-budget.webp";
import iconExpense from "../assets/icon-expense.jpg";
import iconChat from "../assets/icon-chat.jpg";
import showcase1 from "../assets/illustrations/showcase-1.jpg";
import showcase2 from "../assets/illustrations/showcase-2.jpg";
import showcase3 from "../assets/illustrations/showcase-3.jpg";

const FeatureCard = ({ img, title, text }) => (
<motion.div whileHover={{ y: -6 }} className="bg-white rounded-xl shadow p-6"> <img src={img} alt={title} className="w-14 h-14 mb-3 object-cover rounded" /> <div className="font-semibold text-lg">{title}</div> <p className="text-gray-500 text-sm mt-1">{text}</p>
</motion.div>
);

const TestimonialSlide = ({ img, name, text }) => (

  <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center gap-4">
    <img src={img} alt={name} className="w-24 h-24 rounded-full object-cover" />
    <div>
      <div className="font-semibold text-lg">{name}</div>
      <p className="text-gray-500 text-sm mt-1">{text}</p>
    </div>
  </div>
);

export default function Landing() {
return (
<div
className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-12"
style={{
background: "linear-gradient(135deg, #fff 0%, #fff7f2 40%, #ffe6d5 100%)",
}}
>
{/* Hero Section */} <div className="flex flex-col md:flex-row items-center gap-12"> <div className="flex-1">
<motion.h1
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
className="text-5xl font-bold mb-4"
>
Manage your money effortlessly.
</motion.h1>
<motion.p
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
className="text-gray-600 mb-6 max-w-xl"
>
Vetri Finance helps you track expenses, set smart budgets,
collaborate with your partner, and stay in control of your finances — all in one app.
</motion.p> <div className="flex gap-4"> <Link
           to="/signup"
           className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition"
         >
Create Account </Link> <Link
           to="/learn-more"
           className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
         >
Learn More </Link> </div> </div>
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1"> <img src={heroImage} alt="Dashboard Preview" className="rounded-2xl shadow-lg w-full object-cover" loading="lazy" />
</motion.div> </div>

```
  {/* Features Section */}
  <div className="mt-20 grid md:grid-cols-3 gap-8">
    <FeatureCard img={iconBudget} title="Smart Budgeting" text="Plan expenses with weekly or monthly budgets and real-time alerts." />
    <FeatureCard img={iconExpense} title="Real-time Tracking" text="Auto-sync UPI & bank transactions for accurate insights." />
    <FeatureCard img={iconChat} title="Partner Chat" text="Communicate, share expenses, and split bills instantly." />
  </div>

  {/* Showcase / Testimonials Carousel */}
  <div className="mt-20">
    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-semibold mb-4">
      What our users say
    </motion.h2>
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3500 }}
      pagination={{ clickable: true }}
      loop
      className="rounded-xl overflow-hidden"
    >
      <SwiperSlide>
        <TestimonialSlide
          img={showcase1}
          name="Alice"
          text="Vetri Finance simplified my budgeting. I finally see where my money goes!"
        />
      </SwiperSlide>
      <SwiperSlide>
        <TestimonialSlide
          img={showcase2}
          name="Bob"
          text="Tracking shared expenses with my partner has never been easier."
        />
      </SwiperSlide>
      <SwiperSlide>
        <TestimonialSlide
          img={showcase3}
          name="Charlie"
          text="The charts and insights help me save smarter every month."
        />
      </SwiperSlide>
    </Swiper>
  </div>

  {/* Pricing Section */}
  <div className="mt-20 grid md:grid-cols-3 gap-8">
    <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-2 transition">
      <div className="font-semibold text-lg mb-2">Free Plan</div>
      <div className="text-gray-500 mb-4">Basic budgeting & expense tracking</div>
      <div className="text-2xl font-bold mb-4">₹0</div>
      <Link to="/signup" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
        Get Started
      </Link>
    </div>
    <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-2 transition">
      <div className="font-semibold text-lg mb-2">Pro Plan</div>
      <div className="text-gray-500 mb-4">Advanced insights & partner features</div>
      <div className="text-2xl font-bold mb-4">₹499/mo</div>
      <Link to="/signup" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
        Get Started
      </Link>
    </div>
    <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-2 transition">
      <div className="font-semibold text-lg mb-2">Enterprise</div>
      <div className="text-gray-500 mb-4">Team & family finance management</div>
      <div className="text-2xl font-bold mb-4">Contact Us</div>
      <Link to="/contact" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
        Contact
      </Link>
    </div>
  </div>

  {/* CTA Section */}
  <div className="mt-20 bg-white border rounded-xl p-8 shadow flex flex-col md:flex-row items-center justify-between gap-6">
    <div>
      <div className="font-semibold text-xl">Start managing your finances today</div>
      <p className="text-gray-500 text-sm">
        Create your account for free — enjoy all features without limitations.
      </p>
    </div>
    <Link to="/get-started" className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
      Get Started
    </Link>
  </div>
</div>

);
}
