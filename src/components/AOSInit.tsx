"use client";

import { useEffect } from "react";

export default function AOSInit() {
  useEffect(() => {
    // Importa o AOS CSS
    const aosCSS = document.createElement('link');
    aosCSS.rel = 'stylesheet';
    aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    document.head.appendChild(aosCSS);

    // Carrega o AOS JS
    const aosScript = document.createElement('script');
    aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    aosScript.async = true;
    aosScript.onload = () => {
      if (typeof window !== 'undefined' && (window as any).AOS) {
        (window as any).AOS.init({
          duration: 700,
          once: true,
          offset: 100,
          easing: 'ease-out-cubic',
        });
      }
    };
    document.body.appendChild(aosScript);

    return () => {
      // Cleanup
      if (aosCSS.parentNode) {
        aosCSS.parentNode.removeChild(aosCSS);
      }
      if (aosScript.parentNode) {
        aosScript.parentNode.removeChild(aosScript);
      }
    };
  }, []);

  return null;
}
