import { Button } from 'antd';
import { QUICK_REPLIES } from '@/types/chat.types';

interface QuickReplyButtonsProps {
  disabled?: boolean;
  onSelect: (text: string) => void;
}

const QuickReplyButtons = ({ disabled, onSelect }: QuickReplyButtonsProps) => {
  return (
    <div className="cinemate-quick-replies">
      {QUICK_REPLIES.map((label) => (
        <Button key={label} size="small" disabled={disabled} onClick={() => onSelect(label)}>
          {label}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplyButtons;
