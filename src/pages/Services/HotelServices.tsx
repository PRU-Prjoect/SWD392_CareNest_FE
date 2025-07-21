import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MapPin, Star, Heart, Shield, Check, Grid, List, Map, Clock, PawPrint, Award, Filter } from 'lucide-react';
import { searchHotels } from '../../store/slices/hotelSlice';
import { searchShops } from '../../store/slices/shopSlice';
import { searchSubAddresses } from '../../store/slices/subAddressSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { handleContextualError } from '../../utils/errorHandling';
import { Pagination } from '../../components/ui/Pagination';

// Extended Hotel interface to match our UI needs
interface HotelWithExtras {
  id: string;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
  shop_name?: string; 
  address_name?: string;
  avg_rating?: number;
  avg_price?: number;
  distance?: string;
  services?: string[];
  petTypes?: string[];
  isFavorite?: boolean;
  isVerified?: boolean;
  isTopRated?: boolean;
  quickResponse?: boolean;
}

interface FilterState {
  keyword: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  rating: number | null;
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'name';
  petType: string[];
  services: string[];
  checkInDate: string;
  checkOutDate: string;
  view: 'grid' | 'list' | 'map';
}

const HotelServices: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // State
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: null,
    sortBy: 'rating',
    petType: [],
    services: [],
    checkInDate: '',
    checkOutDate: '',
    view: 'grid'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get hotels from Redux store
  const { hotels, loading, error } = useSelector((state: RootState) => state.hotel);
  const { shops } = useSelector((state: RootState) => state.shop);
  const { subAddresses } = useSelector((state: RootState) => state.subAddress);

  // Fetch hotels on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(searchHotels({}));
        await dispatch(searchShops({}));
        await dispatch(searchSubAddresses({}));
      } catch (error) {
        handleContextualError(error, "fetch");
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Handle error
  useEffect(() => {
    if (error) {
      handleContextualError(error, "fetch");
    }
  }, [error]);

  // Map API hotels to our extended interface with real data from shops and subAddresses
  const extendedHotels = React.useMemo((): HotelWithExtras[] => {
    return hotels.map(hotel => {
      // Find related shop
      const relatedShop = shops.find(shop => shop.account_id === hotel.shop_id);
      
      // Find related address
      const relatedAddress = subAddresses.find(address => address.id === hotel.sub_address_id);

      // Calculate mock rating and price (in a real app, these would come from the API)
      // These can be replaced with real data when available
      const mockRating = 4.5 + Math.random() * 0.5;
      const mockPrice = 350000 + Math.floor(Math.random() * 500000);

      return {
        ...hotel,
        shop_name: relatedShop?.name || 'Shop không rõ',
        address_name: relatedAddress?.address_name || 'Địa chỉ chưa cập nhật',
        avg_rating: mockRating, 
        avg_price: mockPrice,
        distance: (Math.random() * 5).toFixed(1) + 'km',
        services: ['y_te_24_7', 'dua_don', 'grooming', 'training'].slice(0, 2 + Math.floor(Math.random() * 3)),
        petTypes: ['dog', 'cat', 'rabbit'].slice(0, 1 + Math.floor(Math.random() * 3)),
        isFavorite: Math.random() > 0.7,
        isVerified: Math.random() > 0.3,
        isTopRated: mockRating > 4.7,
        quickResponse: Math.random() > 0.5
      };
    });
  }, [hotels, shops, subAddresses]);

  // Filter and sort hotels
  const filteredHotels = React.useMemo(() => {
    return extendedHotels.filter(hotel => {
      // Filter by keyword
      if (filters.keyword && !hotel.name.toLowerCase().includes(filters.keyword.toLowerCase()) && 
          !hotel.description.toLowerCase().includes(filters.keyword.toLowerCase())) {
        return false;
      }
      
      // Filter by location
      if (filters.location && hotel.address_name && 
         !hotel.address_name.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Filter by rating
      if (filters.rating && hotel.avg_rating && hotel.avg_rating < filters.rating) {
        return false;
      }
      
      // Filter by pet type
      if (filters.petType.length > 0 && hotel.petTypes) {
        const hasMatchingPet = filters.petType.some(pet => 
          hotel.petTypes?.includes(pet)
        );
        if (!hasMatchingPet) return false;
      }
      
      // Filter by services
      if (filters.services.length > 0 && hotel.services) {
        const hasMatchingService = filters.services.some(service => 
          hotel.services?.includes(service)
        );
        if (!hasMatchingService) return false;
      }
      
      // Filter by price range
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
  }, [extendedHotels, filters]);

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

  const handleCheckboxChange = (category: 'petType' | 'services', value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[category]];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
    setCurrentPage(1);
  };

  const handleRatingFilter = (rating: number) => {
    setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: null,
      sortBy: 'rating',
      petType: [],
      services: [],
      checkInDate: '',
      checkOutDate: '',
      view: 'grid'
    });
    setCurrentPage(1);
  };

  const handleViewChange = (view: 'grid' | 'list' | 'map') => {
    setFilters(prev => ({ ...prev, view }));
  };

  const toggleFavorite = (id: string) => {
    // In a real implementation, this would call an API to add/remove from favorites
    // For now, we just update the local state for demonstration
    console.log(`Toggle favorite for hotel ${id}`);
  };

  // Helper function to display service name
  const getServiceName = (serviceId: string): string => {
    const services: Record<string, string> = {
      'y_te_24_7': 'Y tế 24/7',
      'dua_don': 'Đưa đón',
      'grooming': 'Grooming',
      'training': 'Training'
    };
    return services[serviceId] || serviceId;
  };

  // Helper function to display pet type name
  const getPetTypeName = (petType: string): string => {
    const types: Record<string, string> = {
      'dog': 'Chó',
      'cat': 'Mèo',
      'rabbit': 'Thỏ'
    };
    return types[petType] || petType;
  };

  // Helper function to render service icons
  const renderServiceIcon = (service: string) => {
    switch(service) {
      case 'y_te_24_7':
        return <Shield className="w-4 h-4 mr-1" />;
      case 'dua_don':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'grooming':
        return <PawPrint className="w-4 h-4 mr-1" />;
      case 'training':
        return <Award className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" />
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 h-96 flex items-center">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Ngôi nhà thứ hai cho boss của bạn</h1>
          <p className="text-white text-xl max-w-2xl mb-8">
            Tìm kiếm nơi an toàn và thoải mái cho thú cưng của bạn trong thời gian bạn vắng nhà
          </p>
          
          {/* Search bar with enhanced UI */}
          <div className="mt-8 bg-white p-2 rounded-lg shadow-lg max-w-4xl">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 relative flex items-center md:border-r md:pr-4 mb-2 md:mb-0">
                <MapPin className="absolute left-3 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Địa điểm"
                  className="w-full pl-10 py-3 focus:outline-none"
                />
              </div>
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Tên khách sạn, mô tả..."
                  className="w-full pl-4 py-3 pr-24 focus:outline-none"
                />
                <button 
                  className="absolute right-0 h-full bg-teal-600 hover:bg-teal-700 text-white px-6 rounded-r-lg"
                  onClick={() => setCurrentPage(1)}
                >
                  Tìm ngay
                </button>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center">
              <span className="font-bold text-xl mr-2">{hotels.length}+</span> khách sạn
            </div>
            <div className="flex items-center">
              <span className="font-bold text-xl mr-2">50,000+</span> thú cưng hài lòng
            </div>
            <div className="flex items-center">
              <span className="font-bold text-xl mr-2">4.8</span> 
              <Star className="w-5 h-5 fill-current text-yellow-300" /> đánh giá
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center">
                <Filter className="w-5 h-5 mr-2" /> Lọc kết quả
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-800"
              >
                Xóa
              </button>
            </div>
            
            <div className="border-t pt-4 pb-3">
              <h4 className="font-medium text-sm mb-2">Khoảng giá (VNĐ)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Thấp nhất"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Cao nhất"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>
            
            <div className="border-t pt-4 pb-3">
              <h4 className="font-medium text-sm mb-2">Loại thú cưng</h4>
              <div className="space-y-2">
                {['dog', 'cat', 'rabbit'].map(pet => (
                  <label key={pet} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.petType.includes(pet)}
                      onChange={() => handleCheckboxChange('petType', pet)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">{getPetTypeName(pet)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 pb-3">
              <h4 className="font-medium text-sm mb-2">Đánh giá</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRatingFilter(star)}
                    className={`flex items-center ${filters.rating === star ? 'text-yellow-500 font-medium' : 'text-gray-600'}`}
                  >
                    <div className="flex">
                      {Array.from({ length: star }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 fill-current ${filters.rating === star ? 'text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">{star}+ sao</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4 pb-3">
              <h4 className="font-medium text-sm mb-2">Dịch vụ</h4>
              <div className="space-y-2">
                {['y_te_24_7', 'dua_don', 'grooming', 'training'].map(service => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.services.includes(service)}
                      onChange={() => handleCheckboxChange('services', service)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex items-center">
                      {renderServiceIcon(service)}
                      <span className="text-sm">{getServiceName(service)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">Ngày</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Check-in</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={filters.checkInDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Check-out</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={filters.checkOutDate}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Results controls */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Khách sạn thú cưng</h2>
                  <p className="text-gray-600">Tìm thấy {filteredHotels.length} khách sạn</p>
                </div>
                <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                  <span className="text-sm text-gray-500 mr-2">Hiển thị:</span>
                  <button 
                    onClick={() => handleViewChange('grid')}
                    className={`p-2 rounded ${filters.view === 'grid' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleViewChange('list')}
                    className={`p-2 rounded ${filters.view === 'list' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleViewChange('map')}
                    className={`p-2 rounded ${filters.view === 'map' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="ml-4 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="price_asc">Giá thấp đến cao</option>
                    <option value="price_desc">Giá cao đến thấp</option>
                    <option value="name">Tên (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                <p className="ml-4 text-lg text-gray-600">Đang tải danh sách khách sạn...</p>
              </div>
            )}

            {/* No results */}
            {!loading && filteredHotels.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
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
            {!loading && filteredHotels.length > 0 && filters.view === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentHotels.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Hotel image with badges */}
                    <div className="h-48 bg-gray-300 relative overflow-hidden">
                      {/* Placeholder for hotel image */}
                      <div className="flex justify-between items-start p-3">
                        <div className="flex space-x-1">
                          {hotel.isVerified && (
                            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md font-medium flex items-center">
                              <Check className="w-3 h-3 mr-1" /> VERIFIED
                            </span>
                          )}
                          {hotel.isTopRated && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md font-medium flex items-center">
                              <Award className="w-3 h-3 mr-1" /> TOP RATED
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => toggleFavorite(hotel.id)}
                          className="bg-white p-1.5 rounded-full shadow"
                        >
                          <Heart className={`w-4 h-4 ${hotel.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-0 right-0 bg-teal-600 text-white px-3 py-1 rounded-tl-lg">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{hotel.avg_rating?.toFixed(1) || '5.0'}</span>
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {hotel.name}
                      </h3>
                      
                      <div className="flex items-center space-x-1 text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{hotel.address_name || 'Địa chỉ chưa cập nhật'} • {hotel.distance} từ bạn</span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-teal-600 font-bold text-lg">
                          từ {hotel.avg_price ? `${hotel.avg_price.toLocaleString('vi-VN')}₫` : 'Liên hệ'}/đêm
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {hotel.petTypes?.map(pet => (
                            <span key={pet} className="inline-flex items-center text-xs">
                              <PawPrint className="w-3 h-3 mr-1" /> {getPetTypeName(pet)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Còn {hotel.available_room}/{hotel.total_room} phòng
                        </div>
                        
                        {hotel.quickResponse && (
                          <div className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3 mr-1" /> Phản hồi nhanh
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {hotel.services?.map(service => (
                          <div 
                            key={service}
                            className="flex items-center text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {renderServiceIcon(service)}
                            {getServiceName(service)}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center gap-2">
                        <button
                          onClick={() => handleViewHotel(hotel.id)}
                          className="px-4 py-2 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors text-sm flex-1 text-center"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => handleViewHotel(hotel.id)}
                          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm flex-1 text-center"
                        >
                          Đặt ngay - {(hotel.avg_price || 0).toLocaleString('vi-VN').slice(0, -3)}k
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hotel list view */}
            {!loading && filteredHotels.length > 0 && filters.view === 'list' && (
              <div className="space-y-4">
                {currentHotels.map(hotel => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex"
                  >
                    {/* Hotel image */}
                    <div className="w-1/4 bg-gray-300 relative">
                      {hotel.isVerified && (
                        <div className="absolute top-2 left-2 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md font-medium">
                          <Check className="w-3 h-3 inline mr-1" /> VERIFIED
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-teal-600 text-white px-2 py-0.5 rounded-lg">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{hotel.avg_rating?.toFixed(1) || '5.0'}</span>
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-3/4 p-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {hotel.name}
                        </h3>
                        <button 
                          onClick={() => toggleFavorite(hotel.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Heart className={`w-5 h-5 ${hotel.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{hotel.address_name || 'Địa chỉ chưa cập nhật'} • {hotel.distance} từ bạn</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {hotel.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {hotel.petTypes?.map(pet => (
                          <span key={pet} className="inline-flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full">
                            <PawPrint className="w-3 h-3 mr-1" /> {getPetTypeName(pet)}
                          </span>
                        ))}
                        
                        {hotel.services?.slice(0, 2).map(service => (
                          <span 
                            key={service}
                            className="inline-flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full"
                          >
                            {renderServiceIcon(service)}
                            {getServiceName(service)}
                          </span>
                        ))}
                        
                        <div className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" /> Còn {hotel.available_room} phòng
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-teal-600 font-bold">
                          {hotel.avg_price ? `${hotel.avg_price.toLocaleString('vi-VN')}₫/đêm` : 'Liên hệ'}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewHotel(hotel.id)}
                            className="px-4 py-1.5 border border-teal-600 text-teal-600 rounded-md hover:bg-teal-50 transition-colors text-sm"
                          >
                            Xem chi tiết
                          </button>
                          <button
                            onClick={() => handleViewHotel(hotel.id)}
                            className="px-4 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm"
                          >
                            Đặt ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Map view */}
            {!loading && filteredHotels.length > 0 && filters.view === 'map' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Bản đồ khách sạn sẽ hiển thị ở đây</p>
                    <p className="text-sm">Tính năng đang phát triển</p>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default HotelServices; 