import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  className = "",
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 ${className}`}
        aria-label={alt}
      >
        <div className="text-white/30 text-sm">{alt}</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
