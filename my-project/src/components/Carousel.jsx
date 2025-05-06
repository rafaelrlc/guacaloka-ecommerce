import { useState, useEffect } from 'react';

const BANNER_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
    title: 'Ofertas Especiais',
    description: 'Aproveite nossas promoções exclusivas'
  },
  {
    url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2070',
    title: 'Novidades',
    description: 'Confira nossos lançamentos'
  },
  {
    url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2070',
    title: 'Frete Grátis',
    description: 'Em compras acima de R$ 100'
  }
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
    <div className="relative w-full h-[400px] overflow-hidden mb-8">
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
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
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