import { useContext, useRef, useState } from "react";
import { AppContext } from "../AppContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import IconPrev from "/src/assets/svg/swiper-prev.svg";
import IconNext from "/src/assets/svg/swiper-next.svg";

const CategorySlideshow = (props) => {
  const { contextData } = useContext(AppContext);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!props.categories || props.categories.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const onSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="providers-carousel_providersCarouselContainer" style={{ position: 'relative' }}>
      {!isBeginning && (
        <button
          onClick={handlePrev}
          className="providers-carousel_providerSlideIcon"
        >
          <img src={IconPrev} />
        </button>
      )}

      <Swiper
        ref={swiperRef}
        onSlideChange={onSlideChange}
        className="providers-carousel_swiper"
        spaceBetween={10}
        slidesPerView={20}
        watchOverflow={true}
        observer={true}
        observeParents={true}
        breakpoints={{
          320: {
            slidesPerView: 4
          },
          576: {
            slidesPerView: 6
          },
          640: {
            slidesPerView: 8
          },
          768: {
            slidesPerView: 12
          },
          1024: {
            slidesPerView: 15
          },
          1600: {
            slidesPerView: 18
          },
          1601: {
            slidesPerView: 20
          },
        }}
      >
        {props.categories.map((category, index) => (
          <SwiperSlide key={`category-${category.id || index}`}>
            <div className="providers-carousel_providerItem">
              <div className="providers-carousel_providerItemIcon">
                <img
                  alt={`${category.name} icon`}
                  loading="lazy"
                  width="20"
                  height="20"
                  decoding="async"
                  src={contextData.cdnUrl + category.image_local}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span className="providers-carousel_providerItemLabel">{category.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isEnd && (
        <button
          onClick={handleNext}
          className="providers-carousel_providerSlideIcon slider-next-button"
        >
          <img src={IconNext} />
        </button>
      )}
    </div>
  )
}

export default CategorySlideshow