import { useState, useEffect, useRef } from 'react';
import './Hero.css';

const YOUTUBE_VIDEO_ID = 'KIBfEONu9zA';

export default function Hero() {
  const canvasRef = useRef(null);
  const glitchRef = useRef(null);
  const playerRef = useRef(null);
  const playerHostRef = useRef(null);
  const userPausedRef = useRef(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Array of banner images (configured for up to 20 paths)
  const bannerImages = [
    '/images/banners/banner-1.jpg',
    '/images/banners/banner-2.jpg',
    '/images/banners/banner-3.jpg',
    '/images/banners/banner-4.jpg',
    '/images/banners/banner-5.jpg',
    '/images/banners/banner-6.png',
    // ----------------------------------------------------------------
    // Space for up to 20 images. Add your new image file paths below:
    // ----------------------------------------------------------------
    // '/images/banners/banner-7.jpg',
    // '/images/banners/banner-8.jpg',
    // '/images/banners/banner-9.jpg',
    // '/images/banners/banner-10.jpg',
    // '/images/banners/banner-11.jpg',
    // '/images/banners/banner-12.jpg',
    // '/images/banners/banner-13.jpg',
    // '/images/banners/banner-14.jpg',
    // '/images/banners/banner-15.jpg',
    // '/images/banners/banner-16.jpg',
    // '/images/banners/banner-17.jpg',
    // '/images/banners/banner-18.jpg',
    // '/images/banners/banner-19.jpg',
    // '/images/banners/banner-20.jpg',
  ];

  /* Particle system */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for interactive particles
    const heroEl = canvas.closest('.hero');
    heroEl?.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.3;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.45 + 0.05;
        const r = Math.random();
        if (r > 0.65) {
          this.color = [230, 57, 70];
        } else if (r > 0.3) {
          this.color = [67, 97, 238];
        } else {
          this.color = [114, 9, 183];
        }
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Subtle mouse interaction — particles slightly attracted
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          this.x += dx * 0.0008;
          this.y += dy * 0.0008;
          this.size = this.baseSize + (1 - dist / 200) * 1.5;
        } else {
          this.size = this.baseSize;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const count = window.innerWidth < 768 ? 40 : 90;
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.07;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(114, 9, 183, ${opacity})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* Periodic glitch animation trigger */
  useEffect(() => {
    const interval = setInterval(() => {
      const el = glitchRef.current;
      if (el) {
        el.classList.add('glitching');
        setTimeout(() => el.classList.remove('glitching'), 500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* Auto-swipe Left-to-Right automatically every 3.8s */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
    }, 3800);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  useEffect(() => {
    let cancelled = false;

    const attemptPlay = () => {
      if (!playerRef.current || userPausedRef.current) return;
      try {
        playerRef.current.setVolume(100);
        playerRef.current.playVideo();
      } catch {}
    };

    const syncPlayerState = (state) => {
      if (!window.YT?.PlayerState) return;
      setIsPlaying(state === window.YT.PlayerState.PLAYING);
    };

    const mountPlayer = () => {
      if (cancelled || playerRef.current || !playerHostRef.current || !window.YT?.Player) {
        return;
      }

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            setIsPlayerReady(true);
            attemptPlay();
          },
          onStateChange: (event) => {
            if (cancelled) return;
            syncPlayerState(event.data);

            if (
              window.YT?.PlayerState &&
              event.data === window.YT.PlayerState.UNSTARTED
            ) {
              setIsPlaying(false);
            }

            if (
              window.YT?.PlayerState &&
              event.data === window.YT.PlayerState.PAUSED
            ) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            if (cancelled) return;
            setIsPlaying(false);
          },
        },
      });
    };

    const loadYoutubePlayer = () => {
      if (window.YT?.Player) {
        mountPlayer();
        return;
      }

      const existingScript = document.querySelector('script[data-youtube-player="true"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.dataset.youtubePlayer = 'true';
        document.body.appendChild(script);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        mountPlayer();
      };
    };

    loadYoutubePlayer();

    const unlockPlayback = () => {
      attemptPlay();
    };

    window.addEventListener('pointerdown', unlockPlayback, { passive: true });
    window.addEventListener('keydown', unlockPlayback);
    document.addEventListener('visibilitychange', unlockPlayback);

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', unlockPlayback);
      window.removeEventListener('keydown', unlockPlayback);
      document.removeEventListener('visibilitychange', unlockPlayback);
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, []);

  const handleMusicToggle = () => {
    if (!playerRef.current || !window.YT?.PlayerState) return;

    if (isPlaying) {
      userPausedRef.current = true;
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      return;
    }

    userPausedRef.current = false;
    playerRef.current.playVideo();
  };

  return (
    <section className="hero" id="home">
      {/* Premium layered background */}
      <div className="hero-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-noise"></div>
        <div className="hero-bg-grid"></div>
      </div>

      {/* Floating gradient orbs */}
      <div className="hero-orb hero-orb--1"></div>
      <div className="hero-orb hero-orb--2"></div>
      <div className="hero-orb hero-orb--3"></div>
      <div className="hero-orb hero-orb--4"></div>

      {/* Light ray effect behind logo */}
      <div className="hero-rays"></div>

      <div className="hero-scanlines"></div>
      <canvas ref={canvasRef} className="particles-canvas"></canvas>

      <div className="hero-content">
        {/* Cinematic crew banner carousel with ambient reflection glow */}
        <div className="hero-banner-wrapper" ref={glitchRef}>
          <div className="hero-badge">
            <span className="dot"></span>
            it's TVA Bitches
          </div>

          <div className="hero-carousel-container">
            <div 
              className="hero-carousel-track" 
              style={{ transform: `translateX(calc(-${currentSlide} * (100% / 5 + 16px / 5)))` }}
            >
              {[...bannerImages, ...bannerImages].map((src, idx) => (
                <div className="hero-carousel-slide" key={idx}>
                  <img
                    src={src}
                    alt={`TVA Crew Banner ${(idx % bannerImages.length) + 1}`}
                    className="hero-banner-img"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ambient reflection glow layer */}
          <div 
            className="hero-banner-glow" 
            style={{ backgroundImage: `url(${bannerImages[currentSlide]})` }}
            aria-hidden="true"
          ></div>

          {/* Carousel dots indicators */}
          <div className="hero-carousel-dots">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="hero-tagline">
          Legacy is built, <em>not earned.</em><br />
          Ruling the kingdom with power, loyalty, and fear for the past 5 years.
        </p>
        <div className="hero-music-mini">
          <div className={`hero-music-wave ${isPlaying ? 'is-active' : ''}`} aria-hidden="true">
            {Array.from({ length: 8 }).map((_, idx) => (
              <span
                key={idx}
                className="hero-music-wave__bar"
                style={{ animationDelay: `${idx * 0.12}s` }}
              ></span>
            ))}
          </div>
          <button
            type="button"
            className={`hero-music-mini__button ${isPlaying ? 'is-playing' : ''}`}
            onClick={handleMusicToggle}
            disabled={!isPlayerReady}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            title={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1"></rect>
                <rect x="14" y="5" width="4" height="14" rx="1"></rect>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            )}
          </button>
          <div className="hero-music-player-shell" aria-hidden="true">
            <div ref={playerHostRef}></div>
          </div>
        </div>
        <div className="hero-buttons">
          <a href="#highlights" className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Watch Highlights
          </a>
          <a href="#members" className="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Meet the Crew
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="mouse"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
