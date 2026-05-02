import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// Lightweight inline SVG social icons (lucide-react removed brand icons)
const SocialIcons = {
  Instagram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
  ),
  Twitter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.7 16h4.3L8.3 4H4z"/><path d="M4 20l6.8-8M20 4l-6.8 8"/></svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  Youtube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
  ),
};

const COLUMNS = [
  {
    heading: 'COMPANY',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Blog', to: '/blog' },
      { label: 'Sustainability', to: '/sustainability' },
    ],
  },
  {
    heading: 'HELP',
    links: [
      { label: 'FAQs', to: '/faq' },
      { label: 'Shipping & Delivery', to: '/shipping' },
      { label: 'Returns & Exchange', to: '/returns' },
      { label: 'Track Order', to: '/track' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Size Guide', to: '/size-guide' },
    ],
  },
  {
    heading: 'SHOP',
    links: [
      { label: 'Men', to: '/shop?category=Men' },
      { label: 'Women', to: '/shop?category=Women' },
      { label: 'Kids', to: '/shop?category=Kids' },
      { label: 'Sale', to: '/shop?discount=30' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'All Brands', to: '/shop' },
    ],
  },
];

const SOCIALS = [
  { icon: SocialIcons.Instagram, label: 'Instagram', href: '#' },
  { icon: SocialIcons.Twitter, label: 'Twitter', href: '#' },
  { icon: SocialIcons.Facebook, label: 'Facebook', href: '#' },
  { icon: SocialIcons.Youtube, label: 'YouTube', href: '#' },
];

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-heading text-xl font-bold uppercase tracking-[0.15em] text-white mb-4 block">
              Vogue Vault
            </Link>
            <p className="font-body text-[13px] text-[#666] leading-relaxed mb-6 max-w-[240px]">
              Style is a way to say who you are without speaking.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#666] hover:text-white transition-colors duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-heading text-[11px] uppercase text-[#999] tracking-[0.15em] mb-5 font-semibold">
                {heading}
              </h4>
              <ul className="space-y-0">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="font-body text-[13px] text-[#666] hover:text-white transition-colors duration-200 leading-[2.4] block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1C1C1C] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[12px] text-[#555]">
            © 2025 VOGUE VAULT. All rights reserved.
          </p>

          <div className="flex items-center gap-3 font-body text-[12px] text-[#555]">
            <span>Visa</span>
            <span>·</span>
            <span>Mastercard</span>
            <span>·</span>
            <span>UPI</span>
            <span>·</span>
            <span>PayPal</span>
            <span>·</span>
            <span>COD</span>
          </div>

          <div className="flex items-center gap-4 font-body text-[12px] text-[#555]">
            <Link to="/privacy" className="hover:text-[#999] transition-colors duration-200">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-[#999] transition-colors duration-200">Terms</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:text-[#999] transition-colors duration-200">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
