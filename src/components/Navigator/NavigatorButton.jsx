import React from 'react';

/**
 * NavigatorButton Component
 * Trigger button placed directly beside the "Advices" button in the AirSense toolbar.
 *
 * @param {Object} props
 * @param {Function} props.onClick - Click handler to open Navigator popup
 * @param {boolean} props.isOpen - Whether popup is currently open
 * @param {React.Ref} props.buttonRef - Ref forwarded for focus restoration
 */
export default function NavigatorButton({ onClick, isOpen, buttonRef }) {
  return (
    <button
      ref={buttonRef}
      id="btn-navigator"
      className={`nav-action-pill ${isOpen ? 'active' : ''}`}
      title="Delhi NCR Low-AQI Clean Navigator & Route Planner"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="navigator-dialog"
    >
      {/* Route / Navigation Compass Icon */}
      <svg
        className="pill-icon"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
      <span>Navigator</span>
      <span className="pill-badge pill-badge-blue">Route</span>
    </button>
  );
}
