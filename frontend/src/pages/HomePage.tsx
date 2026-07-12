import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  Radio,
  Database,
  Users,
  Keyboard,
  CheckCheck,
  Smartphone,
  Layers,
  FileCode2,
  Network,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FeatureCard from "../components/FeatureCard";
import TechCard from "../components/TechCard";
import heroIllustration from "../assets/hero-illustration.svg";

const FEATURES = [
  { icon: KeyRound, title: "JWT Authentication", description: "Stateless, token-based sessions that keep every request verifiable." },
  { icon: ShieldCheck, title: "Secure Authorization", description: "Route-level guards make sure only signed-in users reach protected data." },
  { icon: Radio, title: "Socket.io Realtime Chat", description: "Messages, presence, and typing events delivered the instant they happen." },
  { icon: Database, title: "MongoDB Storage", description: "Chat history persists reliably, so a refresh never loses a conversation." },
  { icon: Users, title: "Online Presence", description: "See who is online right now, updated live as people join or leave." },
  { icon: Keyboard, title: "Typing Indicator", description: "A gentle, real-time cue that someone is composing a reply." },
  { icon: CheckCheck, title: "Delivery Status", description: "Every message shows whether it was sent or delivered." },
  { icon: Smartphone, title: "Responsive UI", description: "A calm, consistent experience across mobile, tablet, and desktop." },
  { icon: Layers, title: "Layered Architecture", description: "Controllers, services, and repositories kept cleanly separated." },
  { icon: FileCode2, title: "TypeScript", description: "End-to-end type safety across the frontend and backend." },
  { icon: Network, title: "REST APIs", description: "Predictable, well-structured endpoints for auth and messaging." },
  { icon: Sparkles, title: "Clean Code", description: "Readable, well-organized code that's easy to extend and maintain." },
];

const TECH_STACK = [
  { icon: FileCode2, name: "React" },
  { icon: FileCode2, name: "TypeScript" },
  { icon: Network, name: "Node.js" },
  { icon: Layers, name: "Express" },
  { icon: Database, name: "MongoDB" },
  { icon: Radio, name: "Socket.io" },
  { icon: Sparkles, name: "Tailwind" },
  { icon: KeyRound, name: "JWT" },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartChat = () => {
    navigate(isAuthenticated ? "/chat" : "/signup");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in-up">
            <span className="inline-block bg-white/10 text-gold-400 text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-full mb-5">
              A Modern Real-Time Experience
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              VedConnect
            </h1>
            <p className="text-purple-100/90 max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
              Experience secure, real-time conversations inspired by technology, trust, and meaningful human connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={handleStartChat}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-600 text-purple-900 px-6 py-3 rounded-2xl font-semibold shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/25 px-6 py-3 rounded-2xl font-medium hover:bg-white/20 transition-colors"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="flex justify-center animate-fade-in">
            <img
              src={heroIllustration}
              alt="Illustration of stars, a moon, a lotus, and connected circles representing calm real-time connection"
              className="w-full max-w-md animate-float"
            />
          </div>
        </div>
      </section>

      {/* About Vedaz Inspiration */}
      <section className="max-w-4xl mx-auto py-20 px-4 sm:px-6 text-center">
        <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">Inspiration</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 mb-6">
          Inspired by the Vision of Vedaz
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          VedConnect is a demonstration project inspired by the vision of modern spiritual technology
          platforms like Vedaz.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          It showcases how modern web technologies such as React, Node.js, MongoDB, Socket.io, and JWT
          Authentication can be used to build secure and real-time communication experiences while
          maintaining a clean and scalable architecture.
        </p>
        <p className="text-slate-500 text-sm italic">
          This project is created solely as a technical demonstration and is not affiliated with or
          endorsed by Vedaz.
        </p>
      </section>

      {/* About Me */}
      <section className="bg-soft-gradient py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">The Developer</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Meet the Developer</h2>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-card border border-purple-100/60 p-8 text-center hover-lift">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-purple-100">
            PM
          </div>
          <h3 className="text-lg font-bold text-slate-800">Prashant Malviya</h3>
          <p className="text-sm text-gold-600 font-medium mb-4">Full Stack Developer</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            I am a passionate Full Stack Developer specializing in the MERN stack and TypeScript. I enjoy
            building scalable web applications with clean architecture, secure authentication, REST APIs,
            and real-time systems. VedConnect demonstrates my ability to design and develop
            production-ready applications with modern frontend experiences.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a href="https://github.com/Prashant-Malviya" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/prashant-malviya-57270b1b6" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://prashantmalviya-portfolio.netlify.app" target="_blank" rel="noreferrer" aria-label="Portfolio" className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto py-20 px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-soft-gradient py-20 px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">Under the Hood</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Technology Stack</h2>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {TECH_STACK.map((tech) => (
            <TechCard key={tech.name} {...tech} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to start your journey?</h2>
          <p className="text-purple-100/90 max-w-md mx-auto mb-8">
            Join VedConnect and experience conversations built on trust, presence, and connection.
          </p>
          <button
            onClick={handleStartChat}
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-2xl font-semibold shadow-glow hover:-translate-y-0.5 transition-all"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
