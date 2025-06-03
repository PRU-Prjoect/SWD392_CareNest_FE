import React, { useState } from 'react';
// import MomoIcon from'@/assets/iconMomo.svg'
// import ZaloPayIcon from'@/assets/zalopay-seeklogo.svg';
import MomoPayQR from'@/assets/momoPay.jpg';
import ZaloPayQR from'@/assets/ZaloPay.jpg'; 

type WalletModalProps = {
  onClose: () => void;
};

const paymentMethods = [
  { id: 'momo', name: 'Momo', icon: '💸' },
  { id: 'visa', name: 'Visa Card', icon: '💳' },
  { id: 'zalopay', name: 'ZaloPay', icon: '🟦' },
];

const quickAmounts = [50000, 100000, 200000, 500000];

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');

  const handleConfirm = () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount <= 0) {
      alert('Vui lòng quét mã & nhập thông tin hợp lệ!');
      return;
    }

    alert(`Nạp ${amount.toLocaleString()}đ bằng ${paymentMethod}`);
    onClose();
  };

  const renderPaymentUI = () => {
    switch (paymentMethod) {
      case 'momo':
        return (
          <div className="flex flex-col items-center mt-4">
            <img src={MomoPayQR} alt="QR Momo" className="w-40 h-40 rounded shadow-md" />
            <p className="mt-2 text-sm text-gray-600">Hãy quét mã qr trên để thực hiện thanh toán</p>
          </div>
        );
      case 'visa':
        return (
          <div className="mt-4 space-y-3">
            <input type="text" placeholder="Số thẻ" className="input-style" />
            <input type="text" placeholder="Tên chủ thẻ" className="input-style" />
            <div className="flex space-x-2">
              <input type="text" placeholder="MM/YY" className="input-style w-1/2" />
              <input type="text" placeholder="CVV" className="input-style w-1/2" />
            </div>
          </div>
        );
      case 'zalopay':
        return (
          <div className="flex flex-col items-center mt-4">
            <img src={ZaloPayQR} alt="QR ZaloPay" className="w-40 h-40 rounded shadow-md" />
            <p className="mt-2 text-sm text-gray-600">Hãy quét mã qr trên để thực hiện thanh toán</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Nạp tiền vào tài khoản</h2>

        {/* Bảng giá */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount('');
              }}
              className={`border px-4 py-2 rounded text-center font-medium ${
                selectedAmount === amt ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'
              }`}
            >
              {amt.toLocaleString()}đ
            </button>
          ))}
        </div>

        {/* Nhập số tiền */}
        <input
          type="number"
          placeholder="Hoặc nhập số tiền (VND)"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
          }}
        />

        {/* Chọn phương thức thanh toán */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Chọn phương thức thanh toán:</p>
          <div className="flex space-x-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex-1 border rounded px-3 py-2 flex items-center justify-center space-x-2 ${
                  paymentMethod === method.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'
                }`}
              >
                <span>{method.icon}</span>
                <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Giao diện từng loại thanh toán */}
        {renderPaymentUI()}

        {/* Nút hành động */}
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Hủy
          </button>
          <button onClick={handleConfirm} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
