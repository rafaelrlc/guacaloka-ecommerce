import { useState, useEffect } from 'react';

const BANNER_IMAGES = [
  {
    url: 'https://media.discordapp.net/attachments/1025173249543393330/1369383483096567919/image.png?ex=681ba940&is=681a57c0&hm=e63befc32b74aab78d9368f132cdad43a27bd4165e6f98203f43bf1625288bb9&=&format=webp&quality=lossless&width=2506&height=1050',
    title: '',
    description: ''
  },
  {
    url: 'https://media.discordapp.net/attachments/1025173249543393330/1369384206064681102/image.png?ex=681ba9ec&is=681a586c&hm=c6b1b2d7a66efc6cf5719f941be9a3f88eedb2d5d673161834db676cc285b30e&=&format=webp&quality=lossless&width=2506&height=1050',
    title: 'Opções',
    description: 'Confira nossas opções'
  },
  // {
  //   url: 'https://media.discordapp.net/attachments/1025173249543393330/1369386000744189972/image.png?ex=681bab98&is=681a5a18&hm=e1b49c203b5044b5fa2d074af39a2b583de9a0b7be08b4dd7764339f85d7d490&=&format=webp&quality=lossless&width=2506&height=1104',
  //   title: 'Ofertas Especiais',
  //   description: 'Aproveite nossas promoções exclusivas'
  // }
];

export function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {BANNER_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-fill"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
              <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
              <p className="text-xl">{image.description}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {BANNER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 