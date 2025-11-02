import { useEffect, useMemo, useRef, useState } from "react";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

import { useProfile, useClearProfile } from "@/store/useProfileStore";
import { useProfileQuery } from "@/api/profile/profile";
import api from "@/api/axios";
import { clearAuthCookies } from "@/utils/clearCookies";
import type { Profile } from "@/types/profile";
import MenuItem from "./MenuItem";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const profile = useProfile() as Profile | null;
  const clearProfile = useClearProfile();
  useProfileQuery(true);

  const initial = useMemo(
    () => (profile?.username?.[0] || profile?.email?.[0] || "U").toUpperCase(),
    [profile]
  );

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  // fechar ao clicar fora / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (!btnRef.current?.contains(t) && !popRef.current?.contains(t)) {
        close();
      }
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

  async function onMenuClick(key: "profile" | "settings" | "logout") {
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
    qc.removeQueries({ queryKey: ["profile"] });
    clearAuthCookies();
    clearProfile();
    navigate("/login");
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group shrink-0 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-slate-100 transition
                   hover:bg-white/10 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
      >
        <div className="relative h-10 w-10 rounded-full ring-2 ring-white/20 overflow-hidden bg-gradient-to-br from-[#1f2a44] to-[#22304f]">
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt="Avatar"
              className="absolute inset-0 h-full w-full object-cover object-center"
              onError={(e) => ((e as any).currentTarget.style.display = "none")}
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
        <div
          className="
            z-50
            fixed top-16 inset-x-2
            w-[calc(100vw-1rem)]
            sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2
            sm:w-72
            origin-top-right rounded-xl border border-slate-300/15 bg-slate-900/90 p-1.5
            shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl
          "
          data-state={open ? "open" : "closed"}
          style={{
            transform: open ? "translateY(0)" : "translateY(4px)",
            transition: "transform .12s ease, opacity .12s ease",
          }}
        >
          <div className="hidden sm:block absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-slate-300/15 bg-slate-900/90" />
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
    </>
  );
}
