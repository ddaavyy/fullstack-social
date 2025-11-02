import type { Notification } from "@/types/notification";

export default function NotificationItem({
  data,
  onRead,
  onClickPrimary,
}: {
  data: Notification;
  onRead: () => void;
  onClickPrimary: () => void;
}) {
  const { title, description, createdAt, read, type, avatarUrl } = data;

  return (
    <button
      onClick={() => {
        onRead();
        onClickPrimary();
      }}
      className={`w-full rounded-lg border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60
        ${
          read
            ? "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
            : "border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/15"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-slate-300">
              {type === "friend_request"
                ? "FR"
                : type === "friend_accept"
                ? "OK"
                : type === "message"
                ? "MSG"
                : "SYS"}
            </div>
          )}
          {!read && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-400 ring-1 ring-slate-900" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-semibold text-slate-50">
              {title}
            </span>
            <span className="shrink-0 text-[11px] text-slate-400">
              {new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {description && (
            <div className="mt-0.5 line-clamp-2 text-sm text-slate-300/90">
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
