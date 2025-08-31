import { useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  SearchOutlined,
  SendOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Empty, Input, Typography } from "antd";

const MOCK_FRIENDS = [
  {
    id: 1,
    name: "Exemplo Um",
    email: "exemplo1@exemplo1.com",
    photo: "https://i.pravatar.cc/80?img=5",
    status: "online",
  },
  {
    id: 2,
    name: "Exemplo Dois",
    email: "exemplo2@exemplo2.com",
    photo: "https://i.pravatar.cc/80?img=32",
    status: "ausente",
  },
  {
    id: 3,
    name: "Exemplo Tres",
    email: "exemplo3@exemplo3.com",
    photo: "https://i.pravatar.cc/80?img=13",
    status: "offline",
  },
  {
    id: 4,
    name: "Exemplo Quatro",
    email: "exemplo4@exemplo4.com",
    photo: "https://i.pravatar.cc/80?img=23",
    status: "ocupado",
  },
  {
    id: 5,
    name: "Exemplo Cinco",
    email: "exemplo5@exemplo5.com",
    photo: "https://i.pravatar.cc/80?img=45",
    status: "offline",
  },
];

const MOCK_MESSAGES = {
  1: [
    { id: "m1", me: false, text: "Teste1", ts: "13/06/2025 18:16" },
    { id: "m2", me: true, text: "Teste2", ts: "01/07/2025 15:13" },
    { id: "m3", me: false, text: "Teste3", ts: "08/07/2025 10:12" },
  ],
  2: [{ id: "m4", me: false, text: "Teste4", ts: "11 sem" }],
  3: [{ id: "m5", me: false, text: "Teste5", ts: "24 sem" }],
};

const statusColor = {
  online: "bg-emerald-400",
  ausente: "bg-amber-400",
  offline: "bg-slate-400",
  ocupado: "bg-red-400",
};

function StatusAvatar({ src, alt, status }) {
  return (
    <div className="relative">
      <Avatar src={src} alt={alt} size={44} />
      <span
        className={`absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[#152233] ${
          statusColor[status] || "bg-slate-400"
        }`}
        title={status}
      />
    </div>
  );
}

function MessageBubble({ me, text }) {
  return (
    <div className={`w-full flex ${me ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm leading-relaxed
        ${
          me
            ? "bg-violet-600/80 text-white rounded-br-md"
            : "bg-white/10 text-slate-100 rounded-bl-md"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default function Friends() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState("");

  const friends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_FRIENDS;
    return MOCK_FRIENDS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = useMemo(
    () => MOCK_FRIENDS.find((f) => f.id === selectedId),
    [selectedId]
  );
  const messages = useMemo(
    () => (selectedId ? MOCK_MESSAGES[selectedId] || [] : []),
    [selectedId]
  );

  const onSend = () => {
    if (!draft.trim() || !selectedId) return;
    (MOCK_MESSAGES[selectedId] ||= []).push({
      id: String(Math.random()),
      me: true,
      text: draft.trim(),
      ts: "agora",
    });
    setDraft("");
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] px-4 md:py-12 py-6 flex justify-center items-start bg-[#0f1b2b]">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4">
        <Card
          className="bg-[#152233]/90 border border-slate-700/60 rounded-2xl shadow-xl"
          styles={{ body: { padding: 16 } }}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <Typography.Title level={4} style={{ color: "white", margin: 0 }}>
              Conversas
            </Typography.Title>
          </div>

          <Input
            allowClear
            placeholder="Pesquisar"
            prefix={<SearchOutlined className="text-slate-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-3"
          />

          <div className="max-h-[65vh] overflow-y-auto pr-1">
            {friends.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-slate-300">
                    Nenhum amigo encontrado
                  </span>
                }
              />
            ) : (
              <ul className="space-y-1">
                {friends.map((f) => {
                  const active = selectedId === f.id;
                  return (
                    <li key={f.id}>
                      <button
                        onClick={() => setSelectedId(f.id)}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition
                          border ${
                            active
                              ? "bg-white/10 border-white/20"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }
                          `}
                      >
                        <StatusAvatar
                          src={f.photo}
                          alt={f.name}
                          status={f.status}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-slate-100 font-medium">
                            {f.name}
                          </div>
                          <div className="truncate text-xs text-slate-400">
                            {f.email}
                          </div>
                        </div>
                        {Math.random() > 0.7 && (
                          <span className="h-2 w-2 rounded-full bg-sky-400" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>
        <Card
          className="bg-[#152233]/90 border border-slate-700/60 rounded-2xl shadow-xl hidden md:flex md:flex-col"
          styles={{ body: { padding: 0 } }}
        >
          {!selected ? (
            <div className="flex-1 grid place-items-center px-6 py-10">
              <div className="text-center">
                <Typography.Title level={3} style={{ color: "white" }}>
                  Selecione um amigo
                </Typography.Title>
                <Typography.Text style={{ color: "rgba(255,255,255,.7)" }}>
                  Clique em uma conversa ao lado para começar.
                </Typography.Text>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <StatusAvatar
                    src={selected.photo}
                    alt={selected.name}
                    status={selected.status}
                  />
                  <div className="leading-tight">
                    <div className="text-slate-100 font-semibold">
                      {selected.name}
                    </div>
                    <div className="text-xs text-slate-400 capitalize">
                      {selected.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="small" ghost icon={<PhoneOutlined />} />
                  <Button size="small" ghost icon={<VideoCameraOutlined />} />
                  <Button size="small" ghost icon={<InfoCircleOutlined />} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm mt-10">
                    Sem mensagens ainda…
                  </div>
                ) : (
                  messages.map((m) => (
                    <MessageBubble key={m.id} me={m.me} text={m.text} />
                  ))
                )}
              </div>
              <div className="px-3 pb-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Input.TextArea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Aa"
                    className="!bg-white/10 !text-slate-100 !border-white/10"
                  />
                  <Button icon={<SendOutlined />} onClick={onSend} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {selected && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#0f1b2b]">
            <div className="h-16 flex items-center gap-3 border-b border-white/10 px-3">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setSelectedId(null)}
              />
              <StatusAvatar
                src={selected.photo}
                alt={selected.name}
                status={selected.status}
              />
              <div className="leading-tight">
                <div className="text-slate-100 font-semibold">
                  {selected.name}
                </div>
                <div className="text-xs text-slate-400 capitalize">
                  {selected.status}
                </div>
              </div>
            </div>

            <div className="flex flex-col h-[calc(100dvh-64px)]">
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm mt-10">
                    Sem mensagens ainda…
                  </div>
                ) : (
                  messages.map((m) => (
                    <MessageBubble key={m.id} me={m.me} text={m.text} />
                  ))
                )}
              </div>
              <div className="px-3 pb-3 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Input.TextArea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    placeholder="Aa"
                    className="!bg-white/10 !text-slate-100 !border-white/10"
                  />
                  <Button icon={<SendOutlined />} onClick={onSend} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
