import React, { useState, useEffect } from 'react';

const ReviewSkeleton = () => (
  <div className="col-md-4">
    <div className="card h-100 border-0 shadow-sm p-4" aria-hidden="true">
      {/* Stars Skeleton */}
      <div className="placeholder-glow mb-3">
        <span className="placeholder col-5 bg-warning opacity-25"></span>
      </div>
      {/* Text Skeleton */}
      <div className="placeholder-glow mb-4">
        <span className="placeholder col-12 mb-1"></span>
        <span className="placeholder col-10 mb-1"></span>
        <span className="placeholder col-8"></span>
      </div>
      {/* User Skeleton */}
      <div className="d-flex align-items-center mt-auto">
        <div className="placeholder-glow">
          <div className="placeholder rounded-circle" style={{ width: '40px', height: '40px' }}></div>
        </div>
        <div className="ms-3 w-100 placeholder-glow">
          <span className="placeholder col-6 mb-1 d-block"></span>
          <span className="placeholder col-4 d-block"></span>
        </div>
      </div>
    </div>
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch - replace with your axios call
    const fetchReviews = async () => {
      try {
        // const res = await axios.get('/api/reviews');
        // setReviews(res.data);
      } finally {
        // setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Student Success Stories</h2>
          <p className="text-muted">Join 1,000+ satisfied learners</p>
        </div>

        <div className="row g-4">
          {loading ? (
            // Show 3 skeletons while loading
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="text-warning mb-2 small">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                  <p className="text-dark mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    "{rev.comment}"
                  </p>
                  <div className="d-flex align-items-center mt-auto">
                    <img 
                       src={rev.user_avatar || `https://ui-avatars.com/api/?name=${rev.full_name}`} 
                       className="rounded-circle shadow-sm"
                       alt={rev.full_name}
                       style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{rev.full_name}</h6>
                      <small className="text-muted" style={{ fontSize: '0.8rem' }}>Verified Student</small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100 py-4 text-muted">No reviews yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;