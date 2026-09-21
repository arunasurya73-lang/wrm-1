import React, { useState, useEffect, useRef } from 'react';
import './Navigator.css';

// Default / Mock Delhi NCR Locations
const DEFAULT_LOCATIONS = [
  {
    id: 'your-location',
    name: 'Your location',
    subtext: 'GPS Live Position',
    iconType: 'target',
    lat: 28.6139,
    lng: 77.2090,
    aqi: null
  },
  {
    id: 'connaught-place',
    name: 'Connaught Place',
    subtext: 'Central Delhi',
    iconType: 'recent',
    lat: 28.6315,
    lng: 77.2167,
    aqi: null
  },
  {
    id: 'ito-intersection',
    name: 'ITO Central Intersection',
    subtext: 'Saved in Favorites',
    iconType: 'saved',
    lat: 28.6300,
    lng: 77.2400,
    aqi: { value: 312, severity: 'Severe', levelClass: 'severe' }
  },
  {
    id: 'anand-vihar',
    name: 'Anand Vihar',
    subtext: 'East Delhi ISBT',
    iconType: 'recent',
    lat: 28.6469,
    lng: 77.3160,
    aqi: null
  },
  {
    id: 'dwarka-sec21',
    name: 'Dwarka Sector 21',
    subtext: 'Delhi NCR',
    iconType: 'recent',
    lat: 28.5520,
    lng: 77.0580,
    aqi: null
  }
];

// Travel Modes Configuration
const TRAVEL_MODES = [
  { id: 'directions', label: 'Route', icon: 'directions' },
  { id: 'drive', label: 'Drive', icon: 'drive' },
  { id: 'motorbike', label: 'Two-Wheeler', icon: 'motorbike' },
  { id: 'transit', label: 'Transit', icon: 'transit' },
  { id: 'walk', label: 'Walk', icon: 'walk' },
  { id: 'cycle', label: 'Cycle', icon: 'cycle' }
];

