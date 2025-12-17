
const FAQ = () => {
  const faqs = [
    { q: "How do I access my courses?", a: "Once you purchase a course, it will appear in your dashboard under 'My Learning'." },
    { q: "Can I get a refund?", a: "Yes, we offer a 30-day money-back guarantee if you haven't completed more than 20% of the course." },
    { q: "Are the certificates industry-recognized?", a: "Our certificates are verified and can be shared directly to your LinkedIn profile." }
  ];

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 className="text-center fw-bold mb-4">Frequently Asked Questions</h2>
        <div className="accordion accordion-flush shadow-sm rounded" id="faqAccordion">
          {faqs.map((faq, i) => (
            <div className="accordion-item" key={i}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                  {faq.q}
                </button>
              </h2>
              <div id={`faq${i}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body text-muted">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;