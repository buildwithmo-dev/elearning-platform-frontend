import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h5 className="text-xl font-bold text-white mb-3">
              dlp<span className="text-blue-500">.</span>
            </h5>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering learners worldwide with high-quality, practical education. 
              Join our community of 10k+ students.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h6 className="text-white font-semibold mb-4">Platform</h6>
            <ul className="space-y-2 text-sm">
              {["Browse Courses", "Mentorship", "Pricing"].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-white transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h6 className="text-white font-semibold mb-4">Company</h6>
            <ul className="space-y-2 text-sm">
              {["About Us", "Careers", "Contact"].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-white transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="text-white font-semibold mb-4">
              Subscribe to Newsletter
            </h6>

            <div className="flex items-center bg-gray-800 rounded-xl overflow-hidden border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">

              <div className="px-3 text-gray-400">
                <Mail size={18} />
              </div>

              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-2 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
              />

              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} DLP Learning. All rights reserved.
          </p>

          {/* Optional Socials */}
          <div className="flex gap-4 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;