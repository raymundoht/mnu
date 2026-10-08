import { useRef, useState, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  sizes = '100vw',
  width,
  height,
  priority = false,
  objectFit = 'cover',
  ...props
}) => {
  const imgRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const webpSrc = shouldLoad ? src : undefined;

  return (
    <picture ref={imgRef}>
      {shouldLoad && (
        <source
          srcSet={webpSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      <img
        src={shouldLoad ? src : undefined}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ objectFit }}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
