import React from 'react';

type HistoryItem = {
  id: number;
  date: string;
  time: string;
  amount: string;
  type: string;
  method: string;
  transactionId: string;
};

const dummyHistory: HistoryItem[] = [
  {
    id: 1,
    date: '2025-06-01',
    time: '14:35',
    amount: '+50,000₫',
    type: 'Nạp tiền',
    method: 'Momo',
    transactionId: 'MOMO123456789',
  },
  {
    id: 2,
    date: '2025-05-20',
    time: '09:20',
    amount: '-20,000₫',
    type: 'Thanh toán',
    method: 'ZaloPay',
    transactionId: 'ZALO0987654321',
  },
];

type WalletHistoryModalProps = {
  onClose: () => void;
};

const WalletHistoryModal: React.FC<WalletHistoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Lịch sử giao dịch</h2>

        <div className="overflow-y-auto max-h-[400px] divide-y">
          {dummyHistory.map((item) => (
            <div key={item.id} className="py-4 px-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
              <div>
                <p className="font-semibold text-gray-800">{item.type}</p>
                <p className="text-gray-500">{item.date} lúc {item.time}</p>
              </div>
              <div className="flex flex-col items-end md:items-start">
                <p className={`font-bold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount}
                </p>
                <p className="text-gray-500">Phương thức: {item.method}</p>
                <p className="text-gray-400 text-xs break-all">Mã GD: {item.transactionId}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletHistoryModal;
