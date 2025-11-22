// src/components/ResourcePage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const RESOURCES = {
  budgeting: {
    title: "Budgeting Tips",
    description:
      "Learn how to manage your expenses, track spending, and create sustainable monthly budgets.",
    links: [
      { label: "50/30/20 Rule Explained", href: "https://example.com/503020" },
      { label: "How to Track Expenses", href: "https://example.com/track" },
    ],
  },
  saving: {
    title: "Saving Money",
    description:
      "Simple savings strategies to build financial security and reach future goals.",
    links: [
      { label: "Beginner Savings Guide", href: "https://example.com/saving" },
      { label: "High-yield Savings Accounts", href: "https://example.com/hysa" },
    ],
  },
  debt: {
    title: "Debt Management",
    description:
      "Reduce and manage debt through proven methods like the avalanche or snowball method.",
    links: [
      { label: "Snowball vs. Avalanche Method", href: "https://example.com/debt" },
    ],
  },
};

export default function ResourcePage() {
  const { slug } = useParams();

  // Normalize slug ("/resource/budgeting-tips" → "budgeting")
  const key = slug?.toLowerCase().trim();

  const resource = RESOURCES[key];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {resource ? (
        <>
          <h1 className="text-3xl font-bold mb-3">{resource.title}</h1>
          <p className="text-gray-700 mb-4">{resource.description}</p>

          <div className="space-y-2">
            {resource.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border rounded-lg hover:bg-gray-50 text-blue-600 font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          <Link
            to="/resources"
            className="text-orange-600 font-semibold inline-block mt-6 hover:underline"
          >
            ← Back to Resources
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600">Resource not found</h1>
          <p className="text-gray-600 mt-2">
            We couldn’t find any content for "<strong>{slug}</strong>".
          </p>
          <Link
            to="/resources"
            className="text-blue-600 font-semibold inline-block mt-4 hover:underline"
          >
            Back to Resources
          </Link>
        </>
      )}
    </div>
  );
}
