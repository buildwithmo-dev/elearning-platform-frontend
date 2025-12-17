

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3">dlp<span className="text-primary">.</span></h5>
            <p className="text-secondary">Empowering learners worldwide with high-quality, practical education. Join our community of 10k+ students.</p>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled text-secondary">
              <li><a href="#" className="nav-link p-0 mb-2">Browse Courses</a></li>
              <li><a href="#" className="nav-link p-0 mb-2">Mentorship</a></li>
              <li><a href="#" className="nav-link p-0 mb-2">Pricing</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Company</h6>
            <ul className="list-unstyled text-secondary">
              <li><a href="#" className="nav-link p-0 mb-2">About Us</a></li>
              <li><a href="#" className="nav-link p-0 mb-2">Careers</a></li>
              <li><a href="#" className="nav-link p-0 mb-2">Contact</a></li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3">Subscribe to Newsletter</h6>
            <div className="input-group mb-3">
              <input type="text" className="form-control border-0 shadow-none" placeholder="Email address" />
              <button className="btn btn-primary" type="button">Join</button>
            </div>
          </div>
        </div>
        <hr className="my-4 opacity-25" />
        <div className="text-center text-secondary small">
          © {new Date().getFullYear()} DLP Learning. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;