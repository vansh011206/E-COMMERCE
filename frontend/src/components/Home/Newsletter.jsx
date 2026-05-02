import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
    toast.success('Welcome! Check your email for a special offer 🎉');
  };

  return (
    <section
      className="py-16 px-6"
      style={{ background: '#0A0A0A' }}
    >
      <div className="max-w-[560px] mx-auto text-center">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-white/70 mb-3">
          Exclusive Members Only
        </p>
        <h2 className="font-heading text-4xl text-white font-bold tracking-tight mb-4">
          JOIN THE CLUB
        </h2>
        <p className="font-body text-[15px] text-white/80 leading-relaxed mb-8">
          Get early access to sales, new arrivals and exclusive style tips delivered straight to your inbox.
        </p>

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-[2] h-[52px] bg-white/15 border border-white/30 sm:rounded-l rounded-t sm:rounded-tr-none text-white placeholder-white/50 px-4 font-body text-sm outline-none focus:border-white/60 transition-colors duration-200"
              />
              <button
                type="submit"
                className="flex-1 h-[52px] bg-white text-black font-heading text-[13px] uppercase tracking-[0.1em] font-semibold sm:rounded-r rounded-b sm:rounded-bl-none hover:bg-white/90 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
            <p className="font-body text-[12px] text-white/50 mt-4">
              No spam, unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="py-4 animate-fadeIn">
            <p className="font-body text-lg text-white font-medium">
              ✓ You're in! Welcome to the club.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(Newsletter);
