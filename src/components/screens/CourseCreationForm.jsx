import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

// API Endpoints (Adjust if necessary)
const CREATE_COURSE_API = 'http://127.0.0.1:8000/api/courses/create/';
const CATEGORIES_API = 'http://127.0.0.1:8000/api/courses/categories/';

export default function CourseCreationForm() {
    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState(0);

    // State for categories dropdown
    const [categories, setCategories] = useState([]);
    
    // State for API interaction
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Context for getting the current instructor's ID and token (if needed)
    const { userProfile } = useAuth(); 

    // --- EFFECT: Fetch Categories for Dropdown ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(CATEGORIES_API);
                if (res.data && res.data.length > 0) {
                    setCategories(res.data);
                    // Set the default category to the first one available
                    setCategory(res.data[0].id); 
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                // Set a placeholder category if fetching fails
                setCategories([{ id: 'default', title: 'Default Category' }]);
                setCategory('default');
            }
        };

        fetchCategories();
    }, []);
    
    // --- HANDLER: Course Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title || !description || !category || price < 0) {
            setError('Please fill out all required fields and ensure the price is non-negative.');
            return;
        }

        // The course will be linked to the current user (instructor)
        const instructorId = userProfile?.id;
        if (!instructorId) {
            setError('Instructor profile is not available. Please log in again.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');
        
        try {
            const courseData = {
                title,
                description,
                category_id: category, // Send the ID of the selected category
                price: parseFloat(price),
                instructor_id: instructorId,
                // Assuming your API handles created_at, updated_at, and is_published status
            };
            
            // NOTE: You may need to add an Authorization header (e.g., JWT) 
            // if your API requires authentication for course creation.
            const response = await axios.post(CREATE_COURSE_API, courseData);
            
            setSuccessMessage(`Course "${response.data.title}" created successfully!`);
            
            // Reset form fields
            setTitle('');
            setDescription('');
            setPrice(0);
            setCategory(categories[0]?.id || ''); // Reset to the first category
            
        } catch (err) {
            console.error("Course creation failed:", err);
            setError(err.response?.data?.message || 'Failed to create course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 shadow-sm w-100">
            <h3 className="card-title text-primary mb-4">Create New Course</h3>
            
            {/* Display Messages */}
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Course Title */}
                <div className="mb-3">
                    <label htmlFor="courseTitle" className="form-label">Course Title <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        id="courseTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Course Description */}
                <div className="mb-3">
                    <label htmlFor="courseDescription" className="form-label">Description <span className="text-danger">*</span></label>
                    <textarea
                        className="form-control"
                        id="courseDescription"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                {/* Category Dropdown */}
                <div className="mb-3">
                    <label htmlFor="courseCategory" className="form-label">Category <span className="text-danger">*</span></label>
                    {categories.length > 0 ? (
                        <select
                            className="form-select"
                            id="courseCategory"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            disabled={loading}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="text-muted">Loading categories...</p>
                    )}
                </div>

                {/* Course Price */}
                <div className="mb-4">
                    <label htmlFor="coursePrice" className="form-label">Price (USD)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="coursePrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                    <small className="form-text text-muted">Set to 0 for a free course.</small>
                </div>
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Submit Course for Review'}
                </button>
            </form>
        </div>
    );
}