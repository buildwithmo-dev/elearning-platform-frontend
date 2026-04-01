import Nav from '../components/Nav';
import Categories from '../components/Categories';
import CategorySection from '../components/CategorySection';
import Carousel from '../components/Carousel';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900">

      {/* NAV */}
      <Nav />

      {/* HERO */}
      <section className="relative pt-28 pb-24 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-black/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-gray-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">

          {/* HEADLINE */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Learn Without{" "}
            <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
              Limits
            </span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg">
            Build real skills with world-class instructors. Courses designed for impact.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center gap-4">

            <Link
              to="/auth"
              className="px-7 py-3 bg-black text-white rounded-xl shadow-lg hover:scale-[1.04] hover:shadow-xl transition-all duration-200"
            >
              Get Started
            </Link>

            <Link
              to="/courses"
              className="px-7 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 hover:scale-[1.03] transition-all duration-200"
            >
              Browse Courses
            </Link>

          </div>
        </div>

        {/* HERO CAROUSEL */}
        <div className="relative mt-20 max-w-6xl mx-auto px-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl border bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition">
            <Carousel />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl font-bold">Explore Categories</h2>
            <p className="text-gray-500 text-sm mt-1">
              Find your learning path
            </p>
          </div>
          <Categories />
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">Top Courses</h2>
              <p className="text-gray-500 text-sm">
                Most popular among learners
              </p>
            </div>
          </div>

          <CategorySection />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center mb-14">
          <h2 className="text-3xl font-bold">
            Trusted by Thousands of Learners
          </h2>
          <p className="text-gray-500 mt-3">
            Real stories from real students
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <Reviews />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-black text-white text-center relative overflow-hidden">

        {/* subtle glow */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent"></div>

        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">
            Start Learning Today
          </h2>

          <p className="mt-4 text-gray-300">
            Join thousands of learners building their future.
          </p>

          <Link
            to="/auth"
            className="inline-block mt-8 px-8 py-3 bg-white text-black rounded-xl font-medium hover:scale-[1.05] hover:shadow-xl transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      {/* <Footer /> */}
    </div>
  );
}