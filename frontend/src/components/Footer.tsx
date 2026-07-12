import { Link } from "react-router-dom";
import { Github, Linkedin, Globe, Heart } from "lucide-react";
import Logo from "./Logo";

const TECH_STACK = ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Socket.io"];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#3B0764] to-[#2A0550] text-purple-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div>
          <Logo size="sm" textClassName="text-lg text-white" />
          <p className="mt-3 text-purple-200/80 leading-relaxed">
            Connecting souls through real-time conversations.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
            <li><Link to="/chat" className="hover:text-gold-400 transition-colors">Chat</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="bg-white/10 px-2.5 py-1 rounded-full text-xs text-purple-100">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Developer</h4>
          <p className="text-purple-200/80 mb-3">Prashant Malviya</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 rounded-lg bg-white/10 hover:bg-gold-500 hover:text-purple-900 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/10 hover:bg-gold-500 hover:text-purple-900 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://example.com" target="_blank" rel="noreferrer" aria-label="Portfolio" className="p-2 rounded-lg bg-white/10 hover:bg-gold-500 hover:text-purple-900 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-purple-300/80 text-center space-y-1">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> by Prashant Malviya
          </p>
          <p>Inspired by modern spiritual technology platforms.</p>
          <p>This project is created for technical demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
