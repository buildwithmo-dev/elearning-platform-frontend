import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Categories() {
  const api = "https://elearning-platform-backend-seven.vercel.app/api/courses/categories/";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(api);
        setCategories(res.data);
      } catch {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="w-full px-4 md:px-8 py-14">
      
      {/* HEADER */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Explore Categories
          </h2>
          <p className="text-gray-500 mt-1">
            Discover your next skill path
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-500 py-6">
          {error}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* SKELETON */}
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}

        {/* EMPTY */}
        {!loading && categories.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            No categories available
          </div>
        )}

        {/* CATEGORY CARDS */}
        {!loading &&
          categories.slice(0, 8).map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() =>
                navigate(`/courses?category=${cat.title}`)
              }
              className="group cursor-pointer"
            >
              <div className="
                relative h-38 rounded-2xl
                bg-white
                border border-gray-200
                p-5
                flex flex-col justify-between
                shadow-sm
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:border-black
              ">

                {/* TOP ICON */}
                <div className="
                  w-10 h-10 rounded-lg
                  bg-gray-100
                  flex items-center justify-center
                  group-hover:bg-black
                  transition
                ">
                  <BookOpen
                    size={18}
                    className="text-gray-600 group-hover:text-white transition"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="
  relative z-10
  font-semibold text-gray-800
  group-hover:text-blue-600
  transition
  text-sm md:text-base
  leading-snug
  line-clamp-2
">
  {cat.title}
</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Explore courses →
                  </p>
                </div>

                {/* HOVER BAR */}
                <div className="
                  absolute bottom-0 left-0 h-[2px] w-0
                  bg-black
                  group-hover:w-full
                  transition-all duration-300
                " />

              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
}