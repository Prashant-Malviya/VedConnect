import { Target, Eye, Cpu, Layers, Sparkles } from "lucide-react";

const TIMELINE = [
  {
    icon: Target,
    title: "Mission",
    text: "To show that a real-time communication product can feel calm and premium, not just functional - pairing secure engineering with a genuinely pleasant interface.",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "A small glimpse of what modern spiritual-technology platforms could feel like: soft, trustworthy, and centered around meaningful connection between people.",
  },
  {
    icon: Cpu,
    title: "Technology",
    text: "Built on the MERN stack with TypeScript throughout, Socket.io for live events, and JWT-based authentication guarding every request and socket connection.",
  },
  {
    icon: Layers,
    title: "Architecture",
    text: "A layered backend - routes, controllers, services, and repositories - keeps business logic separate from data access, making the codebase easy to test and extend.",
  },
  {
    icon: Sparkles,
    title: "Why VedConnect Was Built",
    text: "As a technical demonstration: to practice designing a production-style real-time application end to end, from authentication and sockets to a polished, responsive UI.",
  },
];

const AboutPage = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-16 px-4 sm:px-6 text-center">
        <span className="text-xs font-semibold tracking-wide uppercase text-gold-400">About</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">The Story Behind VedConnect</h1>
        <p className="text-purple-100/90 max-w-xl mx-auto mt-4 leading-relaxed">
          A closer look at the mission, vision, and engineering choices behind this project.
        </p>
      </section>

      <section className="max-w-3xl mx-auto py-16 px-4 sm:px-6">
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-purple-200" aria-hidden="true" />
          <div className="space-y-10">
            {TIMELINE.map(({ icon: Icon, title, text }) => (
              <div key={title} className="relative">
                <div className="absolute -left-8 sm:-left-10 top-0 w-8 h-8 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center text-purple-700 shadow-soft">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="bg-white rounded-2xl shadow-soft border border-purple-100/60 p-5 sm:p-6 hover-lift hover:shadow-card">
                  <h2 className="font-semibold text-slate-800 mb-1.5">{title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
