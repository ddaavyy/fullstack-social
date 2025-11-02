import type React from "react";

export default function MenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
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
