import { useEffect, useState } from 'react';

const Carousel = ({ images, interval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const autoPlayInterval = setInterval(nextImage, interval);
    return () => {
      clearInterval(autoPlayInterval);
    };
  }, [interval]);

  return (
    <div id="carousel-container" style={{ width: '100%', height: '100vh' }}>
      {images.map((e, index) => (
        <div
          key={index}
          style={{
            ...ImageContainer,
            visibility: activeIndex == index ? 'visible' : 'hidden',
          }}
        >
          <img
            // style={{ objectFit: 'cover' }}
            title={`img_${index}`}
            src={e}
            width={'100%'}
            height={'100%'}
          />
        </div>
      ))}
    </div>
  );
};

const ImageContainer = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export default Carousel;
