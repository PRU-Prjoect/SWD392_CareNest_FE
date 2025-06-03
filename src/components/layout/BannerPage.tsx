import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  button?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/image/illustration.svg",
    title: "Quản lý thời gian hiệu quả với Pomodoro",
    description: "Sử dụng Pomodoro để tập trung, tăng năng suất và hiệu quả công việc.",
    button: "Bắt đầu ngay"
  },
  {
    id: 2,
    image: "/image/hinh2-removebg-preview.png",
    title: "Pomodoro là gì?",
    description: `Kỹ thuật Pomodoro là một phương pháp quản lý thời gian được phát triển bởi Francesco Cirillo vào cuối những năm 1980. Phương pháp này sử dụng bộ đếm thời gian để chia công việc thành các khoảng thời gian, thường là 25 phút, được gọi là "Pomodoros", xen kẽ với các khoảng nghỉ ngắn. Sau mỗi 4 Pomodoros, bạn sẽ có một khoảng nghỉ dài hơn. Mục tiêu là tăng sự tập trung và năng suất, đồng thời giảm sự mệt mỏi về tinh thần.`
  }
];

export default function BannerPage() {
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      modules={[Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={slide.id || idx}>
          <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-16 py-12 h-auto md:h-[80vh]">
            <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
              <img
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left px-4 md:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-[600px] mx-auto md:mx-0">
                {slide.description}
              </p>
              {slide.button && (
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition text-base sm:text-lg">
                  {slide.button}
                </button>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}







