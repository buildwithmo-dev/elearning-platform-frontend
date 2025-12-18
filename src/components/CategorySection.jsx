import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ChevronRight, 
    Layers, 
    Code, 
    Cpu, 
    Database, 
    Globe, 
    Smartphone, 
    Palette, 
    ShieldCheck 
} from 'lucide-react';

export default function CategorySection() {
    const navigate = useNavigate();
    const api = "http://127.0.0.1:8000/api/courses/category-section";

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                // Standard GET request - no auth headers needed for public browsing
                const res = await axios.get(api);
                setCategories(res.data);
            } catch (err) {
                setError("Could not load categories.");
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, []);

    /**
     * Maps icons to your specific database categories.
     * Handles potential leading/trailing spaces from older data entries.
     */
    const getCategoryIcon = (title) => {
        const t = title.toLowerCase().trim();
        if (t.includes('web')) return <Code size={32} />;
        if (t.includes('data science') || t.includes('ai') || t.includes('ml')) return <Cpu size={32} />;
        if (t.includes('data analysis')) return <Database size={32} />;
        if (t.includes('cyber')) return <ShieldCheck size={32} />;
        if (t.includes('cloud')) return <Globe size={32} />;
        if (t.includes('mobile')) return <Smartphone size={32} />;
        if (t.includes('ui') || t.includes('ux')) return <Palette size={32} />;
        return <Layers size={32} />;
    };

    return (
        <section className='py-5 bg-light' style={{ minHeight: '400px' }}>
            <div className='container py-4'>
                {/* --- Header Section --- */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-7">
                        <span className="badge px-3 py-2 rounded-pill mb-2" style={{ backgroundColor: '#e7f0ff', color: '#0d6efd' }}>
                            Explore Industries
                        </span>
                        <h2 className="fw-bold display-6">What do you want to learn?</h2>
                        <p className="text-muted fs-5">Choose from our top categories and start your journey.</p>
                    </div>
                    <div className="col-md-5 text-md-end">
                        <button 
                            className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                            onClick={() => navigate('/courses')}
                        >
                            Browse All Courses <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* --- Categories Grid --- */}
                <div className="row g-4">
                    {loading ? (
                        // Skeleton Loaders
                        [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="col-6 col-md-3">
                                <div className="card border-0 shadow-sm p-4 text-center animate-pulse" style={{ height: '180px', borderRadius: '20px' }}>
                                    <div className="placeholder-glow">
                                        <div className="rounded-circle bg-light mx-auto mb-3" style={{ width: '60px', height: '60px' }}></div>
                                        <div className="placeholder col-8 rounded mb-2" style={{ height: '15px' }}></div>
                                        <div className="placeholder col-5 rounded" style={{ height: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-12 text-center py-5">
                            <div className="alert alert-danger d-inline-block px-5 shadow-sm rounded-4">{error}</div>
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <div 
                                key={cat.id} 
                                className="col-6 col-md-3"
                                // Navigation uses encoded title for clean, readable URLs
                                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.title.trim())}`)}
                            >
                                <div className="card h-100 border-0 shadow-sm category-card text-center p-4">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <div className="icon-wrapper mb-3 text-primary transition-all">
                                            {getCategoryIcon(cat.title)}
                                        </div>
                                        <h5 className="fw-bold mb-1 card-title-text text-dark">
                                            {cat.title}
                                        </h5>
                                        {/* Display real course count from your updated backend */}
                                        <p className="text-muted small mb-0">
                                            {cat.course_count || 0} {cat.course_count === 1 ? 'Course' : 'Courses'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <style>{`
                .category-card {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    cursor: pointer;
                    border-radius: 20px;
                    background-color: white;
                }
                .category-card:hover {
                    transform: translateY(-12px);
                    background-color: #0d6efd !important;
                    box-shadow: 0 15px 30px rgba(13, 110, 253, 0.2) !important;
                }
                .category-card:hover .card-title-text,
                .category-card:hover .text-muted,
                .category-card:hover .icon-wrapper {
                    color: white !important;
                }
                .icon-wrapper {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .category-card:hover .icon-wrapper {
                    background: rgba(255, 255, 255, 0.2);
                }
                .animate-pulse {
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </section>
    );
}