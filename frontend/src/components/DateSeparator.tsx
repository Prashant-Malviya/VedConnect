interface DateSeparatorProps {
  isoDate: string;
}

const formatDateLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
};

const DateSeparator = ({ isoDate }: DateSeparatorProps) => {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-purple-100" />
      <span className="text-[11px] font-medium text-slate-400 bg-white/70 px-2.5 py-1 rounded-full">
        {formatDateLabel(isoDate)}
      </span>
      <div className="h-px flex-1 bg-purple-100" />
    </div>
  );
};

export default DateSeparator;
