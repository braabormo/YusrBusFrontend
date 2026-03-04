import React, { useState } from "react";

interface ImageMagnifierProps {
  src: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  zoomLevel?: number;
}

export function ImageMagnifier({
  src,
  className,
  width = "100%",
  height = "100%",
  zoomLevel = 2.5, // How much to zoom in
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [xy, setXY] = useState({ x: 0, y: 0 });

  const magnifierSize = 150; // Size of the glass in pixels

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: width,
        height: height,
      }}
    >
      <img
        src={src}
        className="h-full w-full object-cover rounded-md border"
        alt="preview"
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={(e) => {
          // Calculate cursor position relative to the image
          const elem = e.currentTarget;
          const { top, left, width, height } = elem.getBoundingClientRect();
          const x = e.pageX - left - window.scrollX;
          const y = e.pageY - top - window.scrollY;
          setXY({ x, y });
        }}
      />

      {showMagnifier && (
        <div
          style={{
            display: "block",
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            // Move the glass with the cursor, centering it
            top: `${xy.y - magnifierSize / 2}px`,
            left: `${xy.x - magnifierSize / 2}px`,
            opacity: "1",
            border: "1px solid lightgray",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            // Calculate zoom position
            backgroundSize: `${Number(width === "100%" ? 100 : width) * zoomLevel}% ${
              Number(height === "100%" ? 100 : height) * zoomLevel
            }%`,
            backgroundPositionX: `${-xy.x * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-xy.y * zoomLevel + magnifierSize / 2}px`,
          }}
          className="z-50 rounded-full shadow-2xl"
        />
      )}
    </div>
  );
}