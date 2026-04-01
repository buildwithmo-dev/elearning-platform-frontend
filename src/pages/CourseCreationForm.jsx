import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/AuthContext";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const CREATE_COURSE_API = "https://elearning-platform-backend-seven.vercel.app//api/courses/create/";
const CATEGORIES_API = "https://elearning-platform-backend-seven.vercel.app//api/courses/categories/";

export default function CourseCreationForm() {
  const { userProfile } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORIES_API);
        setCategories(res.data);
        setCategory(res.data[0]?.id || "");
      } catch {
        setCategories([{ id: "default", title: "General" }]);
        setCategory("default");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(CREATE_COURSE_API, {
        title,
        description,
        category_id: category,
        price: parseFloat(price),
        instructor_id: userProfile?.id,
      });

      setSuccess(`"${res.data.title}" created successfully`);

      setTitle("");
      setDescription("");
      setPrice(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Create New Course
        </h2>
        <p className="text-gray-500 text-sm">
          Build and publish your next learning experience
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">

        {/* ALERTS */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master React Like a Pro"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn?"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition resize-none"
            />
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-400 mt-1">
                Set 0 for free course
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating..." : "Publish Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}