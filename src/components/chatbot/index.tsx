import { useMemo, useState } from 'react';
import FloatingChatButton from '@/components/chatbot/FloatingChatButton';
import ChatWindow from '@/components/chatbot/ChatWindow';
import '@/styles/chatbot.css';

const SESSION_STORAGE_KEY = 'cinemate_chat_session';

const getOrCreateSessionId = (): string => {
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  // Tạo 1 lần cho cả vòng đời tab trình duyệt, khớp với TTL 30' phía backend
  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  return (
    <div className="cinemate-chat-root">
      {open && <ChatWindow sessionId={sessionId} onClose={() => setOpen(false)} />}
      <FloatingChatButton open={open} onClick={() => setOpen((prev) => !prev)} />
    </div>
  );
};

export default ChatbotWidget;
