import { useEffect, useRef, useState } from 'react';
import { Button, Input, Spin, Typography } from 'antd';
import { SendOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat.types';
import { chatService } from '@/services/chat.service';
import ChatMessageBubble from '@/components/chatbot/ChatMessageBubble';
import QuickReplyButtons from '@/components/chatbot/QuickReplyButtons';

const { Text } = Typography;

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Chào bạn! Mình là CineMate 🎬. Bạn muốn xem phim gì hôm nay?',
};

interface ChatWindowProps {
  sessionId: string;
  onClose: () => void;
}

const ChatWindow = ({ sessionId, onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Luôn cuộn xuống tin nhắn mới nhất
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage(sessionId, text);
      // res là IBackendRes<ChatResponseDTO> -> lấy res.data mới đúng payload thật
      const { reply, movies } = res.data;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, movies }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, mình đang gặp sự cố kết nối. Bạn thử lại sau ít phút nhé!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cinemate-chat-window">
      <div className="cinemate-chat-header">
        <div className="cinemate-chat-header__title">
          <RobotOutlined />
          <Text strong className="cinemate-chat-header__text">
            CineMate Assistant
          </Text>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label="Đóng chat"
        />
      </div>

      <div className="cinemate-chat-body" ref={bodyRef}>
        {messages.map((msg, idx) => (
          <ChatMessageBubble key={idx} message={msg} />
        ))}
        {loading && (
          <div className="cinemate-msg-row cinemate-msg-row--assistant">
            <Spin size="small" />
          </div>
        )}
      </div>

      <QuickReplyButtons disabled={loading} onSelect={(text) => handleSend(text)} />

      <div className="cinemate-chat-footer">
        <Input
          placeholder="Nhập câu hỏi về phim..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => handleSend()}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          disabled={loading || !input.trim()}
          onClick={() => handleSend()}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
