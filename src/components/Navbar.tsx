"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="bg-secondary border-b-4 border-primary p-4 fixed w-full z-50"
      data-aos="fade-down"
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <a href="#hero" className="navbar-brand-container" onClick={closeMobileMenu}>
          <img
            src="/logo/markdown-assembler-nobg.png"
            alt="Markdown Assembler"
            className="navbar-logo"
            style={{ height: '50px', width: 'auto', display: 'block' }}
          />
          {/* <span className="navbar-brand-text">
            Markdown<span className="text-primary">{'//'}</span>Assembler
          </span> */}
        </a>
        <div className="hidden md:flex space-x-2">
          <a href="#hero" className="nav-link">./inicio</a>
          <a href="#features" className="nav-link">./features</a>
          <a href="#how-it-works" className="nav-link">./docs</a>
          <a href="#try-it-now" className="nav-link">./app</a>
        </div>
        <a href="#try-it-now" className="btn-primary hidden md:inline-block uppercase">
          Start
        </a>
        <button
          className="md:hidden text-primary focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu md:hidden">
          <a href="#hero" className="mobile-nav-link" onClick={closeMobileMenu}>./inicio</a>
          <a href="#features" className="mobile-nav-link" onClick={closeMobileMenu}>./features</a>
          <a href="#how-it-works" className="mobile-nav-link" onClick={closeMobileMenu}>./docs</a>
          <a href="#try-it-now" className="mobile-nav-link" onClick={closeMobileMenu}>./app</a>
          <a href="#try-it-now" className="mobile-cta-link" onClick={closeMobileMenu}>
            Start →
          </a>
        </div>
      )}

      <style jsx>{`
        .navbar-brand-container {
          display: flex;
          align-items: center;
          text-decoration: none;
          opacity: 1;
        }

        .navbar-logo {
          height: 50px;
          width: auto;
          filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.3));
          transition: all 0.3s ease;
        }

        .navbar-brand-container:hover .navbar-logo {
          filter: drop-shadow(0 0 15px rgba(255, 255, 0, 0.5));
          transform: scale(1.05);
        }

        /* .navbar-brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          color: var(--color-text-light);
        } */

        @media (max-width: 768px) {
          .navbar-logo {
            height: 40px;
          }

          /* .navbar-brand-text {
            font-size: 1.125rem;
          } */
        }

        .nav-link {
          color: var(--color-text-light);
          font-weight: 700;
          padding: 0.5rem 1rem;
          transition: all 0.15s ease-out;
          border: 3px solid transparent;
        }
        .nav-link:hover {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          border-color: var(--color-secondary);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
          transform: translate(-4px, -4px);
        }
        .btn-primary {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          font-weight: 700;
          padding: 0.75rem 2rem;
          border: 3px solid var(--color-secondary);
          box-shadow: 6px 6px 0px 0px var(--color-secondary);
          transition: all 0.15s ease-out;
        }
        .btn-primary:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--color-secondary);
          border-bottom: 4px solid var(--color-primary);
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 0.5rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-nav-link {
          color: var(--color-text-light);
          font-weight: 700;
          padding: 1rem;
          border: 3px solid transparent;
          transition: all 0.15s ease-out;
          text-align: center;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link:active {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          border-color: var(--color-secondary);
        }

        .mobile-cta-link {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          font-weight: 700;
          padding: 1rem;
          border: 3px solid var(--color-secondary);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
          transition: all 0.15s ease-out;
          text-align: center;
          text-transform: uppercase;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .mobile-cta-link:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px var(--color-secondary);
        }
      `}</style>
    </nav>
  );
}
