
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItems } from "./NavItems";

interface DesktopNavProps {
  isActive: (path: string) => boolean;
  onLinkHover?: (path: string) => void;
}

export const DesktopNav = ({ isActive, onLinkHover }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center">
      <ul className="flex space-x-1">
        {NavItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )
              }
              onMouseEnter={() => onLinkHover?.(item.path)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
