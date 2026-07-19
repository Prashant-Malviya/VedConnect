import { MessagesSquare } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-slate-400 bg-soft-gradient animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-500 animate-float">
        <MessagesSquare className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">No conversation selected</p>
        <p className="text-xs text-slate-400 mt-1">Pick Community or a user to start chatting</p>
      </div>
    </div>
  );
};

export default EmptyState;
