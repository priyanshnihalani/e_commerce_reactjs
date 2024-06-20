import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './slider.css';
import { Navigation } from 'swiper/modules';

export default function Slider() {
  return (
    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      <SwiperSlide className="relative h-[250px] md:h-[375px] lg:h-[500px]">
        <div className="w-full h-[90%] m-0 bg-red-300 bg-[url('banner1.jpg')] bg-cover bg-center sm:bg-auto sm:bg-top md:bg-[url('banner1.jpg')] md:bg-cover md:bg-center"></div>
      </SwiperSlide>
      <SwiperSlide className="relative h-[250px] md:h-[375px] lg:h-[500px]">
        <div className="w-full h-[90%] bg-red-300 bg-[url('banner2.jpg')] bg-cover bg-center sm:bg-auto sm:bg-top md:bg-[url('banner2.jpg')] md:bg-cover md:bg-center"></div>
      </SwiperSlide>
      <SwiperSlide className="relative h-[250px] md:h-[375px] lg:h-[500px] px-3">
        <div className="w-full h-[90%] bg-red-300 bg-[url('banner3.jpg')] bg-cover bg-center sm:bg-auto sm:bg-top md:bg-[url('banner3.jpg')] md:bg-cover md:bg-center"></div>
      </SwiperSlide>
    </Swiper>
  );
}
