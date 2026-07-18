import { Link } from "react-router-dom";
import { resolveHomeNavHref } from "@/lib/catalogNavigation";

export function LuxeNavLink({
  item,
  className,
  onNavigate,
}: {
  item: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const href = resolveHomeNavHref(item);
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className} onClick={onNavigate}>
        {item}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onNavigate}>
      {item}
    </a>
  );
}
