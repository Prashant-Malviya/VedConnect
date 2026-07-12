import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-purple-100/60 hover-lift hover:shadow-card">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-lavender-100 flex items-center justify-center text-purple-700 mb-4">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
