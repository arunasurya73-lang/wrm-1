// src/demos/default.tsx
import React from 'react';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxComponent />
      <div className="osmo-credits text-center py-8 text-sm text-muted-foreground">
        <p className="osmo-credits__p">
          Resource by <a target="_blank" rel="noopener noreferrer" href="https://www.osmo.supply/" className="osmo-credits__p-a underline text-primary hover:text-primary/80">Osmo</a>
        </p>
      </div>
    </>
  );
}
