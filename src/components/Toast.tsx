"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: 'info' | 'error' | 'success' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const colorClasses = {
    info: 'border-blue-500 bg-blue-950',
    error: 'border-red-500 bg-red-950',
    success: 'border-green-500 bg-green-950',
    warning: 'border-yellow-500 bg-yellow-950'
  };

  const iconMap = {
    info: 'ℹ️',
    error: '❌',
    success: '✅',
    warning: '⚠️'
  };

  return (
    <div
      className={`toast-container ${colorClasses[type]}`}
      role="alert"
      onClick={onClose}
    >
      <div className="toast-content">
        <span className="toast-icon">{iconMap[type]}</span>
        <span className="toast-message">{message}</span>
      </div>
      <button onClick={onClose} className="toast-close" aria-label="Fechar">
        ×
      </button>

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          max-width: 500px;
          padding: 1rem 1.5rem;
          border: 3px solid;
          box-shadow: 8px 8px 0px 0px rgba(255, 255, 0, 0.3);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toast-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .toast-message {
          color: var(--color-text-light);
          font-weight: 500;
          flex-grow: 1;
        }

        .toast-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          color: var(--color-text-light);
          font-size: 1.5rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.15s ease;
        }

        .toast-close:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
