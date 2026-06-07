import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    title: "Customize your in-app experience and live your way.",
    videoSrc: "https://wqsaewmgjhlikynheqmo.supabase.co/storage/v1/object/public/hostel-media/gemini_generated_video_7483cdff.mp4",
  },
  {
    id: 2,
    title: "Get insights, tours, and bookings. All in the new SKYCOBE app.",
    videoSrc: "https://wqsaewmgjhlikynheqmo.supabase.co/storage/v1/object/public/hostel-media/gemini_generated_video_befef30a.mp4",
  }
];

const BackgroundVideo = ({ src, isActive, onEnded }: { src: string, isActive: boolean, onEnded?: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Play interrupted", e));
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full h-full object-cover opacity-80"
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
      poster={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3C/svg%3E`}
    />
  );
};

export function Landing() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const slideIndex = Math.round(scrollTop / clientHeight);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const handleVideoEnded = () => {
    if (!containerRef.current) return;
    const nextSlideIndex = (currentSlide + 1) % SLIDES.length;
    const { clientHeight } = containerRef.current;
    
    containerRef.current.scrollTo({
      top: nextSlideIndex * clientHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black text-white overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          {/* S Logo */}
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#c0843c] to-[#1e2936] flex items-center justify-center font-bold text-xs" style={{ fontFamily: 'Georgia, serif' }}>
            S
          </div>
          <span className="text-[13px] font-medium text-white/80">Welcome to SKYCOBE</span>
        </div>
        
        {/* Skip button if needed, but we can put Log In here */}
        <button 
          onClick={() => navigate('/login')}
          className="text-[13px] font-medium text-white/80 pointer-events-auto hover:text-white"
        >
          Log In
        </button>
      </div>

      {/* Snap Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-10"
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          
          return (
            <div key={slide.id} className="w-full h-full snap-start relative flex items-center justify-center">
              
              {/* Background Video */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
                {/* 
                  HOW TO ADD VIDEOS:
                  1. Create a "videos" folder inside your "public" directory.
                  2. Name your videos "slide1.mp4", "slide2.mp4", etc.
                  3. The <video> element will automatically load from "/videos/slide1.mp4".
                */}
                <BackgroundVideo
                  src={slide.videoSrc}
                  isActive={isActive}
                  onEnded={isActive ? handleVideoEnded : undefined}
                  key={slide.id}
                />
                
                {/* Fallback gradient if video is not present or loading */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
                )}
              </div>

              {/* Slide Content */}
              <div className="relative z-10 w-full h-full flex flex-col justify-start px-6 pt-24 pb-32">
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-[400px]"
                    >
                      <h1 className="text-[2.2rem] sm:text-[3rem] font-bold leading-[1.1] tracking-tight">{slide.title}</h1>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination & Bottom Action - Fixed Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-10 z-50 flex flex-col gap-6 pointer-events-none">
        
        {/* Pagination Dots */}
        <div className="flex gap-2 w-full max-w-[400px] mx-auto">
          {SLIDES.map((_, index) => (
            <div 
              key={index}
              className={`h-1 flex-1 rounded-full bg-white/20 overflow-hidden relative`}
            >
              <div 
                className={`absolute inset-y-0 left-0 bg-white transition-all duration-500 ease-out`}
                style={{ width: currentSlide === index ? '100%' : currentSlide > index ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        
        {/* Main CTA */}
        <div className="w-full max-w-[400px] mx-auto pointer-events-auto">
          <button
            onClick={() => navigate('/signup')}
            className="w-full py-4 rounded-[14px] bg-white text-black font-bold text-[16px] shadow-[0_4px_24px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-transform"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
