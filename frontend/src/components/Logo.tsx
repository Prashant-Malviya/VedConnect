import { Link } from "react-router-dom";
import logoUrl from "../assets/logo.svg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  textClassName?: string;
  linkTo?: string;
}

const SIZE_MAP = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const Logo = ({ size = "md", withText = true, textClassName = "", linkTo = "/" }: LogoProps) => {
  const content = (
    <span className="inline-flex items-center gap-2">
      <img src={logoUrl} alt="VedConnect logo" className={`${SIZE_MAP[size]} shrink-0`} />
      {withText && (
        <span className={`font-bold tracking-tight ${textClassName || "text-xl text-purple-800"}`}>
          VedConnect
        </span>
      )}
    </span>
  );

  if (!linkTo) return content;

  return (
    <Link to={linkTo} className="inline-flex items-center" aria-label="VedConnect home">
      {content}
    </Link>
  );
};

export default Logo;
