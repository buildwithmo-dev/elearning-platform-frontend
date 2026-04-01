import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
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
                const res = await axios.get(api);
                setCategories(res.data);
            } catch (err) {
                setError("Could not load categories.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, []);

    const getCategoryIcon = (title) => {
        const t = title.toLowerCase().trim();
        if (t.includes('web')) return <Code size={28} />;
        if (t.includes('data science') || t.includes('ai') || t.includes('ml')) return <Cpu size={28} />;
        if (t.includes('analysis')) return <Database size={28} />;
        if (t.includes('cyber')) return <ShieldCheck size={28} />;
        if (t.includes('cloud')) return <Globe size={28} />;
        if (t.includes('mobile')) return <Smartphone size={28} />;
        if (t.includes('ui') || t.includes('ux')) return <Palette size={28} />;
        return <Layers size={28} />;
    };

    return (
        <section className="w-full py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-2">
                            Explore Industries
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            What do you want to learn?
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Choose from top categories and start your journey
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/courses')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-md transition hover:scale-105 active:scale-95"
                    >
                        Browse All <ChevronRight size={18} />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {/* Skeleton */}
                    {loading &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-44 rounded-3xl bg-gray-200 animate-pulse"
                            />
                        ))
                    }

                    {/* Error */}
                    {error && (
                        <div className="col-span-full text-center text-red-500 py-6">
                            {error}
                        </div>
                    )}

                    {/* Cards */}
                    {!loading && !error &&
                        categories.map((cat, index) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.title.trim())}`)}
                                className="group cursor-pointer"
                            >
                                <div className="
                                    relative h-44 rounded-3xl
                                    bg-white border border-gray-200
                                    shadow-sm
                                    flex flex-col items-center justify-center
                                    text-center px-4
                                    transition-all duration-300
                                    hover:-translate-y-2
                                    hover:shadow-2xl
                                    hover:bg-blue-600
                                ">

                                    {/* Glow overlay */}
                                    <div className="
                                        absolute inset-0 rounded-3xl
                                        opacity-0 group-hover:opacity-100
                                        bg-gradient-to-r from-blue-500/20 to-indigo-500/20
                                        transition
                                    " />

                                    {/* Icon */}
                                    <div className="
                                        relative z-10 mb-3
                                        p-4 rounded-xl
                                        bg-gray-100
                                        group-hover:bg-white/20
                                        transition
                                    ">
                                        <div className="text-blue-600 group-hover:text-white">
                                            {getCategoryIcon(cat.title)}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="
                                        relative z-10 font-semibold text-gray-800
                                        group-hover:text-white transition
                                    ">
                                        {cat.title}
                                    </h3>

                                    {/* Count */}
                                    <p className="
                                        relative z-10 text-sm text-gray-500
                                        group-hover:text-blue-100 transition
                                    ">
                                        {cat.course_count || 0} {cat.course_count === 1 ? 'Course' : 'Courses'}
                                    </p>

                                </div>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}