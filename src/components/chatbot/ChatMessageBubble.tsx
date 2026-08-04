import { Avatar, Typography } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/types/chat.types';
import MovieSuggestionCard from '@/components/chatbot/MovieSuggestionCard';

const { Text } = Typography;

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`cinemate-msg-row ${isUser ? 'cinemate-msg-row--user' : 'cinemate-msg-row--assistant'}`}>
      {!isUser && <Avatar size="small" icon={<RobotOutlined />} className="cinemate-msg-avatar" />}
      <div className="cinemate-msg-content">
        <div className={`cinemate-msg-bubble ${isUser ? 'cinemate-msg-bubble--user' : 'cinemate-msg-bubble--assistant'}`}>
          <Text>{message.content}</Text>
        </div>
        {message.movies && message.movies.length > 0 && (
          <div className="cinemate-msg-movies">
            {message.movies.map((movie) => (
              <MovieSuggestionCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      {isUser && <Avatar size="small" icon={<UserOutlined />} className="cinemate-msg-avatar" />}
    </div>
  );
};

export default ChatMessageBubble;
