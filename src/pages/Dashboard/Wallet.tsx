import { useState } from 'react';
import WalletModal from './component/Wallet/walletModal';
import WalletHistoryModal from './component/Wallet/walletHistory';
import WalletImage from '@/assets/wallet-svgrepo-com.svg';

const WalletPage = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Ví của bạn</h1>

      <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-w-5xl flex gap-6">
        {/* Left */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="font-bold text-lg">NGUYEN VAN A</h2>
            <p className="text-gray-600">Mã tài khoản: <span className="text-blue-600 cursor-pointer">CF450T</span></p>
          </div>

          <div className="flex items-center space-x-2 text-gray-800">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span>Số dư hiện tại trong tài khoản: <span className="text-blue-600 font-semibold">100.000₫</span></span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Xem lại lịch sử giao dịch
            </button>
            <button
              onClick={() => setShowTopUp(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Nạp tiền
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={WalletImage}
            alt="Wallet illustration"
            className="w-3/4 max-w-xs object-contain"
          />
        </div>
      </div>

      {showTopUp && <WalletModal onClose={() => setShowTopUp(false)} />}
      {showHistory && <WalletHistoryModal onClose={() => setShowHistory(false)} />}
    </div>
  );
};

export default WalletPage;
