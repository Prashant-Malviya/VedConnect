import { LucideIcon } from "lucide-react";

interface TechCardProps {
  icon: LucideIcon;
  name: string;
}

const TechCard = ({ icon: Icon, name }: TechCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2.5 bg-white rounded-2xl p-5 shadow-soft border border-purple-100/60 hover-lift hover:shadow-card">
      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  );
};

export default TechCard;
