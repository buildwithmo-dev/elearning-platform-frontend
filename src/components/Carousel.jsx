import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

function Carousel() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_ENDPOINT = "https://elearning-platform-backend-seven.vercel.app//api/resources/slides/";

  const fallback = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600",
      title: "Master the Art of Coding",
      description: "Explore 160+ professional courses.",
      path: "/courses?category=Web%20Development",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1551288049-bbda38a669a6?w=1600",
      title: "Data Science & AI",
      description: "Turn data into insights.",
      path: "/courses?category=Data%20Science",
    },
  ];

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get(API_ENDPOINT);
        setItems(res.data?.length ? res.data : fallback);
      } catch {
        setItems(fallback);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (isHovered || items.length === 0) return;

    let start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress((elapsed / 5000) * 100);

      if (elapsed >= 5000) {
        nextSlide();
        start = Date.now();
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [items, isHovered]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? items.length - 1 : prev - 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  if (!items.length) {
    return <div className="h-[500px] bg-gray-200 animate-pulse rounded-3xl" />;
  }

  return (
    <div
      {...handlers}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* IMAGE */}
          <motion.img
            src={items[current].url}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* CONTENT (NO GLASS) */}
          <div className="absolute bottom-16 left-10 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/80 p-6 rounded-2xl shadow-xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {items[current].title}
              </h1>

              <p className="text-gray-300 mb-6">
                {items[current].description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate(items[current].path || "/courses")
                }
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Start Learning →
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>

      <Arrow direction="left" onClick={prevSlide} />
      <Arrow direction="right" onClick={nextSlide} />
    </div>
  );
}

/* ARROWS */
function Arrow({ direction, onClick }) {
  const isLeft = direction === "left";

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${
        isLeft ? "left-6" : "right-6"
      } bg-black/50 hover:bg-black/70 p-3 rounded-full transition`}
    >
      <span className="text-white text-xl">
        {isLeft ? "‹" : "›"}
      </span>
    </motion.button>
  );
}

export default Carousel;