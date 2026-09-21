import React, { useState, useRef } from 'react';
import NavigatorButton from './NavigatorButton.jsx';
import NavigatorPopup from './NavigatorPopup.jsx';

/**
 * Complete Navigator Feature Component
 * Integrates trigger button and Google Maps style route planner dialog.
 */
export default function Navigator({
  locations,
  onSelectOrigin,
  onSelectDestination,
  onCalculateRoute
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <NavigatorButton
        onClick={handleOpen}
        isOpen={isOpen}
        buttonRef={buttonRef}
      />
      <NavigatorPopup
        isOpen={isOpen}
        onClose={handleClose}
        triggerRef={buttonRef}
        locations={locations}
        onSelectOrigin={onSelectOrigin}
        onSelectDestination={onSelectDestination}
        onCalculateRoute={onCalculateRoute}
      />
    </>
  );
}
