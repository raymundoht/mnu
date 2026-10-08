/* ─── Global Styles ────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    :root {
      --cursor-size: 20px;
    }

    @media (min-width: 768px) and (pointer: fine) {
      body:has(#custom-cursor),
      body:has(#custom-cursor) * { cursor: none !important; }
    }

    @media (max-width: 767px), (pointer: coarse) {
      #custom-cursor { display: none !important; }
      * { cursor: auto !important; }
    }

    .noise::before {
      content: "";
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
      opacity: 0.04;
      pointer-events: none;
      z-index: 9998;
    }

    #custom-cursor {
      width: var(--cursor-size);
      height: var(--cursor-size);
      background: #fff;
      border-radius: 50%;
      transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease;
      mix-blend-mode: difference;
      pointer-events: none;
    }

    #custom-cursor.cursor-active {
      --cursor-size: 80px;
      background-color: #fff;
    }

    .reveal {
      opacity: 0;
      transform: translateY(35px);
      transition: all 1.2s cubic-bezier(0.215, 0.610, 0.355, 1);
    }

    .reveal.active {
      opacity: 1;
      transform: translateY(0);
    }

    .text-outline {
      -webkit-text-stroke: 1.5px black;
      color: transparent;
    }

    .dark-section .text-outline {
      -webkit-text-stroke: 1.5px white;
    }

    .specialty-card {
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .specialty-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 60px -15px rgba(0,0,0,0.08);
    }

    .noise {
      position: relative;
      isolation: isolate;
    }

    @keyframes scrollLeft {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }

    @keyframes scrollRight {
      0% { transform: translate3d(-50%, 0, 0); }
      100% { transform: translate3d(0, 0, 0); }
    }

    .animate-scroll-left {
      animation: scrollLeft 45s linear infinite;
    }

    .animate-scroll-right {
      animation: scrollRight 45s linear infinite;
    }

    .carousel-container::before,
    .carousel-container::after {
      content: "";
      position: absolute;
      top: 0;
      width: 15%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }

    .carousel-container::before {
      left: 0;
      background: linear-gradient(to right, white 20%, transparent);
    }

    .carousel-container::after {
      right: 0;
      background: linear-gradient(to left, white 20%, transparent);
    }

    html {
      scroll-behavior: smooth;
    }

    .project-card {
      position: relative;
      overflow: hidden;
      background: #f9f9f9;
      transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .project-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .project-card:hover .project-image {
      transform: scale(1.05);
    }

    .hero-image-parallax {
      transition: transform 0.3s ease-out;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .animate-scale-up {
      animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .specialty-hero-image {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
    }

    .specialty-hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 8s cubic-bezier(0.2, 1, 0.3, 1);
    }

    .specialty-hero-image:hover img {
      transform: scale(1.08);
    }
  `}</style>
);

export default GlobalStyles;
