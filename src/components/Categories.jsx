import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Categories() {
  const api = "http://127.0.0.1:8000/api/courses/categories/";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(api);
        setCategories(res.data);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container py-4">
      <div className="row g-3"> {/* g-3 adds consistent gutter spacing */}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center w-100 py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="col-12">
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center w-100 text-muted">
            <p>No categories available at the moment.</p>
          </div>
        )}

        {/* Data Grid */}
        {!loading && categories.slice(0, 8).map((cat) => (
          <div key={cat.id} className="col-6 col-md-4 col-lg-3">
            <div 
              className="card h-100 shadow-sm border-0 category-card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                borderRadius: '12px',
                minHeight: '100px'
              }}
              // Simple hover effect via inline JS if you aren't using a separate CSS file
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.shadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center p-3">
                <h6 className="card-title text-center mb-0 fw-bold text-dark">
                  {cat.title}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}