export default function NavigatorPopup({
  isOpen,
  onClose,
  triggerRef,
  locations = DEFAULT_LOCATIONS,
  onSelectOrigin,
  onSelectDestination,
  onCalculateRoute
}) {
  const [startPoint, setStartPoint] = useState('Connaught Place');
  const [destination, setDestination] = useState('ITO Central Intersection');
  const [activeMode, setActiveMode] = useState('motorbike');
  const [activeInputFocus, setActiveInputFocus] = useState('start');
  const [baseMapType, setBaseMapType] = useState('satellite');

  const popupRef = useRef(null);
  const startInputRef = useRef(null);
  const closeBtnRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize Leaflet Map inside React Popup
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (window.L && !mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090],
        zoom: 11,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false
      });

      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    if (mapInstanceRef.current && window.L) {
      const map = mapInstanceRef.current;
      if (map._baseLayerGroup) {
        map.removeLayer(map._baseLayerGroup);
      }

      let newGroup;
      if (baseMapType === 'light') {
        newGroup = window.L.layerGroup([
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }),
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 })
        ]);
      } else if (baseMapType === 'dark') {
        newGroup = window.L.layerGroup([
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }),
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 })
        ]);
      } else {
        newGroup = window.L.layerGroup([
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }),
          window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 })
        ]);
      }

      newGroup.addTo(map);
      map._baseLayerGroup = newGroup;
    }

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen, baseMapType]);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (startInputRef.current) {
        startInputRef.current.focus();
      } else if (popupRef.current) {
        popupRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab' && popupRef.current) {
        const focusableElements = popupRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    if (triggerRef && triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  const handleSwap = () => {
    const temp = startPoint;
    setStartPoint(destination);
    setDestination(temp);
  };

  const handleLocationSelect = (loc) => {
    if (activeInputFocus === 'start') {
      setStartPoint(loc.name);
      if (onSelectOrigin) onSelectOrigin(loc);
      setActiveInputFocus('dest');
    } else {
      setDestination(loc.name);
      if (onSelectDestination) onSelectDestination(loc);
    }
  };

  const handleRouteAction = () => {
    if (onCalculateRoute) {
      onCalculateRoute({
        start: startPoint || 'Connaught Place',
        destination: destination || 'ITO Central Intersection',
        mode: activeMode
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="navigator-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      aria-hidden={!isOpen}
    >
      <div
        ref={popupRef}
        id="navigator-dialog"
        className="navigator-popup navigator-popup-split"
        role="dialog"
        aria-modal="true"
        aria-labelledby="navigator-dialog-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="navigator-header">
          <h2 id="navigator-dialog-title" className="navigator-header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            <span>Delhi NCR Clean-Air Route Navigator</span>
          </h2>
          <div className="navigator-header-right">
            <span className="navigator-live-chip">LIVE TELEMETRY MAP</span>
            <button
              ref={closeBtnRef}
              className="navigator-close-btn"
              onClick={handleClose}
              aria-label="Close route planner"
              title="Close (Esc)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Split Body: Sidebar on Left, Map on Right */}
        <div className="navigator-split-body">
          {/* Controls Pane */}
          <div className="navigator-sidebar-pane">
            {/* Travel Mode Icons Bar */}
            <div className="navigator-modes-bar" role="tablist" aria-label="Travel Modes">
              {TRAVEL_MODES.map((mode) => {
                const isSelected = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    role="tab"
                    aria-selected={isSelected}
                    className={`navigator-mode-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveMode(mode.id)}
                    title={mode.label}
                  >
                    {mode.icon === 'directions' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                    )}
                    {mode.icon === 'drive' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="8" rx="2" /><path d="M5 11l2-5h10l2 5" /><circle cx="7.5" cy="15.5" r="1.5" /><circle cx="16.5" cy="15.5" r="1.5" /></svg>
                    )}
                    {mode.icon === 'motorbike' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="5" cy="16" r="3" /><circle cx="19" cy="16" r="3" /><path d="M12 16h3l3-7h-4l-3 4-2-1" /><line x1="8" y1="9" x2="10" y2="9" /></svg>
                    )}
                    {mode.icon === 'transit' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="15" rx="2" /><path d="M4 11h16M8 15h.01M16 15h.01M6 18l-2 3M18 18l2 3" /></svg>
                    )}
                    {mode.icon === 'walk' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="13" cy="4" r="2" /><path d="M9 20l3-6 2 3 3 5M12 10l-2 4 4 2M15 10l-3-2-3 2" /></svg>
                    )}
                    {mode.icon === 'cycle' && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 11l3-4h3l3 4.5M12 17.5V11" /></svg>
                    )}
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Fields Section */}
            <div className="navigator-inputs-section">
              <div className="navigator-inputs-track" aria-hidden="true">
                <div className="start-dot"></div>
                <div className="track-dots"></div>
                <div className="dest-pin-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>

              <div className="navigator-inputs-fields">
                <div className="navigator-input-wrap">
                  <input
                    ref={startInputRef}
                    type="text"
                    className="navigator-input-field"
                    placeholder="Choose starting point, or click on the map"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    onFocus={() => setActiveInputFocus('start')}
                    aria-label="Starting point"
                  />
                  <span className="navigator-input-icon-end" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>

                <div className="navigator-input-wrap">
                  <input
                    type="text"
                    className="navigator-input-field"
                    placeholder="Choose destination..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setActiveInputFocus('dest')}
                    aria-label="Destination"
                  />
                  <span className="navigator-input-icon-end" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ea4335">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </span>
                </div>
              </div>

              <button
                className="navigator-swap-btn"
                onClick={handleSwap}
                aria-label="Reverse starting point and destination"
                title="Swap Origin & Destination"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <polyline points="17 14 12 9 7 14"></polyline>
                </svg>
              </button>
            </div>

            {/* Quick Select Locations List */}
            <div className="navigator-locations-section" role="region" aria-label="Suggested Delhi NCR Locations">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  className="navigator-location-item"
                  onClick={() => handleLocationSelect(loc)}
                >
                  <div className={`navigator-item-icon ${loc.iconType}`}>
                    {loc.iconType === 'target' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                    {loc.iconType === 'recent' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                    {loc.iconType === 'saved' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    )}
                  </div>

                  <div className="navigator-item-content">
                    <div className="navigator-item-title-row">
                      <span className="navigator-item-name">{loc.name}</span>
                      {loc.aqi && (
                        <span className={`navigator-aqi-badge ${loc.aqi.levelClass || 'severe'}`}>
                          AQI {loc.aqi.value} · {loc.aqi.severity}
                        </span>
                      )}
                    </div>
                    <span className="navigator-item-subtext">{loc.subtext}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="navigator-footer">
              <div className="navigator-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Click on map or list to set points</span>
              </div>

              <button className="navigator-route-btn" onClick={handleRouteAction}>
                <span>Calculate Route</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

            <div className="navigator-map-pane">
            <div className="navigator-map-floating-bar">
              <div className="nav-map-btn-group">
                <button
                  type="button"
                  className={`nav-map-mode-btn ${baseMapType === 'light' ? 'active' : ''}`}
                  onClick={() => setBaseMapType('light')}
                >
                  <span>☀️</span> Light
                </button>
                <button
                  type="button"
                  className={`nav-map-mode-btn ${baseMapType === 'satellite' ? 'active' : ''}`}
                  onClick={() => setBaseMapType('satellite')}
                >
                  <span>🛰️</span> Satellite
                </button>
                <button
                  type="button"
                  className={`nav-map-mode-btn ${baseMapType === 'dark' ? 'active' : ''}`}
                  onClick={() => setBaseMapType('dark')}
                >
                  <span>🌑</span> Dark
                </button>
              </div>
            </div>

            <div ref={mapContainerRef} className="navigator-leaflet-map"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
