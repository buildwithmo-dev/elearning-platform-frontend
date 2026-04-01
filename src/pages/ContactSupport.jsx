import React, { useState } from "react";
import { supabase } from "../services/supabase/supabaseClient";
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  LifeBuoy,
  Loader2,
} from "lucide-react";

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("support_tickets")
      .insert([formData]);

    if (!error) setSubmitted(true);
    setLoading(false);
  };

  // ✅ SUCCESS STATE (premium feel)
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-sm border">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="text-green-600" size={28} />
          </div>

          <h2 className="text-2xl font-semibold">Message sent</h2>

          <p className="text-gray-500 text-sm">
            We’ll get back to{" "}
            <span className="font-medium text-gray-800">
              {formData.email}
            </span>{" "}
            within 24 hours.
          </p>

          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 lg:px-10">

      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white mb-4">
          <LifeBuoy size={24} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Contact Support
        </h1>
        <p className="text-gray-500 mt-2">
          Have an issue or question? We’re here to help.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden grid md:grid-cols-3">

        {/* LEFT PANEL */}
        <div className="bg-black text-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-6">Support</h3>

            <div className="space-y-4 text-sm opacity-90">
              <div className="flex items-center gap-3">
                <Mail size={16} />
                support@yourplatform.com
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare size={16} />
                Live chat (Mon–Fri)
              </div>
            </div>
          </div>

          <p className="text-xs opacity-60 mt-6">
            Available 9am – 6pm GMT
          </p>
        </div>

        {/* FORM */}
        <div className="col-span-2 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* SUBJECT */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Subject
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              >
                <option value="">Select a topic</option>
                <option>Billing Issue</option>
                <option>Course Access</option>
                <option>Instructor Tools</option>
                <option>Technical Bug</option>
                <option>Other</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Message
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us what’s going on..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}