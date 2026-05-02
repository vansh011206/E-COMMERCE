import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerRef = useRef(null);
  const parallaxRefs = useRef([]);

  // Mouse Parallax Effect using requestAnimationFrame for performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let requestRef;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Calculate mouse position relative to center (-1 to 1)
      mouseX = (clientX / innerWidth - 0.5) * 2;
      mouseY = (clientY / innerHeight - 0.5) * 2;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        const depth = parseFloat(el.getAttribute('data-depth') || '10');
        const moveX = currentX * depth;
        const moveY = currentY * depth;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      requestRef = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  // Framer Motion Variants
  const fadeSlideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full max-w-[100vw] min-h-[calc(100vh-64px)] flex items-center overflow-x-hidden bg-white px-6 md:px-12 py-12 md:py-0"
    >
      {/* Background Subtle Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 relative z-10">
        
        {/* ─── LEFT SIDE CONTENT ─── */}
        <motion.div 
          className="flex flex-col justify-center order-2 md:order-1 pt-10 md:pt-0"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div variants={fadeSlideUp} className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-black"></span>
            <span className="font-body text-[11px] uppercase tracking-[0.3em] font-semibold text-black">
              New Season // 2025
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={fadeSlideUp}
            className="font-heading text-5xl md:text-7xl lg:text-[80px] font-bold text-black leading-[1.05] tracking-tight mb-6 uppercase"
          >
            Redefine <br />
            <span className="text-[#333]">Your Style</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeSlideUp}
            className="font-body text-[#666] text-base md:text-lg max-w-[420px] mb-10 leading-relaxed"
          >
            Explore 2025's most curated editorial collections. Minimalist design meets uncompromising premium quality.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeSlideUp} className="flex flex-wrap gap-4 mb-14">
            <button className="bg-black text-white font-heading text-[13px] uppercase tracking-[0.1em] font-medium px-10 py-4 hover:bg-[#222] transition-colors duration-300 will-change-transform">
              Shop Now
            </button>
            <button className="bg-transparent border border-[#CCC] text-black font-heading text-[13px] uppercase tracking-[0.1em] font-medium px-10 py-4 hover:border-black transition-colors duration-300 will-change-transform">
              Explore →
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            variants={fadeSlideUp}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-[13px] text-[#666]"
          >
            <div><strong className="font-mono text-black text-[15px]">200+</strong> Brands</div>
            <div className="w-[1px] h-4 bg-[#E5E5E5] hidden sm:block"></div>
            <div><strong className="font-mono text-black text-[15px]">50K+</strong> Products</div>
            <div className="w-[1px] h-4 bg-[#E5E5E5] hidden sm:block"></div>
            <div><strong className="font-mono text-black text-[15px]">10M+</strong> Happy Customers</div>
          </motion.div>
        </motion.div>

        {/* ─── RIGHT SIDE VISUAL ─── */}
        <div className="relative flex items-center justify-center order-1 md:order-2 h-[55vh] md:h-auto perspective-[1000px] w-full">
          
          {/* Mobile Image (Hidden on Desktop) */}
          <div className="md:hidden w-full h-full p-2 pt-6">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
              <img 
                src="https://images.pexels.com/photos/5622888/pexels-photo-5622888.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Family Shopping Fashion"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-white text-sm uppercase tracking-wider">New Season</p>
                    <p className="font-body text-white/80 text-xs mt-0.5">Curated Collection</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-heading font-bold text-sm shadow-lg">
                    60%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop 3D Visual (Hidden on Mobile) */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
            {/* Background large subtle circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-[1px] border-black scale-110"></div>
              <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border-[1px] border-black scale-90"></div>
            </div>

            {/* 3D Main Element (Large Typography) */}
            <div 
              className="absolute z-10 pointer-events-auto"
              ref={(el) => parallaxRefs.current[0] = el}
              data-depth="25"
              style={{ willChange: 'transform' }}
            >
              <h2 
                className="font-heading font-black text-[70px] sm:text-[100px] md:text-[180px] lg:text-[220px] text-[#222] select-none uppercase leading-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.05)]"
                style={{ transform: 'rotateY(-15deg) rotateX(5deg)' }}
              >
                SALE
              </h2>
            </div>

            {/* Floating Geometric Shape (Circle) */}
            <div 
              className="absolute z-20 top-1/4 right-1/4 pointer-events-auto"
              ref={(el) => parallaxRefs.current[1] = el}
              data-depth="-15"
              style={{ willChange: 'transform' }}
            >
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex items-center justify-center animate-[floatY_8s_ease-in-out_infinite]"
              >
                <span className="text-white font-heading font-bold text-lg md:text-xl tracking-wider">60%</span>
              </div>
            </div>

            {/* Stacked Offer Cards (Glassmorphism) */}
            <div 
              className="absolute bottom-0 md:bottom-10 left-0 md:-left-10 z-30 group pointer-events-auto"
              ref={(el) => parallaxRefs.current[2] = el}
              data-depth="10"
              style={{ willChange: 'transform' }}
            >
              <div className="relative w-48 md:w-56 h-20">
                {/* Card 3 (Bottom) */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md border border-[#E5E5E5] p-4 shadow-lg transform -rotate-6 translate-y-4 group-hover:-rotate-12 group-hover:translate-y-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase text-[#888]">Free Shipping</span>
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </div>
                
                {/* Card 2 (Middle) */}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md border border-[#E5E5E5] p-4 shadow-xl transform -rotate-3 translate-y-2 group-hover:-rotate-6 group-hover:translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between">
                  <span className="font-heading font-bold text-xs uppercase text-[#555]">Buy 2 Get 1 Free</span>
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </div>
                
                {/* Card 1 (Top) */}
                <div className="absolute inset-0 bg-white backdrop-blur-xl border border-[#CCC] p-4 shadow-2xl transform rotate-0 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between">
                  <span className="font-heading font-bold text-[13px] uppercase tracking-wider text-black">Flat 60% Off</span>
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                </div>
              </div>
            </div>

            {/* Floating Abstract Element */}
            <div 
              className="absolute top-10 left-10 md:left-20 z-0 opacity-20"
              ref={(el) => parallaxRefs.current[3] = el}
              data-depth="5"
              style={{ willChange: 'transform' }}
            >
              <div className="w-40 h-40 border border-black transform rotate-45 animate-[rotateSlow_20s_linear_infinite]"></div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Required custom CSS animations injected here */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </section>
  );
};

export default memo(HeroSection);
