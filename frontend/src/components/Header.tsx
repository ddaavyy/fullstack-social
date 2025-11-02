import { Link, NavLink } from "react-router-dom";
import { TeamOutlined } from "@ant-design/icons";
import brandImg from "@/assets/icon-home.png";
import NotificationsPopover from "./NotificationsPopover";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  return (
    <header className="h-16 w-full bg-white/5">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-10 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
            <img
              src={brandImg}
              alt="Logo"
              className="h-14 w-auto object-contain select-none"
              draggable={false}
            />
            <span className="hidden sm:block text-slate-100/90 font-semibold tracking-wide">
              Dashboard
            </span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-white/20 bg-white/10 text-slate-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-slate-100"
                }`
              }
            >
              <TeamOutlined />
              Amigos
            </NavLink>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
