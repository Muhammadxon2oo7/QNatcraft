import { Check } from "lucide-react";

interface ReadReceiptProps {
  isRead: boolean;
}

const ReadReceipt: React.FC<ReadReceiptProps> = ({ isRead }) => (
  <div className="flex items-center">
    {isRead ? (
      <div className="flex">
        <Check size={12} className="text-blue-500" />
        <Check size={12} className="text-blue-500 -ml-1" />
      </div>
    ) : (
      <Check size={12} className="text-gray-400" />
    )}
  </div>
);

export default ReadReceipt;