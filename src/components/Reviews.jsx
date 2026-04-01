import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

/* ---------- Skeleton ---------- */

const ReviewSkeleton = () => (
  <div className="animate-pulse bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
    <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
    <div className="space-y-2 mb-5">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="space-y-1 w-full">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

/* ---------- Star Rating ---------- */

const Stars = ({ rating }) => (
  <div className="flex gap-1 mb-2">
    {[1,2,3,4,5].map((i) => (
      <Star
        key={i}
        size={14}
        className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

/* ---------- Main Component ---------- */

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // const res = await axios.get('/api/reviews');
        // setReviews(res.data);

        // demo fallback
        setReviews([
          {
            id: 1,
            rating: 5,
            comment: "This platform completely changed my career. The lessons are clear and practical.",
            full_name: "Daniel Mensah",
          },
          {
            id: 2,
            rating: 4,
            comment: "Very structured learning. I landed my first developer job after finishing a course.",
            full_name: "Ama Owusu",
          },
          {
            id: 3,
            rating: 5,
            comment: "Best investment I’ve made in myself. Highly recommend to anyone serious.",
            full_name: "Kwame Asare",
          }
        ]);

      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Student Success Stories
          </h2>
          <p className="text-gray-500 mt-2">
            Join thousands of learners leveling up their careers
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {loading ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews.length > 0 ? (
            reviews.map((rev, i) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="
                  bg-white border border-gray-200
                  rounded-2xl p-5 shadow-sm
                  hover:shadow-md transition
                "
              >

                <Stars rating={rev.rating} />

                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  “{rev.comment}”
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${rev.full_name}`}
                    alt={rev.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {rev.full_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      Verified Student
                    </span>
                  </div>
                </div>

              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-400 col-span-3">
              No reviews yet.
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Reviews;