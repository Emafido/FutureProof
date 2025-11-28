import React, { useState, useEffect, useRef } from 'react';

const QuotesCarousel = () => {
  const quotes = [
    {
      text: "Most people overestimate what they can do in one year and underestimate what they can do in ten.",
      author: "Bill Gates",
      image: "/bill-gates.jpg"
    },
    {
      text: "The journey is the reward.",
      author: "Steve Jobs",
      image: "/steve-jobs.jpg"
    },
    {
      text: "There are no shortcuts. Hard work, patience, and experiments are what get you there.",
      author: "Jeff Bezos",
      image: "/jeff-bezos.jpg"
    },
    {
      text: "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
      author: "Mark Zuckerberg",
      image: "/mark-zuckerberg.jpg"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      image: "/steve-jobs.jpg"
    },
    {
      text: "Your most unhappy customers are your greatest source of learning.",
      author: "Bill Gates",
      image: "/bill-gates.jpg"
    },
    {
      text: "If you're not stubborn, you'll give up on experiments too soon. And if you're not flexible, you'll pound your head against the wall.",
      author: "Jeff Bezos",
      image: "/jeff-bezos.jpg"
    },
    {
      text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
      author: "Mark Zuckerberg",
      image: "/mark-zuckerberg.jpg"
    },
    {
      text: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
      author: "Bill Gates",
      image: "/bill-gates.jpg"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      image: "/steve-jobs.jpg"
    },
    {
      text: "What's dangerous is not to evolve.",
      author: "Jeff Bezos",
      image: "/jeff-bezos.jpg"
    },
    {
      text: "The biggest successes come from having the freedom to fail.",
      author: "Mark Zuckerberg",
      image: "/mark-zuckerberg.jpg"
    },
    {
      text: "It's fine to celebrate success but it is more important to heed the lessons of failure.",
      author: "Bill Gates",
      image: "/bill-gates.jpg"
    },
    {
      text: "Stay hungry, stay foolish.",
      author: "Steve Jobs",
      image: "/steve-jobs.jpg"
    },
    {
      text: "Work hard, have fun, make history.",
      author: "Jeff Bezos",
      image: "/jeff-bezos.jpg"
    },
    {
      text: "The goal is to be a utility that is as ubiquitous and useful as possible.",
      author: "Mark Zuckerberg",
      image: "/mark-zuckerberg.jpg"
    },
    {
      text: "We all need people who will give us feedback. That's how we improve.",
      author: "Bill Gates",
      image: "/bill-gates.jpg"
    },
    {
      text: "Design is not just what it looks like and feels like. Design is how it works.",
      author: "Steve Jobs",
      image: "/steve-jobs.jpg"
    },
    {
      text: "If you want to be successful in business, you have to create more than you consume.",
      author: "Jeff Bezos",
      image: "/jeff-bezos.jpg"
    },
    {
      text: "The best companies are started not because the founder wanted a company but because the founder wanted to change the world.",
      author: "Mark Zuckerberg",
      image: "/mark-zuckerberg.jpg"
    }
  ];

  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const [itemsToShow, setItemsToShow] = useState(4);
  const scrollPositionRef = useRef(0);

  // Handle responsive items to show
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, []);

  // Duplicate quotes for seamless infinite scroll
  const duplicatedQuotes = [...quotes, ...quotes, ...quotes];

  // Infinite scroll animation
  useEffect(() => {
    if (!carouselRef.current) return;

    let animationFrameId;
    const carousel = carouselRef.current;
    const scrollWidth = carousel.scrollWidth / 3; // Since we duplicated 3 times

    const animateScroll = () => {
      if (isPaused) {
        // Save current position when paused
        scrollPositionRef.current = carousel.scrollLeft;
        animationFrameId = requestAnimationFrame(animateScroll);
        return;
      }

      // Continue from saved position
      let scrollPosition = scrollPositionRef.current;
      
      scrollPosition += 0.5; // Adjust speed here
      
      // If we're near the end of the duplicated content, reset to middle
      if (scrollPosition >= scrollWidth * 2 - carousel.offsetWidth) {
        scrollPosition = scrollWidth;
      }
      
      carousel.scrollLeft = scrollPosition;
      scrollPositionRef.current = scrollPosition;
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    // Start from the middle set if not already set
    if (scrollPositionRef.current === 0) {
      scrollPositionRef.current = scrollWidth;
      carousel.scrollLeft = scrollWidth;
    }

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused, itemsToShow]);

  return (
    <section className="px-6 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Wisdom from Those Who Built the Future
        </h2>
        
        {/* Reduced gradient overlays for smooth edges */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {duplicatedQuotes.map((quote, index) => (
              <div 
                key={`${quote.author}-${index}`}
                className="shrink-0 text-center p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100"
                style={{ 
                  width: `calc(${100 / itemsToShow}% - ${(itemsToShow - 1) * 24 / itemsToShow}px)`
                }}
              >
                {/* Your original image code - unchanged */}
                <div className="w-35 h-35 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={quote.image} 
                    alt={quote.author}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show initials as fallback
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg hidden">
                    {quote.author.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                
                <div className="text-4xl text-blue-200 mb-4">"</div>
                <p className="text-gray-700 italic mb-6 text-sm md:text-base leading-relaxed min-h-20 flex items-center justify-center">
                  {quote.text}
                </p>
                <div className="border-t border-blue-100 pt-4">
                  <p className="text-gray-900 font-semibold text-sm md:text-base">
                    {quote.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default QuotesCarousel;