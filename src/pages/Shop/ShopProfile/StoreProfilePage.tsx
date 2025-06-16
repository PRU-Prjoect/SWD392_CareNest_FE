import React, { useState, useEffect } from 'react';
import { User, Lock, MapPin, Building, Plus, Edit2, Trash2 } from 'lucide-react';

// Interfaces dựa trên ERD
interface Account {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  img_url?: string;
}

interface Shop {
  account_id: number;
  name: string;
  description: string;
  status: string;
  array_working_day: string[];
  working_hours: Record<string, { start: string; end: string; isWorking: boolean }>;
}

interface SubAddress {
  id: number;
  name: string;
  shop_id: number;
  phone: string;
  address_name: string;
  is_default: boolean;
}

const StoreProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'branches'>('info');
  const [account, setAccount] = useState<Account | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [subAddresses, setSubAddresses] = useState<SubAddress[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<SubAddress | null>(null);

  // Trong useEffect của component StoreProfile
useEffect(() => {
  setAccount({
    id: 1,
    username: 'shop_owner',
    email: 'owner@myshop.com',
    role: 'shop_owner',
    is_active: true,
    img_url: '/image/avatar.jpg'
  });

  setShop({
    account_id: 1,
    name: 'Cửa hàng ABC',
    description: 'Chuyên bán đồ gia dụng và điện tử',
    status: 'active',
    array_working_day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    working_hours: {
      Monday: { start: '08:00', end: '18:00', isWorking: true },
      Tuesday: { start: '08:00', end: '18:00', isWorking: true },
      Wednesday: { start: '08:00', end: '18:00', isWorking: true },
      Thursday: { start: '08:00', end: '18:00', isWorking: true },
      Friday: { start: '08:00', end: '18:00', isWorking: true },
      Saturday: { start: '09:00', end: '17:00', isWorking: true },
      Sunday: { start: '09:00', end: '17:00', isWorking: false }
    }
  });

  // ... rest of the data
}, []);


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                {account?.img_url ? (
                  <img src={account.img_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Building className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{shop?.name}</h1>
                <p className="text-teal-100">@{account?.username}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                  {shop?.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'info', label: 'Thông tin cửa hàng', icon: Building },
                { key: 'security', label: 'Bảo mật', icon: Lock },
                { key: 'branches', label: 'Chi nhánh', icon: MapPin }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === key
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && <StoreInfoTab shop={shop} setShop={setShop} />}
            {activeTab === 'security' && (
              <SecurityTab 
                account={account} 
                onChangePassword={() => setShowPasswordModal(true)} 
              />
            )}
            {activeTab === 'branches' && (
              <BranchesTab 
                subAddresses={subAddresses}
                setSubAddresses={setSubAddresses}
                onAddBranch={() => {
                  setEditingBranch(null);
                  setShowBranchModal(true);
                }}
                onEditBranch={(branch) => {
                  setEditingBranch(branch);
                  setShowBranchModal(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <PasswordChangeModal 
          onClose={() => setShowPasswordModal(false)}
          onSave={(data) => {
            console.log('Change password:', data);
            setShowPasswordModal(false);
          }}
        />
      )}

      {showBranchModal && (
        <BranchModal
          branch={editingBranch}
          onClose={() => setShowBranchModal(false)}
          onSave={(branchData) => {
            if (editingBranch) {
              setSubAddresses(prev => prev.map(b => 
                b.id === editingBranch.id ? { ...b, ...branchData } : b
              ));
            } else {
              const newBranch: SubAddress = {
                ...branchData,
                id: Date.now(),
                shop_id: 1
              };
              setSubAddresses(prev => [...prev, newBranch]);
            }
            setShowBranchModal(false);
          }}
        />
      )}
    </div>
  );
};

interface StoreInfoTabProps {
  shop: Shop | null;
  setShop: (shop: Shop) => void;
}

const StoreInfoTab: React.FC<StoreInfoTabProps> = ({ shop, setShop }) => {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    working_hours: shop?.working_hours || {
      Monday: { start: '09:00', end: '17:00', isWorking: true },
      Tuesday: { start: '09:00', end: '17:00', isWorking: true },
      Wednesday: { start: '09:00', end: '17:00', isWorking: true },
      Thursday: { start: '09:00', end: '17:00', isWorking: true },
      Friday: { start: '09:00', end: '17:00', isWorking: true },
      Saturday: { start: '09:00', end: '17:00', isWorking: true },
      Sunday: { start: '09:00', end: '17:00', isWorking: false }
    }
  });

  const workingDays = [
    { key: 'Monday', label: 'Thứ 2' },
    { key: 'Tuesday', label: 'Thứ 3' },
    { key: 'Wednesday', label: 'Thứ 4' },
    { key: 'Thursday', label: 'Thứ 5' },
    { key: 'Friday', label: 'Thứ 6' },
    { key: 'Saturday', label: 'Thứ 7' },
    { key: 'Sunday', label: 'Chủ nhật' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shop) {
      // Tạo array_working_day từ working_hours
      const workingDays = Object.entries(formData.working_hours)
        .filter(([_, hours]) => hours.isWorking)
        .map(([day, _]) => day);
      
      setShop({ 
        ...shop, 
        name: formData.name,
        description: formData.description,
        working_hours: formData.working_hours,
        array_working_day: workingDays
      });
    }
  };

  const toggleWorkingDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          isWorking: !prev.working_hours[day].isWorking
        }
      }
    }));
  };

  const updateWorkingHours = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          [field]: value
        }
      }
    }));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên cửa hàng *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (Không thể thay đổi)
          </label>
          <input
            type="email"
            value="owner@myshop.com"
            disabled
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả cửa hàng
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Mô tả về cửa hàng của bạn..."
        />
      </div>

      {/* Giờ làm việc cho từng ngày */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Giờ làm việc
        </label>
        <div className="space-y-4">
          {workingDays.map(({ key, label }) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`working-${key}`}
                    checked={formData.working_hours[key]?.isWorking || false}
                    onChange={() => toggleWorkingDay(key)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={`working-${key}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
                
                {formData.working_hours[key]?.isWorking && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Mở cửa
                  </span>
                )}
              </div>

              {formData.working_hours[key]?.isWorking && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Giờ mở cửa
                    </label>
                    <select
                      value={formData.working_hours[key]?.start || '09:00'}
                      onChange={(e) => updateWorkingHours(key, 'start', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Giờ đóng cửa
                    </label>
                    <select
                      value={formData.working_hours[key]?.end || '17:00'}
                      onChange={(e) => updateWorkingHours(key, 'end', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      {timeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!formData.working_hours[key]?.isWorking && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Đóng cửa
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nút copy giờ làm việc */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Thao tác nhanh</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const mondayHours = formData.working_hours.Monday;
              const updatedHours = { ...formData.working_hours };
              
              ['Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
                updatedHours[day] = { ...mondayHours };
              });
              
              setFormData(prev => ({ ...prev, working_hours: updatedHours }));
            }}
            className="px-3 py-1.5 text-xs bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors"
          >
            Áp dụng T2 cho T2-T6
          </button>
          
          <button
            type="button"
            onClick={() => {
              const updatedHours = { ...formData.working_hours };
              Object.keys(updatedHours).forEach(day => {
                updatedHours[day] = { start: '09:00', end: '17:00', isWorking: true };
              });
              setFormData(prev => ({ ...prev, working_hours: updatedHours }));
            }}
            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            Đặt tất cả 9:00 - 17:00
          </button>
          
          <button
            type="button"
            onClick={() => {
              const updatedHours = { ...formData.working_hours };
              ['Saturday', 'Sunday'].forEach(day => {
                updatedHours[day].isWorking = false;
              });
              setFormData(prev => ({ ...prev, working_hours: updatedHours }));
            }}
            className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Đóng cửa cuối tuần
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

// Component Tab Bảo mật
interface SecurityTabProps {
  account: Account | null;
  onChangePassword: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ account, onChangePassword }) => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Lock className="w-5 h-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Bảo mật tài khoản</h3>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Thường xuyên thay đổi mật khẩu để bảo vệ tài khoản của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={account?.username || ''}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={account?.email || ''}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Đổi mật khẩu</h4>
            <p className="text-gray-600 text-sm mb-4">
              Cập nhật mật khẩu của bạn để bảo mật tài khoản
            </p>
            <button
              onClick={onChangePassword}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Tab Chi nhánh
interface BranchesTabProps {
  subAddresses: SubAddress[];
  setSubAddresses: (addresses: SubAddress[]) => void;
  onAddBranch: () => void;
  onEditBranch: (branch: SubAddress) => void;
}

const BranchesTab: React.FC<BranchesTabProps> = ({ 
  subAddresses, 
  setSubAddresses, 
  onAddBranch, 
  onEditBranch 
}) => {
  const handleDeleteBranch = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi nhánh này?')) {
      setSubAddresses(subAddresses.filter(branch => branch.id !== id));
    }
  };

  const handleSetDefault = (id: number) => {
    setSubAddresses(subAddresses.map(branch => ({
      ...branch,
      is_default: branch.id === id
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Quản lý chi nhánh</h3>
        <button
          onClick={onAddBranch}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm chi nhánh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subAddresses.map((branch) => (
          <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{branch.name}</h4>
                {branch.is_default && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Mặc định
                  </span>
                )}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEditBranch(branch)}
                  className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{branch.address_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>{branch.phone}</span>
              </div>
            </div>

            {!branch.is_default && (
              <button
                onClick={() => handleSetDefault(branch.id)}
                className="mt-3 w-full px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Đặt làm mặc định
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Modal đổi mật khẩu
interface PasswordChangeModalProps {
  onClose: () => void;
  onSave: (data: { currentPassword: string; newPassword: string }) => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    if (!/[A-Z]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 chữ hoa');
    if (!/[a-z]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
    if (!/[0-9]/.test(password)) errors.push('Mật khẩu phải có ít nhất 1 số');
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(['Mật khẩu xác nhận không khớp']);
      return;
    }

    setErrors([]);
    onSave({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Đổi mật khẩu</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại *
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới *
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu mới *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-red-700 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium shadow-sm"
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal quản lý chi nhánh
interface BranchModalProps {
  branch: SubAddress | null;
  onClose: () => void;
  onSave: (data: Omit<SubAddress, 'id' | 'shop_id'>) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({ branch, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_name: '',
    is_default: false
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        phone: branch.phone,
        address_name: branch.address_name,
        is_default: branch.is_default
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        address_name: '',
        is_default: false
      });
    }
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {branch ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chi nhánh *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="VD: Chi nhánh quận 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="0123456789"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ *
            </label>
            <textarea
              value={formData.address_name}
              onChange={(e) => setFormData({...formData, address_name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nhập địa chỉ chi tiết..."
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Đặt làm chi nhánh mặc định</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium shadow-sm"
            >
              {branch ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreProfile;
