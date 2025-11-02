import { useEffect, useMemo, useRef, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import type { Notification } from "@/types/notification";
import NotificationItem from "./NotificationItem";

export default function NotificationsPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // seed visual (remova se não quiser mock)
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications([
        {
          id: "1",
          title: "Novo pedido de amizade",
          description: "julia.souza quer se conectar",
          createdAt: new Date().toISOString(),
          read: false,
          type: "friend_request",
        },
        {
          id: "2",
          title: "Amizade aceita",
          description: "joao.dev agora é seu amigo",
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          read: false,
          type: "friend_accept",
        },
        {
          id: "3",
          title: "Nova mensagem",
          description: "Exemplo Um: “bora testar WS?”",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: true,
          type: "message",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

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

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Notificações"
        className="relative shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-100 transition
                   hover:bg-white/10 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
      >
        <BellOutlined className="text-lg opacity-90" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[10px] font-bold text-white ring-2 ring-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div ref={popRef} className={`relative ${open ? "block" : "hidden"}`}>
        <div
          className="
            z-50
            fixed top-16 inset-x-2
            w-[calc(100vw-1rem)]
            sm:absolute sm:inset-auto sm:right-0 sm:top-auto sm:mt-2
            sm:w-[28rem] sm:max-w-[90vw]
            origin-top-right rounded-xl border border-slate-300/15 bg-slate-900/90 p-2
            shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl
          "
          data-state={open ? "open" : "closed"}
          style={{
            transform: open ? "translateY(0)" : "translateY(4px)",
            transition: "transform .12s ease, opacity .12s ease",
          }}
          role="dialog"
          aria-label="Painel de notificações"
        >
          <div className="hidden sm:block absolute -top-1.5 right-6 h-3 w-3 rotate-45 rounded-[2px] border-l border-t border-slate-300/15 bg-slate-900/90" />

          {/* Header */}
          <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <div className="text-sm font-semibold text-slate-50">
              Notificações
              <span className="ml-2 text-xs font-normal text-slate-400">
                {unreadCount} não lida{unreadCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="rounded-md px-2 py-1 text-xs text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
              >
                Marcar todas como lidas
              </button>
              <button
                onClick={clearAll}
                className="rounded-md px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Lista */}
          <div className="mt-2 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto -mr-1 pr-1">
            {notifications.length === 0 ? (
              <div className="grid place-items-center py-10 text-sm text-slate-400">
                Nenhuma notificação.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <NotificationItem
                      data={n}
                      onRead={() =>
                        setNotifications((prev) =>
                          prev.map((x) =>
                            x.id === n.id ? { ...x, read: true } : x
                          )
                        )
                      }
                      onClickPrimary={() => {
                        if (n.type === "friend_request") navigate("/friends");
                        if (n.type === "friend_accept") navigate("/friends");
                        if (n.type === "message") navigate("/friends");
                        setOpen(false);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center justify-end">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-violet-300 hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
            >
              Ver tudo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
