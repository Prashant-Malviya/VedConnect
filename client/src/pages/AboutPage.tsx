import { Target, Eye, Cpu, Layers, Sparkles, Video, Mic, Users, Brain, Rocket } from "lucide-react";

const STORY = [
  {
    icon: Target,
    title: "What VedConnect Is",
    text: "VedConnect is a real-time communication platform built for our OpenAI Codex Hackathon submission - direct messaging, user-created communities, live WebRTC audio calling, and Ved, a Gemini-powered AI teammate who participates directly inside conversations and calls instead of living in a separate chatbot window.",
  },
  {
    icon: Eye,
    title: "The Core Idea",
    text: "Most \"AI chat\" features bolt a sidebar assistant onto a product. Ved is different: mention @ved in any chat, or just say \"Hey Ved\" out loud during a call, and it responds as a genuine participant in that exact conversation - reading only what's actually been said there, never inventing context.",
  },
  {
    icon: Cpu,
    title: "How It's Built",
    text: "MERN stack with TypeScript throughout, Socket.io for every real-time surface (messages, presence, typing, call signaling, live transcript, Ved's thinking/speaking status), JWT authentication guarding every request and socket connection, and native WebRTC for peer-to-peer audio calling.",
  },
  {
    icon: Layers,
    title: "Architecture",
    text: "A layered backend - routes, controllers, services, repositories - keeps business logic separate from data access. Ved's AI logic is provider-agnostic by design: one small interface for the LLM (Gemini today), another for text-to-speech (ElevenLabs today), so swapping either later never touches the rest of the app.",
  },
  {
    icon: Sparkles,
    title: "Why We Built It",
    text: "To prove an AI teammate can feel native to a product rather than bolted on - present in text chat, in group communities, and now in live voice calls, using the same context-aware pipeline everywhere instead of three disconnected integrations.",
  },
];

const FUTURE = [
  {
    icon: Video,
    title: "Ved in Video Calls",
    text: "Extending Ved from audio calls into video calls - the same live-transcript and wake-word pipeline, but with Ved able to reference what's on screen, not just what's said, when helping a group make a decision.",
  },
  {
    icon: Brain,
    title: "AI Meeting Summaries & Notes",
    text: "Turning a call's live transcript into automatic meeting minutes and action items the moment a call ends, so nobody has to take notes while they're busy talking.",
  },
  {
    icon: Mic,
    title: "Voice Personalities & Translation",
    text: "Multiple selectable voices/personalities for Ved, plus real-time voice translation so participants speaking different languages can understand each other through Ved mid-call.",
  },
  {
    icon: Users,
    title: "Group Calling",
    text: "Growing today's 1:1 calling into full group calls, with Ved moderating discussion, tracking who's said what, and helping larger groups reach decisions faster.",
  },
  {
    icon: Rocket,
    title: "Continuous AI Collaboration",
    text: "Moving Ved from \"only responds when invoked\" toward a teammate that can proactively flag when a decision seems ready to be made, a question is left unanswered, or the conversation is drifting off-topic - always assistive, never intrusive.",
  },
];

const AboutPage = () => {
  return (
    <div>
      <section className="bg-hero-gradient py-16 px-4 sm:px-6 text-center animate-fade-in-up">
        <span className="text-xs font-semibold tracking-wide uppercase text-gold-400">About · Hackathon Submission</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2">The Story Behind VedConnect</h1>
        <p className="text-purple-100/90 max-w-xl mx-auto mt-4 leading-relaxed">
          Built for the OpenAI Codex Hackathon - a closer look at what we built, how, and where it's headed next.
        </p>
      </section>

      <section className="max-w-3xl mx-auto py-16 px-4 sm:px-6">
        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-purple-200" aria-hidden="true" />
          <div className="space-y-10">
            {STORY.map(({ icon: Icon, title, text }, index) => (
              <div
                key={title}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "backwards" }}
              >
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

      <section className="bg-soft-gradient py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in-up">
          <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">What's Next</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">Where VedConnect Is Headed</h2>
          <p className="text-sm text-slate-500 mt-3 max-w-xl mx-auto">
            This is a snapshot of an evolving product, not a finished one - here's what we're building toward next.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FUTURE.map(({ icon: Icon, title, text }, index) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-soft border border-purple-100/60 p-6 hover-lift hover:shadow-card animate-fade-in-up"
              style={{ animationDelay: `${index * 90}ms`, animationFillMode: "backwards" }}
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto py-16 px-4 sm:px-6 text-center animate-fade-in-up">
        <span className="text-xs font-semibold tracking-wide uppercase text-purple-500">The Developer</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2 mb-6">Meet the Developer</h2>
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-card border border-purple-100/60 p-8 hover-lift">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-purple-100">
            PM
          </div>
          <h3 className="text-lg font-bold text-slate-800">Prashant Malviya</h3>
          <p className="text-sm text-gold-600 font-medium mb-4">Full Stack Developer</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Full Stack Developer specializing in the MERN stack and TypeScript, building scalable
            applications with clean architecture, secure authentication, real-time systems, and now
            AI-native product experiences like Ved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
