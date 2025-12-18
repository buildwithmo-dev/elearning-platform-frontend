import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import InstructorSettingsForm from '../components/InstructorSettingsForm'; 
import { 
    LayoutDashboard, BookOpen, Users, DollarSign, Settings, 
    PlusCircle, BarChart3, ChevronLeft, ChevronRight, GripVertical, 
    Trash2, Code, Video, Target, Award, Mail
} from 'lucide-react';

const DRAFT_KEY = "course_create_draft";

export default function InstructorsPage() {
    const { userProfile, loading } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [step, setStep] = useState(0);

    // ================== DATA FETCHING STATE ==================
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

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

    // Simulate Backend Fetch whenever view changes
    useEffect(() => {
        if (['dashboard', 'courses', 'students'].includes(activeView)) {
            loadMockData();
        }
    }, [activeView]);

    const loadMockData = () => {
        setIsDataLoading(true);
        setTimeout(() => {
            setCourses([
                { id: 1, title: "Mastering React Hooks", studentCount: 154, revenue: 4500, status: "Published" },
                { id: 2, title: "UI Design Fundamentals", studentCount: 89, revenue: 1200, status: "Published" },
                { id: 3, title: "Advanced Node.js", studentCount: 0, revenue: 0, status: "Draft" },
            ]);
            setStudents([
                { id: 1, name: "Alex Rivera", email: "alex@example.com", progress: 85, course: "React Hooks" },
                { id: 2, name: "Sarah Chen", email: "sarah@example.com", progress: 40, course: "UI Design" },
                { id: 3, name: "Jordan Smith", email: "j@example.com", progress: 12, course: "React Hooks" },
                { id: 4, name: "Emma Wilson", email: "emma@example.com", progress: 100, course: "UI Design" },
            ]);
            setIsDataLoading(false);
        }, 800);
    };

    // ================== BUILDER HELPERS ==================
    const addModule = () => setForm((p) => ({ ...p, modules: [...p.modules, { title: "", lessons: [] }] }));
    const addLesson = (mi) => setForm((p) => ({
        ...p,
        modules: p.modules.map((m, i) => i === mi ? {
            ...m,
            lessons: [...m.lessons, { title: "", content_type: "video", content_url: "" }]
        } : m)
    }));

    // ================== SKELETON RENDERERS ==================
    
    const renderDashboardSkeleton = () => (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div className="skeleton rounded-pill mb-2" style={{width: '250px', height: '32px'}}></div>
                    <div className="skeleton rounded-pill" style={{width: '180px', height: '16px'}}></div>
                </div>
                <div className="skeleton rounded-3" style={{width: '140px', height: '45px'}}></div>
            </div>
            <div className="row g-4 mb-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border">
                            <div className="skeleton rounded-pill mb-3" style={{width: '100px', height: '12px'}}></div>
                            <div className="skeleton rounded-pill" style={{width: '60px', height: '32px'}}></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row g-4">
                <div className="col-lg-8"><div className="skeleton rounded-4 w-100" style={{height: '300px'}}></div></div>
                <div className="col-lg-4"><div className="skeleton rounded-4 w-100 bg-dark opacity-10" style={{height: '300px'}}></div></div>
            </div>
        </div>
    );

    const renderCoursesSkeleton = () => (
        <div className="animate-fade-in">
            <div className="skeleton rounded-pill mb-4" style={{width: '200px', height: '30px'}}></div>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="d-flex align-items-center gap-3 p-3 border-bottom">
                    <div className="skeleton rounded-3" style={{width: '48px', height: '48px'}}></div>
                    <div className="flex-grow-1">
                        <div className="skeleton rounded-pill mb-2" style={{width: '40%', height: '14px'}}></div>
                        <div className="skeleton rounded-pill" style={{width: '20%', height: '10px'}}></div>
                    </div>
                    <div className="skeleton rounded-pill" style={{width: '60px', height: '20px'}}></div>
                </div>
            ))}
        </div>
    );

    const renderStudentsSkeleton = () => (
        <div className="row g-3 animate-fade-in">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="col-md-6">
                    <div className="card border-0 bg-light p-3 rounded-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="skeleton rounded-circle" style={{width: '50px', height: '50px'}}></div>
                            <div className="flex-grow-1">
                                <div className="skeleton rounded-pill mb-2" style={{width: '120px', height: '14px'}}></div>
                                <div className="skeleton rounded-pill" style={{width: '80px', height: '10px'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // ================== VIEW RENDERERS ==================

    const renderMyCourses = () => (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">My Courses</h4>
                <button onClick={() => setActiveView('create')} className="btn btn-sm btn-primary rounded-pill px-3">+ New Course</button>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead>
                        <tr className="text-muted small uppercase">
                            <th className="border-0">Course</th>
                            <th className="border-0">Students</th>
                            <th className="border-0">Revenue</th>
                            <th className="border-0">Status</th>
                            <th className="border-0 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-light p-2 rounded text-primary"><Code size={20}/></div>
                                        <span className="fw-bold">{course.title}</span>
                                    </div>
                                </td>
                                <td>{course.studentCount}</td>
                                <td>${course.revenue}</td>
                                <td>
                                    <span className={`badge rounded-pill ${course.status === 'Published' ? 'bg-success' : 'bg-warning'} bg-opacity-10 ${course.status === 'Published' ? 'text-success' : 'text-warning'}`}>
                                        {course.status}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-link text-muted p-0"><Settings size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderStudents = () => (
        <div className="animate-fade-in">
            <h4 className="fw-bold mb-4">Student Community</h4>
            <div className="row g-3">
                {students.map(s => (
                    <div key={s.id} className="col-md-6">
                        <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '50px', height: '50px'}}>
                                    {s.name.charAt(0)}
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-0">{s.name}</h6>
                                    <p className="text-muted small mb-0">{s.email}</p>
                                </div>
                                <button className="btn btn-light btn-sm rounded-circle"><Mail size={16}/></button>
                            </div>
                            <div className="mt-3">
                                <div className="d-flex justify-content-between small mb-1">
                                    <span className="text-muted">{s.course}</span>
                                    <span className="fw-bold">{s.progress}%</span>
                                </div>
                                <div className="progress" style={{height: '6px'}}>
                                    <div className="progress-bar bg-success" style={{width: `${s.progress}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ================== MAIN CONTENT LOGIC ==================

    const renderMainContent = () => {
        if (isDataLoading && ['dashboard', 'courses', 'students'].includes(activeView)) {
            if (activeView === 'dashboard') return renderDashboardSkeleton();
            if (activeView === 'courses') return renderCoursesSkeleton();
            if (activeView === 'students') return renderStudentsSkeleton();
        }

        switch (activeView) {
            case 'settings': return <InstructorSettingsForm />;
            case 'courses': return renderMyCourses();
            case 'students': return renderStudents();
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
                        {step === 0 && (
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">COURSE TITLE</label>
                                    <input className="form-control bg-light border-0 py-3 rounded-3" placeholder="e.g. Master Clean Code" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted">DESCRIPTION</label>
                                    <textarea className="form-control bg-light border-0 rounded-3" rows="5" placeholder="What will students learn?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                        {step === 2 && (
                            <div className="lessons-list">
                                {form.modules.map((m, mi) => (
                                    <div key={mi} className="mb-4">
                                        <h6 className="fw-bold mb-3">{m.title || 'Untitled Module'}</h6>
                                        {m.lessons.map((l, li) => (
                                            <div key={li} className="card border-0 shadow-sm mb-3 p-3 rounded-4 bg-white border-start border-primary border-4">
                                                <input className="form-control form-control-sm border-0 bg-light mb-2 fw-semibold" placeholder="Lesson Name" value={l.title} onChange={(e) => {
                                                    const mods = [...form.modules]; mods[mi].lessons[li].title = e.target.value; setForm({ ...form, modules: mods });
                                                }} />
                                                <input className="form-control form-control-sm border-0 bg-light" placeholder="Video URL" value={l.content_url} onChange={(e) => {
                                                    const mods = [...form.modules]; mods[mi].lessons[li].content_url = e.target.value; setForm({ ...form, modules: mods });
                                                }} />
                                            </div>
                                        ))}
                                        <button className="btn btn-sm btn-outline-secondary w-100 rounded-pill" onClick={() => addLesson(mi)}>+ Add Lesson</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                            <button className="btn btn-light px-4 rounded-pill fw-bold" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
                            {step < 2 ? (
                                <button className="btn btn-primary px-4 rounded-pill fw-bold" onClick={() => setStep(step + 1)}>Next Step</button>
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
                                <p className="text-muted small">Overview of your performance.</p>
                            </div>
                            <button onClick={() => setActiveView('create')} className="btn btn-primary rounded-3 shadow-sm px-4 py-2">
                                <PlusCircle size={18} className="me-2" /> Create Course
                            </button>
                        </div>
                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-primary text-white rounded-4">
                                    <p className="small opacity-75 mb-1 fw-bold">Active Courses</p>
                                    <h2 className="fw-bold mb-0">{courses.length}</h2>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 border-start border-success border-5">
                                    <p className="small text-muted mb-1 fw-bold">Total Students</p>
                                    <h2 className="fw-bold mb-0 text-dark">842</h2>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4 bg-white rounded-4 border-start border-warning border-5">
                                    <p className="small text-muted mb-1 fw-bold">Revenue</p>
                                    <h2 className="fw-bold mb-0 text-dark">$2,450</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-lg-8">
                                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 border">
                                    <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><BarChart3 size={18}/> Enrollment Trends</h6>
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center" style={{height: '240px'}}>
                                        <span className="text-muted small">Analytics Visualization Placeholder</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-dark text-white">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Target size={18} className="text-primary"/> Monthly Goals</h6>
                                    <div className="progress bg-secondary mb-3" style={{height: '6px'}}><div className="progress-bar bg-primary w-75"></div></div>
                                    <div className="d-flex align-items-center gap-2 mt-auto"><Award size={20} className="text-warning"/><span className="small">Top 10% Instructor!</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading) return <div className="d-flex vh-100 justify-content-center align-items-center bg-light"><div className="spinner-grow text-primary"></div></div>;

    if (!userProfile || !userProfile.is_instructor) return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center p-5 bg-white rounded-4 shadow-sm border" style={{ maxWidth: '400px' }}>
                <div className="text-danger mb-3 fw-bold fs-1">!</div>
                <h3 className="fw-bold">Instructor Access Only</h3>
                <Link to="/auth" className="btn btn-primary rounded-pill px-4">Login to Access</Link>
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
                    @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
                    .skeleton {
                        background: #f6f7f8;
                        background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
                        background-repeat: no-repeat;
                        background-size: 800px 104px;
                        display: inline-block;
                        position: relative;
                        animation: shimmer 1.2s linear infinite forwards;
                    }
                    .animate-fade-in { animation: fadeIn 0.3s ease-in; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                `}
            </style>
            
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
                                    <h6 className="fw-bold mb-0">Hi, {userProfile.full_name?.split(' ')[0]}!</h6>
                                    <span className="badge bg-success bg-opacity-10 text-success small mt-1">Instructor Portal</span>
                                </div>
                                <div className="nav flex-column nav-pills gap-2">
                                    <button onClick={() => setActiveView('dashboard')} className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'dashboard' ? 'active shadow-sm' : 'text-muted'}`}>
                                        <LayoutDashboard size={20} /> Dashboard
                                    </button>
                                    <button onClick={() => setActiveView('courses')} className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'courses' ? 'active shadow-sm' : 'text-muted'}`}>
                                        <BookOpen size={20} /> My Courses
                                    </button>
                                    <button onClick={() => setActiveView('students')} className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'students' ? 'active shadow-sm' : 'text-muted'}`}>
                                        <Users size={20} /> Students
                                    </button>
                                    <button onClick={() => setActiveView('settings')} className={`nav-link border-0 text-start d-flex align-items-center gap-3 py-3 px-3 rounded-3 transition-all ${activeView === 'settings' ? 'active shadow-sm' : 'text-muted'}`}>
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
        </>
    );
}