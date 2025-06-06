import SearchBar, { type SearchField } from "../components/common/SearchBar";

const AppHeaderForAdmin: React.FC = () => {
  // Định nghĩa các trường tìm kiếm
  const searchFields: SearchField[] = [
    {
      name: "keyword",
      label: "",
      placeholder: "Nhập từ khóa tìm kiếm...",
      type: "text",
      width: "w-1/2",
    },

    {
      name: "location",
      label: "",
      placeholder: "Chọn khu vực",
      type: "select",
      width: "w-1/4",
      options: [
        { value: "hanoi", label: "Hà Nội" },
        { value: "hcm", label: "TP.HCM" },
        { value: "danang", label: "Đà Nẵng" },
        { value: "other", label: "Khác" },
      ],
    },
  ];

  // Xử lý khi người dùng tìm kiếm
  const handleSearch = (searchValues: Record<string, string>) => {
    console.log("Giá trị tìm kiếm:", searchValues);
    // TODO: Xử lý logic tìm kiếm ở đây
    // Ví dụ: gọi API, filter dữ liệu, navigate...
  };

  return (
    <header className="bg-[#2A9D8F] shadow-md">
      <div className="container mx-auto px-4 py-4">
        {/* Logo và navigation */}
        <div className="flex items-center justify-between mb-4">
          {/* Navigation menu */}
          <nav className="hidden md:flex space-x-6"></nav>
        </div>

        {/* SearchBar component */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-4xl">
            <SearchBar
              fields={searchFields}
              onSearch={handleSearch}
              buttonLabel="Tìm kiếm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeaderForAdmin;
