// src/pages/ResourcePage.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ResourcePage() {
  const { slug } = useParams();

  // If you add more resources later, just add the slug + title here
  const titles = {
    "budget-templates": "Budget Templates",
    "saving-tips": "Saving Tips",
    "expense-tracking": "Expense Tracking",
    "investing-basics": "Investing Basics"
  };

  // If slug isn't in titles → auto-format it nicely
  const autoTitle = (text) =>
    text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const pageTitle = titles[slug] || autoTitle(slug);

  // Check if slug is recognized
  const isKnown = Boolean(titles[slug]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>

      {isKnown ? (
        <>
          <p className="text-gray-600">
            Welcome to the <strong>{pageTitle}</strong> resource page.
          </p>

          <p className="mt-3 text-gray-500">
            You can add detailed content, sections, lists, downloads, or videos
            here later.
          </p>
        </>
      ) : (
        <>
          <div className="text-red-500 font-medium mb-2">
            ⚠ Resource not found
          </div>
          <p className="text-gray-600">
            The page <strong>{slug}</strong> does not exist yet.  
            You can create content for it inside this file.
          </p>
        </>
      )}
    </div>
  );
}
