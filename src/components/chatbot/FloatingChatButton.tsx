import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface FloatingChatButtonProps {
  open: boolean;
  onClick: () => void;
}

const FloatingChatButton = ({ open, onClick }: FloatingChatButtonProps) => {
  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      className="cinemate-floating-btn"
      onClick={onClick}
      icon={open ? <CloseOutlined /> : <MessageOutlined />}
      aria-label={open ? 'Đóng chat' : 'Mở chat CineMate'}
    />
  );
};

export default FloatingChatButton;
