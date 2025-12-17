import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import InstructorSettingsForm from '../components/InstructorSettingsForm'; 
import { 
    LayoutDashboard, BookOpen, Users, DollarSign, Settings, 
    PlusCircle, BarChart3, ChevronLeft, ChevronRight, GripVertical, 
    Trash2, Code, Video, FileText, Target, Award, PieChart
} from 'lucide-react';

const DRAFT_KEY = "course_create_draft";

export default function InstructorsPage() {
    const { userProfile, loading } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [step, setStep] = useState(0);

    // ================== COURSE BUILDER STATE ==================
    const [form, setForm] = useState(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        return saved ? JSON.parse(saved) : {
            title: "", description: "", price_amount: "", price_currency: "USD",
            modules: [{ title: "", lessons: [] }]
        };
    });

    useEffect(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, [form]);

    // ================== BUILDER HELPERS ==================
    const addModule = () => setForm((p) => ({ ...p, modules: [...p.modules, { title: "", lessons: [] }] }));
    const addLesson = (mi) => setForm((p) => ({
        ...p,
        modules: p.modules.map((m, i) => i === mi ? {
            ...m,
            lessons: [...m.lessons, { title: "", content_type: "video", content_url: "" }]
        } : m)
    }));

    if (loading) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
                <div className="spinner-grow text-primary" role="status"></div>
            </div>
        );
    }

    if (!userProfile || !userProfile.is_instructor) {
        return (
            <div className="container vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center p-5 bg-white rounded-4 shadow-sm border" style={{ maxWidth: '400px' }}>
                    <div className="text-danger mb-3 fw-bold fs-1">!</div>
                    <h3 className="fw-bold">Instructor Access Only</h3>
                    <p className="text-muted">This area is reserved for course creators.</p>
                    <Link to="/auth" className="btn btn-primary rounded-pill px-4">Login to Access</Link>
                </div>
            </div>
        );
    }

    // ================== MAIN CONTENT RENDERER ==================
    const renderMainContent = () => {
        switch (activeView) {
            case 'settings':
                return <InstructorSettingsForm />;
            
            case 'create':
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">Course Builder</h4>
                            <div className="d-flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className={`rounded-pill ${step === i ? 'bg-primary' : 'bg-light'}`} style={{width: '40px', height: '6px', transition: '0.3s'}}></div>
                                ))}
                            </div>
                        </div>

                        {/* STEP 0: BASIC INFO */}
                        {step === 0 && (
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">COURSE TITLE</label>
                                    <input className="form-control bg-light border-0 py-3 rounded-3" placeholder="e.g. Master Clean Code in Python" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">DESCRIPTION</label>
                                    <textarea className="form-control bg-light border-0 rounded-3" rows="5" placeholder="Describe what students will achieve..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted">PRICE (USD)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><DollarSign size={16}/></span>
                                        <input type="number" className="form-control bg-light border-0" value={form.price_amount} onChange={(e) => setForm({ ...form, price_amount: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: MODULES */}
                        {step === 1 && (
                            <div className="modules-list">
                                {form.modules.map((m, i) => (
                                    <div key={i} className="card border-0 bg-light mb-3 p-3 rounded-3 shadow-sm d-flex flex-row align-items-center gap-3">
                                        <GripVertical size={20} className="text-muted" />
                                        <input className="form-control border-0 bg-transparent fw-bold" placeholder={`Module ${i+1} Title`} value={m.title} onChange={(e) => {
                                            const mods = [...form.modules]; mods[i].title = e.target.value; setForm({ ...form, modules: mods });
                                        }} />
                                        <button className="btn text-danger" onClick={() => setForm({...form, modules: form.modules.filter((_, idx) => idx !== i)})}><Trash2 size={18}/></button>
                                    </div>
                                ))}
                                <button className="btn btn-outline-primary w-100 border-dashed py-3 mt-2 rounded-3" onClick={addModule}>+ Add New Module</button>
                            </div>
                        )}

                        {/* STEP 2: LESSONS */}
                        {step === 2 && (
                            <div className="lessons-list">
                                {form.modules.map((m, mi) => (
                                    <div key={mi} className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="bg-primary text-white rounded-circle p-1 px-2 small">{mi + 1}</div>
                                            <h6 className="fw-bold mb-0 text-dark">{m.title || 'Untitled Module'}</h6>
                                        </div>
                                        {m.lessons.map((l, li) => (
                                            <div key={li} className="card border-0 shadow-sm mb-3 p-3 rounded-4 bg-white border-start border-primary border-4">
                                                <input className="form-control form-control-sm border-0 bg-light mb-2 fw-semibold" placeholder="Lesson Name" value={l.title} onChange={(e) => {
                                                    const mods = [...form.modules]; mods[mi].lessons[li].title = e.target.value; setForm({ ...form, modules: mods });
                                                }} />
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text bg-light border-0"><Video size={14}/></span>
                                                    <input className="form-control border-0 bg-light" placeholder="Video / Resource URL" value={l.content_url} onChange={(e) => {
                                                        const mods = [...form.modules]; mods[mi].lessons[li].content_url = e.target.value; setForm({ ...form, modules: mods });
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn btn-sm btn-outline-secondary w-100 rounded-pill" onClick={() => addLesson(mi)}>+ Add Lesson to {m.title || 'Module'}</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                            <button className="btn btn-light px-4 rounded-pill fw-bold" disabled={step === 0} onClick={() => setStep(step - 1)}>
                                <ChevronLeft size={18}/> Back
                            </button>
                            {step < 2 ? (
                                <button className="btn btn-primary px-4 rounded-pill fw-bold" onClick={() => setStep(step + 1)}>
                                    Next Step <ChevronRight size={18}/>
                                </button>
                            ) : (
                                <button className="btn btn-success px-5 rounded-pill fw-bold shadow-sm">Launch Course</button>
                            )}
                        </div>
                    </div>
                );

            case 'dashboard':
            default:
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="fw-bold mb-1">Instructor Dashboard</h2>
                                <p className="text-muted small">Overview of your content, revenue, and student reach.</p>
                            </div>
                            <button onClick={() => setActiveView('create')} className="btn btn-primary d-flex align-items-center gap-2 rounded-3 shadow-sm px-4 py-2">
                                <PlusCircle size={18} /> Create Course
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-primary text-white rounded-4 overflow-hidden position-relative">
                                    <div className="position-relative z-index-1">
                                        <p className="small opacity-75 mb-1 text-uppercase fw-bold">Active Courses</p>
                                        <h2 className="fw-bold mb-0">12</h2>
                                    </div>
                                    <BookOpen size={80} className="position-absolute end-0 bottom-0 opacity-10 mb-n3 me-n2" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 border-start border-success border-5">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="small text-muted mb-1 text-uppercase fw-bold">Total Students</p>
                                            <h2 className="fw-bold mb-0 text-dark">842</h2>
                                        </div>
                                        <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                                            <Users size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 border-start border-warning border-5">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="small text-muted mb-1 text-uppercase fw-bold">Revenue</p>
                                            <h2 className="fw-bold mb-0 text-dark">$2,450</h2>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                                            <DollarSign size={24} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row Info */}
                        <div className="row g-4 mb-4">
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                                    <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                        <BarChart3 size={18} className="text-primary" /> Enrollment Trends (Last 30 Days)
                                    </h6>
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center border" style={{ height: '240px' }}>
                                        <div className="text-center">
                                            <PieChart size={40} className="text-muted mb-2 opacity-50" />
                                            <p className="text-muted small mb-0">Analytics Visualization Placeholder</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-dark text-white">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <Target size={18} className="text-primary" /> Monthly Goals
                                    </h6>
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>Student Target</span>
                                            <span>75%</span>
                                        </div>
                                        <div className="progress bg-secondary" style={{height: '6px'}}>
                                            <div className="progress-bar bg-primary w-75 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>Revenue Target</span>
                                            <span>40%</span>
                                        </div>
                                        <div className="progress bg-secondary" style={{height: '6px'}}>
                                            <div className="progress-bar bg-warning w-40 rounded"></div>
                                        </div>
                                    </div>
                                    <hr className="opacity-25" />
                                    <div className="d-flex align-items-center gap-2 mt-auto">
                                        <Award size={20} className="text-warning" />
                                        <span className="small">Top 10% Instructor this month!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-4 px-lg-5" style={{ marginTop: '60px' }}>
            <div className="row g-4">
                {/* Sidebar Navigation */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
                        <div className="card-body p-4">
                            <div className="text-center mb-4 pb-3 border-bottom">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>
                                    {userProfile.full_name?.charAt(0)}
                                </div>
                                <h6 className="fw-bold mb-0">Hi, {userProfile.full_name.split(' ')[0]}!</h6>
                                <span className="badge bg-success bg-opacity-10 text-success small mt-1">Instructor Portal</span>
                            </div>

                            <div className="nav flex-column nav-pills gap-2">
                                <button 
                                    onClick={() => setActiveView('dashboard')}
                                    className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'dashboard' ? 'active shadow-sm' : 'text-muted'}`}
                                >
                                    <LayoutDashboard size={20} /> Dashboard
                                </button>
                                <button 
                                    onClick={() => setActiveView('create')}
                                    className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'create' ? 'active shadow-sm' : 'text-muted'}`}
                                >
                                    <PlusCircle size={20} /> Create Course
                                </button>
                                <button className="nav-link text-muted border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3">
                                    <BookOpen size={20} /> My Courses
                                </button>
                                <button className="nav-link text-muted border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 border-bottom pb-4 mb-2">
                                    <Users size={20} /> Students
                                </button>
                                <button 
                                    onClick={() => setActiveView('settings')}
                                    className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'settings' ? 'active shadow-sm' : 'text-muted'}`}
                                >
                                    <Settings size={20} /> Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-lg-9">
                    <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-75 bg-white">
                        {renderMainContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}