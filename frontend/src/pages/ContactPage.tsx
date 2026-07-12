import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Send } from "lucide-react";

interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: ContactErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) newErrors.email = "Enter a valid email";
    if (!message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Backend integration isn't required for this form per the assignment spec -
    // it's frontend-validation only.
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  };

  return (
    <div>
      <section className="bg-hero-gradient py-16 px-4 sm:px-6 text-center">
        <span className="text-xs font-semibold tracking-wide uppercase text-gold-400">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">Contact Us</h1>
        <p className="text-purple-100/90 max-w-xl mx-auto mt-4 leading-relaxed">
          Questions, feedback, or just want to say hello? We'd love to hear from you.
        </p>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-purple-100/60 p-5 flex items-center gap-4 hover-lift hover:shadow-card">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
              <p className="text-sm font-medium text-slate-800">support@vedconnect.io</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-purple-100/60 p-5 flex items-center gap-4 hover-lift hover:shadow-card">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
              <p className="text-sm font-medium text-slate-800">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-purple-100/60 p-5 flex items-center gap-4 hover-lift hover:shadow-card">
            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-slate-800">Indore, Madhya Pradesh, India</p>
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden border border-purple-100/60 h-48 bg-soft-gradient flex items-center justify-center text-purple-400 text-sm"
            role="img"
            aria-label="Map placeholder showing office location"
          >
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto mb-1 text-purple-500" />
              Google Maps placeholder
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="Portfolio" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl shadow-card border border-purple-100/60 h-fit">
          {submitted && (
            <p className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm">
              Thanks! Your message has been received.
            </p>
          )}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            />
            {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
