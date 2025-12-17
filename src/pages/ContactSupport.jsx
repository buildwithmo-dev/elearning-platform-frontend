import React, { useState } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { Mail, MessageSquare, Send, CheckCircle, LifeBuoy } from 'lucide-react';

export default function ContactSupport() {
    const [formData, setFormData] = useState({ subject: '', message: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const { error } = await supabase
            .from('support_tickets')
            .insert([formData]);

        if (!error) setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
                <div className="card border-0 shadow-sm p-5 rounded-4 d-inline-block" style={{ maxWidth: '500px' }}>
                    <CheckCircle size={60} className="text-success mb-4" />
                    <h2 className="fw-bold">Message Sent!</h2>
                    <p className="text-muted">Thank you for reaching out. Our support team will get back to you at <strong>{formData.email}</strong> within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn btn-primary rounded-pill px-4 mt-3">Send another message</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ marginTop: '80px' }}>
            <div className="text-center mb-5">
                <LifeBuoy size={48} className="text-primary mb-3" />
                <h2 className="fw-bold">How can we help?</h2>
                <p className="text-muted">Have a question or facing an issue? We're here to support your learning journey.</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="row g-0">
                            {/* Left Side: Contact Info */}
                            <div className="col-md-4 bg-primary text-white p-4 p-lg-5">
                                <h5 className="fw-bold mb-4">Contact Information</h5>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <Mail size={20} className="opacity-75" />
                                    <span className="small">support@yourplatform.com</span>
                                </div>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <MessageSquare size={20} className="opacity-75" />
                                    <span className="small">Live Chat (Mon-Fri)</span>
                                </div>
                                <hr className="opacity-25 my-4" />
                                <p className="small opacity-75">Our dedicated support team is available 9am - 6pm GMT.</p>
                            </div>

                            {/* Right Side: Form */}
                            <div className="col-md-8 p-4 p-lg-5 bg-white">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">YOUR EMAIL</label>
                                        <input 
                                            type="email" 
                                            className="form-control bg-light border-0 py-3" 
                                            placeholder="name@example.com"
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">SUBJECT</label>
                                        <select 
                                            className="form-select bg-light border-0 py-3"
                                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                            required
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="Billing">Billing Issue</option>
                                            <option value="Course Access">Course Access</option>
                                            <option value="Instructor Help">Instructor Tools</option>
                                            <option value="Technical Bug">Technical Bug</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">MESSAGE</label>
                                        <textarea 
                                            className="form-control bg-light border-0" 
                                            rows="5" 
                                            placeholder="Tell us more about your issue..."
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                        {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}