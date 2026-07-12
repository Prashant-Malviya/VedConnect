import { getAvatarColor } from "../utils/avatarColor";

interface AvatarProps {
  username: string;
  size?: "sm" | "md";
}

const Avatar = ({ username, size = "md" }: AvatarProps) => {
  const initial = username.charAt(0).toUpperCase();
  const colorClass = getAvatarColor(username);
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0 ring-2 ring-white shadow-sm`}
    >
      {initial}
    </div>
  );
};

export default Avatar;
