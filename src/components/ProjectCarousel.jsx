import LazyVideo from './LazyVideo';
import { CheckCircle2 } from './icons';

const ProjectCarousel = ({
  title,
  number,
  subtitle,
  heading,
  description,
  features,
  posts = [],
  reels = [],
  historias = [],
  bgColor = "bg-neutral-100",
  addToRefs,
  singleImage
}) => {
  const padArray = (arr, targetLen = 5) => {
    if (!arr || arr.length === 0) return [];
    let result = [...arr];
    while (result.length < targetLen) {
      result = [...result, ...arr];
    }
    return result.slice(0, targetLen);
  };

  const displayPosts = [...padArray(posts), ...padArray(posts)];
  const displayReels = [...padArray(reels), ...padArray(reels)];
  const baseHistorias = historias.length > 0 ? historias : posts;
  const displayHistorias = [...padArray(baseHistorias), ...padArray(baseHistorias)];

  return (
    <section className={`py-12 md:py-16 px-6 ${bgColor} relative z-10 border-t border-neutral-200`}>
      <div className="max-w-7xl mx-auto reveal" ref={addToRefs}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

          {/* INFO SIDE */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-neutral-900">{title}</h3>
              {number && <span className="text-3xl md:text-5xl lg:text-6xl font-black text-amber-500">{number}</span>}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">{subtitle}</p>

            <div className="max-w-2xl">
              <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-neutral-900 mb-3">{heading}</h4>
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light mb-6">{description}</p>

              {features && features.length > 0 && (
                <div className="grid grid-cols-2 gap-3 text-xs font-bold uppercase tracking-widest text-neutral-800 mb-8">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-amber-500" /> {feat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CAROUSEL SIDE */}
          <div className="lg:w-1/2 w-full flex justify-center">
            {singleImage ? (
              <div className="w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl">
                <img loading="lazy" src={singleImage} alt={title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full max-w-lg h-[500px] md:h-[600px] overflow-hidden relative">
                <div className="grid grid-cols-3 gap-2 md:gap-4 h-full">

                  {/* COLUMNA 1: Posts (Scroll hacia abajo) */}
                  <div className="flex flex-col justify-end gap-2 md:gap-4 animate-scroll-vertical-down h-max">
                    {displayPosts.map((post, idx) => (
                      <div key={`p-${idx}`} className="w-full flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <img loading="lazy" src={post} alt="Post" className="w-full h-auto object-contain rounded-none" />
                      </div>
                    ))}
                  </div>

                  {/* COLUMNA 2: Reels (Scroll hacia arriba) */}
                  <div className="flex flex-col gap-2 md:gap-4 animate-scroll-vertical-up h-max">
                    {displayReels.map((reel, idx) => (
                      <div key={`r-${idx}`} className="w-full aspect-[9/16] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <LazyVideo src={reel} className="w-full h-full object-cover opacity-90 hover:opacity-100 rounded-none" />
                      </div>
                    ))}
                  </div>

                  {/* COLUMNA 3: Historias (Scroll hacia abajo) */}
                  <div className="flex flex-col justify-end gap-2 md:gap-4 animate-scroll-vertical-down h-max">
                    {displayHistorias.map((historia, idx) => (
                      <div key={`h-${idx}`} className="w-full aspect-[9/16] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <img loading="lazy" src={historia} alt="Historia" className="w-full h-full object-cover rounded-none" />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
