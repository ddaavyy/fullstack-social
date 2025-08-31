import { useEffect, useMemo, useRef, useState } from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import type React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import type { Profile } from "@/types/profile";

import api from "../api/axios";
import { useProfileQuery } from "../api/profile/profile";
import brandImg from "../assets/icon-home.png";
import { useClearProfile, useProfile } from "../store/useProfileStore";
import { clearAuthCookies } from "../utils/clearCookies";

type MenuKey = "profile" | "settings" | "logout";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const profile = useProfile() as Profile | null;
  const clearProfile = useClearProfile();

  useProfileQuery(true);

  const initial = useMemo<string>(
    () => (profile?.username?.[0] || profile?.email?.[0] || "U").toUpperCase(),
    [profile]
  );

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const onMenuClick = async (key: MenuKey) => {
    if (key !== "logout") {
      navigate(`/${key}`);
      close();
      return;
    }
    try {
      await api.post("logout/", {
        refresh_token: Cookies.get("refresh_token"),
      });
    } catch {}
    clearAuthCookies();
    clearProfile();
    navigate("/login");
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        !btnRef.current?.contains(target) &&
        !popRef.current?.contains(target)
      )
        close();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="h-16 w-full bg-white/5">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
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
        <div className="flex items-center">
          <button
            ref={btnRef}
            onClick={toggle}
            aria-haspopup="menu"
            aria-expanded={open}
            className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-slate-100 transition
                     hover:bg-white/10 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
          >
            <div className="relative h-10 w-10 rounded-full ring-2 ring-white/20 overflow-hidden bg-gradient-to-br from-[#1f2a44] to-[#22304f]">
              {profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Avatar"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-sm font-bold text-white/90">
                  {initial}
                </span>
              )}
            </div>

            <span className="hidden text-left md:flex md:flex-col md:leading-tight">
              <span className="text-[13px] font-semibold text-slate-50">
                {profile?.username ?? "--"}
              </span>
              <span className="text-[11px] text-slate-400">Conta</span>
            </span>
            <DownOutlined className="text-[10px] opacity-80 transition group-hover:opacity-100" />
          </button>

          <div ref={popRef} className={`relative ${open ? "block" : "hidden"}`}>
            <div className="relative">
              <div
                className={`absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-slate-300/15 bg-slate-900/90 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl`}
                data-state={open ? "open" : "closed"}
                style={{
                  transform: open ? "translateY(0)" : "translateY(4px)",
                  transition: "transform .12s ease, opacity .12s ease",
                }}
              >
                <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-slate-300/15 bg-slate-900/90" />
                <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-50">
                      {profile?.username ?? "--"}
                    </div>
                    <div className="truncate text-xs text-slate-400">
                      {profile?.email ?? "--"}
                    </div>
                  </div>
                </div>
                <nav
                  className="mt-1.5 grid gap-1.5"
                  role="menu"
                  aria-label="User menu"
                >
                  <MenuItem
                    icon={<UserOutlined />}
                    label="Perfil"
                    onClick={() => onMenuClick("profile")}
                  />
                  <MenuItem
                    icon={<SettingOutlined />}
                    label="Configurações"
                    onClick={() => onMenuClick("settings")}
                  />
                  <div className="mx-1 my-1 border-t border-white/10" />
                  <MenuItem
                    icon={<LogoutOutlined />}
                    label="Sair"
                    danger
                    onClick={() => onMenuClick("logout")}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
};

function MenuItem({ icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`group mx-0.5 inline-flex w-[calc(100%-4px)] items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
                  ${
                    danger
                      ? "text-rose-300 hover:bg-rose-500/10 active:translate-y-px"
                      : "text-slate-200 hover:bg-violet-500/10 active:translate-y-px"
                  }`}
    >
      <span
        className={`text-base ${danger ? "text-rose-300" : "text-violet-300"}`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
