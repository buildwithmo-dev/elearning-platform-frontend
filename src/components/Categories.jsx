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
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="row">
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && categories.length === 0 && (
        <p>No categories found.</p>
      )}

      {!loading && categories.length > 0 && categories.slice(0,8).map((cat) => (
        <div key={cat.id} className="col-sm-3 mb-3">
          <div 
            className="card shadow-sm p-3"
            style={{
              minHeight: '80px',
              borderRadius: '10px',
            }}
          >
            <p className="card-subtitle text-center text-muted" style={{ fontSize: '15px' }}>
              {cat.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
