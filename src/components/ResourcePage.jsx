import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";

export default function ResourcePage() {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await API.get(`/resources/${slug}`);
        setResource(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load resource. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  if (loading) return <div className="p-6 text-gray-500">Loading resource...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{resource.title}</h1>
      <p className="text-gray-700">{resource.content}</p>
    </div>
  );
}
