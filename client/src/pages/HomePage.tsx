import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  Radio,
  Database,
  Users,
  Sparkles,
  Smartphone,
  Layers,
  FileCode2,
  Network,
  Github,
  Linkedin,
  Globe,
  ArrowRight,
  MessagesSquare,
  PhoneCall,
  Mic,
  Bot,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FeatureCard from "../components/FeatureCard";
import TechCard from "../components/TechCard";
import heroIllustration from "../assets/hero-illustration.svg";

const FEATURES = [
  { icon: Bot, title: "Ved, the AI Teammate", description: "Mention @ved in any chat, or say \"Hey Ved\" in a call - it answers, summarizes, and helps decide, using only that conversation's real context." },
  { icon: PhoneCall, title: "1:1 WebRTC Calling", description: "Real peer-to-peer audio calls - ring, accept, reject, mute, and hang up, with full call history." },
  { icon: Mic, title: "Ved in Voice Calls", description: "Live speech-to-text, wake-word detection, and spoken AI replies - a genuine third participant in the conversation." },
  { icon: MessagesSquare, title: "Communities", description: "Create unlimited communities, each with its own chat, members, admins, and its own instance of Ved." },
  { icon: Radio, title: "Socket.io Realtime", description: "Messages, presence, typing, and call signaling delivered the instant they happen." },
  { icon: KeyRound, title: "JWT Authentication", description: "Stateless, token-based sessions that keep every request and socket connection verifiable." },
  { icon: ShieldCheck, title: "Secure Authorization", description: "Route- and role-level guards, so only the right people reach protected data and communities." },
  { icon: Database, title: "MongoDB Storage", description: "Chat and call history persist reliably, so a refresh never loses a conversation." },
  { icon: Users, title: "Online Presence", description: "See who's online right now, updated live as people join or leave." },
  { icon: Layers, title: "Layered Architecture", description: "Controllers, services, and repositories kept cleanly separated - AI and TTS providers are swappable by design." },
  { icon: Smartphone, title: "Responsive UI", description: "A calm, consistent experience across mobile, tablet, and desktop." },
  { icon: Sparkles, title: "Clean TypeScript", description: "End-to-end type safety across the frontend and backend." },
];

const TECH_STACK = [
  { icon: FileCode2, name: "React + TS" },
  { icon: Network, name: "Node.js" },
  { icon: Layers, name: "Express" },
  { icon: Database, name: "MongoDB" },
  { icon: Radio, name: "Socket.io" },
  { icon: PhoneCall, name: "WebRTC" },
  { icon: Bot, name: "Gemini AI" },
  { icon: Mic, name: "ElevenLabs TTS" },
  { icon: KeyRound, name: "JWT" },
  { icon: Sparkles, name: "Tailwind" },
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
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-gold-400 text-xs font-medium tracking-wide uppercase px-3 py-1.5 rounded-full mb-5">
              <Trophy className="w-3.5 h-3.5" />
              Built for the OpenAI Codex Hackathon
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              VedConnect
            </h1>
            <p className="text-purple-100/90 max-w-md mx-auto md:mx-0 mb-4 leading-relaxed">
              An AI-powered communication platform. Chat, create communities, and make real WebRTC
              voice calls - with Ved, a Gemini-powered AI teammate, present in every conversation and
              every call.
            </p>
            <p className="text-purple-200/70 text-sm max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
              Say <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">@ved</span> in chat, or
              just say "Hey Ved" out loud on a call.
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

      {/* Project Summary */}
      <section className="max-w-4xl mx-auto py-20 px-4 sm:px-6 text-center animate-fade-in-up">
        <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">In Short</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 mb-6">What Is VedConnect?</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          VedConnect started as a real-time chat app and grew into an AI-native communication
          platform. It combines direct messaging, user-created communities, and 1:1 WebRTC audio
          calling with <strong className="text-purple-700">Ved</strong> - an AI teammate built on
          Google Gemini that participates directly inside conversations, rather than living in a
          separate assistant window.
        </p>
        <p className="text-slate-600 leading-relaxed">
          In text chat, mention <span className="font-mono bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-sm">@ved</span>{" "}
          for context-aware answers, summaries, and help deciding between options. In a live call,
          just say its name out loud - Ved listens, thinks, and replies in a synthesized voice, right
          inside the conversation.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto py-20 px-4 sm:px-6">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-soft-gradient py-20 px-4 sm:px-6">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">Under the Hood</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Technology Stack</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {TECH_STACK.map((tech, index) => (
            <div
              key={tech.name}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
            >
              <TechCard {...tech} />
            </div>
          ))}
        </div>
      </section>

      {/* About the Developer */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in-up">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">The Developer</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Meet the Developer</h2>
        </div>

        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-card border border-purple-100/60 p-8 text-center hover-lift animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-purple-100">
            PM
          </div>
          <h3 className="text-lg font-bold text-slate-800">Prashant Malviya</h3>
          <p className="text-sm text-gold-600 font-medium mb-4">Full Stack Developer</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            I am a passionate Full Stack Developer specializing in the MERN stack and TypeScript. I
            enjoy building scalable web applications with clean architecture, secure authentication,
            real-time systems, and AI-native product experiences - VedConnect is my submission to the
            OpenAI Codex Hackathon.
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

      {/* CTA */}
      <section className="bg-hero-gradient py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 left-1/4 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to meet Ved?</h2>
          <p className="text-purple-100/90 max-w-md mx-auto mb-8">
            Join VedConnect - chat, join a community, start a call, and bring Ved into the
            conversation whenever you need it.
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
