import { useAuth } from '../AuthContext';

export default function InstructorsPage() {
    const { userProfile, loading } = useAuth();

    // 1. Handle Loading State
    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading profile data...</p>
            </div>
        );
    }

    // 2. Handle Unauthorized Access
    // Check if userProfile exists AND if the user is an instructor
    if (!userProfile || !userProfile.is_instructor) {
        return (
            <div className="container d-flex justify-content-center align-items-center my-5 text-center alert alert-danger">
                <h2>Access Denied</h2>
                <p>You must be logged in as an instructor to view this page.</p>
                {/* Optional: Add a link to the login/signup page */}
                <a href="/auth" className="btn btn-primary mt-3">Go to Login</a>
            </div>
        );
    }
    
    // If we reach this point, the user is logged in AND is an instructor.
    // We can confidently use userProfile.full_name.

    return (
        <div className="container-fluid row">
            
            <h1 className="">Instructor Dashboard</h1>

            {/* Settings Menu / Sidebar (col-sm-3) */}
            <div id="settings-menu" className="card p-3 col-sm-3 mb-3">
                <h5 className="card-title text-primary">Welcome, {userProfile.full_name}!</h5>
                <hr/>
                <p className="mb-2"><a href="#">Manage Courses</a></p>
                <p className="mb-2"><a href="#">View Students</a></p>
                <p className="mb-2"><a href="#">Earnings Report</a></p>
                <p className="mb-2"><a href="#">Profile Settings</a></p>
            </div>
            
            {/* Main Content Area (col-sm-9) */}
            <div className="col-sm-9">
                <div className="card p-4">
                    <h2>Course Overview</h2>
                    <p>This is the main area for managing your courses and content.</p>
                    
                    {/* Placeholder content using actual data */}
                    <p className="text-muted mt-4">
                        Instructor ID: {userProfile.id}
                    </p>
                    <p>Total published courses: **(Fetch from DB)**</p>
                    <p>Pending drafts: **(Fetch from DB)**</p>
                    
                    {/* Placeholder content for layout demonstration */}
                    <div className="mt-4">
                        <p>Weekly Performance Graph goes here.</p>
                        <p>Latest student reviews.</p>
                        <p>Quick link to create a new course.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}