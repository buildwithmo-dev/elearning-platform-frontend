import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext'; 
import { supabase } from '../services/supabase/supabaseClient';

export default function InstructorSettingsForm() {
    // Get profile data and setter from the context
    const { userProfile, setUserProfile } = useAuth();

    // Local state for form inputs
    const [fullName, setFullName] = useState('');
    const [isInstructor, setIsInstructor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Load initial data from context when component mounts or userProfile updates
    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.full_name || '');
            // We use the initial value but typically lock this field
            setIsInstructor(userProfile.is_instructor || false); 
        }
    }, [userProfile]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!userProfile) return;

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const updates = {
                id: userProfile.id,
                full_name: fullName,
                updated_at: new Date(),
            };

            // 1. Update the 'profiles' table in Supabase
            // We only update the full_name here.
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: updates.full_name, updated_at: updates.updated_at })
                .eq('id', userProfile.id);

            if (updateError) throw updateError;

            // 2. Update the global context state with the new full name
            setUserProfile(prevProfile => ({
                ...prevProfile,
                full_name: fullName,
            }));

            setMessage('Profile updated successfully!');

        } catch (updateError) {
            setError(`Error updating profile: ${updateError.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 shadow-sm">
            <h3>Profile Settings</h3>
            <p className="text-muted">Update your public name below.</p>
            
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleUpdate}>
                {/* Full Name Field */}
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                {/* Instructor Status Display (Read-only) */}
                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isInstructorCheck"
                        checked={isInstructor}
                        readOnly 
                        disabled
                    />
                    <label className="form-check-label" htmlFor="isInstructorCheck">
                        Registered as Instructor
                    </label>
                    {isInstructor && <small className="d-block text-success"> (Status is active and cannot be changed here)</small>}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
}