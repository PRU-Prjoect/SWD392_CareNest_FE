import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Search, MapPin, Star, Sliders } from 'lucide-react';
import { searchHotels } from '../../store/slices/hotelSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { handleContextualError } from '../../utils/errorHandling';
import { Pagination } from '../../components/ui/Pagination';

// Định nghĩa interfaces
interface Hotel {
  id: string;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
  shop_name?: string; // Tên cửa hàng
  address_name?: string; // Địa chỉ
  avg_rating?: number; // Đánh giá trung bình
}

interface FilterState {
  keyword: string;
  minPrice: string;
  maxPrice: string;
  rating: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'name';
}

const HotelServices: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // State
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    minPrice: '',
    maxPrice: '',
    rating: null,
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get hotels from Redux store
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotel);

  // Fetch hotels on component mount and when filters change
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Chỉ lấy các khách sạn đang hoạt động
        await dispatch(searchHotels({ isActive: true }));
      } catch (error) {
        handleContextualError(error, "fetch");
      }
    };
    
    fetchHotels();
  }, [dispatch]);

  // Handle error
  useEffect(() => {
    if (error) {
      handleContextualError(error, "fetch");
    }
  }, [error]);

  // Filter and sort hotels
  const filteredHotels = React.useMemo(() => {
    return hotels.filter(hotel => {
      // Filter by keyword
      if (filters.keyword && !hotel.name.toLowerCase().includes(filters.keyword.toLowerCase()) && 
          !hotel.description.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      
      // Filter by rating
      if (filters.rating && hotel.avg_rating && hotel.avg_rating < filters.rating) {
        return false;
      }
      
      // Filter by price range (giả sử có giá trung bình)
      if (hotel.avg_price) {
        if (filters.minPrice && parseFloat(filters.minPrice) > hotel.avg_price) {
          return false;
        }
        if (filters.maxPrice && parseFloat(filters.maxPrice) < hotel.avg_price) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return (a.avg_price || 0) - (b.avg_price || 0);
        case 'price_desc':
          return (b.avg_price || 0) - (a.avg_price || 0);
        case 'rating':
          return (b.avg_rating || 0) - (a.avg_rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [hotels, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const currentHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewHotel = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRatingFilter = (rating: number) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      minPrice: '',
      maxPrice: '',
      rating: null,
      sortBy: 'rating'
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 h-72 flex items-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Khách sạn thú cưng</h1>
          <p className="text-white text-xl max-w-2xl">
            Tìm kiếm nơi an toàn và thoải mái cho thú cưng của bạn trong thời gian bạn vắng nhà
          </p>
          
          {/* Search bar */}
          <div className="mt-8 flex">
            <div className="relative flex-grow">
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Tìm kiếm khách sạn thú cưng..."
                className="w-full px-5 py-4 rounded-l-lg focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 rounded-r-lg flex items-center"
            >
              <Sliders className="w-5 h-5 mr-2" />
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white shadow-md p-6 container mx-auto -mt-6 rounded-lg mb-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="name">Tên (A-Z)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá thấp nhất (VNĐ)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="100,000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá cao nhất (VNĐ)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="1,000,000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
              <div className="flex items-center space-x-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRatingFilter(star)}
                    className={`p-2 rounded ${filters.rating === star ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {star}⭐
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mr-2"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Results summary */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Khách sạn thú cưng</h2>
            <p className="text-gray-600">Tìm thấy {filteredHotels.length} khách sạn</p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            <p className="ml-4 text-lg text-gray-600">Đang tải danh sách khách sạn...</p>
          </div>
        )}

        {/* No results */}
        {!loading && filteredHotels.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Không tìm thấy khách sạn nào</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Thử thay đổi tiêu chí tìm kiếm hoặc bỏ bộ lọc để xem nhiều kết quả hơn
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Hotel grid */}
        {!loading && filteredHotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHotels.map(hotel => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Hình ảnh khách sạn (placeholder) */}
                <div className="h-48 bg-gray-300 relative">
                  <div className="absolute bottom-0 left-0 bg-teal-600 text-white px-3 py-1 rounded-tr-lg">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{hotel.avg_rating?.toFixed(1) || '5.0'}</span>
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="text-teal-600 font-bold">
                      {hotel.avg_price ? `${hotel.avg_price.toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                    </div>
                  </div>

                  <div className="flex items-start space-x-1 text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{hotel.address_name || 'Địa chỉ chưa cập nhật'}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">{hotel.available_room}</span>
                      <span className="text-gray-500"> / {hotel.total_room} phòng trống</span>
                    </div>
                    <button
                      onClick={() => handleViewHotel(hotel.id)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredHotels.length > itemsPerPage && (
          <div className="mt-10 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelServices; 