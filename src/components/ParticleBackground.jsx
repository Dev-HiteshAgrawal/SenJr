import './ParticleBackground.css';

// ─── Particle data — 30 glowing dots ─────────────
// Each particle: left%, size(px), duration(s), delay(s), color variant, animation
const PARTICLES = [
  { left:  2, size: 3, dur: 18, delay:  0, color: 'p-saffron', anim: 'floatUp'      },
  { left:  6, size: 2, dur: 22, delay:  3, color: 'p-white',   anim: 'floatUpDrift' },
  { left: 10, size: 4, dur: 15, delay:  7, color: 'p-mint',    anim: 'floatUp'      },
  { left: 14, size: 2, dur: 25, delay:  1, color: 'p-purple',  anim: 'floatUpDrift' },
  { left: 18, size: 3, dur: 20, delay:  9, color: 'p-white',   anim: 'floatUp'      },
  { left: 22, size: 2, dur: 17, delay:  4, color: 'p-pink',    anim: 'floatUpDrift' },
  { left: 26, size: 4, dur: 23, delay: 11, color: 'p-saffron', anim: 'floatUp'      },
  { left: 30, size: 2, dur: 19, delay:  2, color: 'p-mint',    anim: 'floatUpDrift' },
  { left: 34, size: 3, dur: 28, delay:  6, color: 'p-white',   anim: 'floatUp'      },
  { left: 38, size: 2, dur: 16, delay: 13, color: 'p-purple',  anim: 'floatUp'      },
  { left: 42, size: 4, dur: 21, delay:  0, color: 'p-saffron', anim: 'floatUpDrift' },
  { left: 46, size: 2, dur: 26, delay:  8, color: 'p-white',   anim: 'floatUp'      },
  { left: 50, size: 3, dur: 18, delay: 15, color: 'p-mint',    anim: 'floatUpDrift' },
  { left: 54, size: 2, dur: 24, delay:  3, color: 'p-pink',    anim: 'floatUp'      },
  { left: 58, size: 4, dur: 20, delay: 10, color: 'p-purple',  anim: 'floatUpDrift' },
  { left: 62, size: 2, dur: 17, delay:  5, color: 'p-white',   anim: 'floatUp'      },
  { left: 66, size: 3, dur: 29, delay: 12, color: 'p-saffron', anim: 'floatUpDrift' },
  { left: 70, size: 2, dur: 22, delay:  1, color: 'p-mint',    anim: 'floatUp'      },
  { left: 74, size: 4, dur: 16, delay:  7, color: 'p-white',   anim: 'floatUpDrift' },
  { left: 78, size: 2, dur: 25, delay: 14, color: 'p-purple',  anim: 'floatUp'      },
  { left: 82, size: 3, dur: 19, delay:  4, color: 'p-pink',    anim: 'floatUpDrift' },
  { left: 86, size: 2, dur: 23, delay:  9, color: 'p-saffron', anim: 'floatUp'      },
  { left: 90, size: 4, dur: 27, delay:  2, color: 'p-white',   anim: 'floatUpDrift' },
  { left: 94, size: 2, dur: 18, delay: 11, color: 'p-mint',    anim: 'floatUp'      },
  { left: 98, size: 3, dur: 21, delay:  6, color: 'p-purple',  anim: 'floatUpDrift' },
  // Extra scattered ones for density
  { left:  8, size: 2, dur: 30, delay: 16, color: 'p-white',   anim: 'floatUp'      },
  { left: 32, size: 3, dur: 14, delay:  0, color: 'p-mint',    anim: 'floatUpDrift' },
  { left: 55, size: 2, dur: 26, delay: 18, color: 'p-saffron', anim: 'floatUp'      },
  { left: 73, size: 3, dur: 22, delay:  5, color: 'p-pink',    anim: 'floatUpDrift' },
  { left: 88, size: 2, dur: 19, delay: 13, color: 'p-white',   anim: 'floatUp'      },
];

// ─── Symbol data — 20 floating study symbols ─────
// Each: symbol text, left%, bottom%, size(rem), duration(s), delay(s)
const SYMBOLS = [
  { text: '∑',     left:  5, bottom: 10, size: 2.2, dur: 35, delay:  0 },
  { text: 'π',     left: 12, bottom: 30, size: 1.8, dur: 40, delay:  5 },
  { text: '∞',     left: 20, bottom:  5, size: 2.5, dur: 38, delay: 12 },
  { text: '√',     left: 28, bottom: 45, size: 1.6, dur: 42, delay:  3 },
  { text: 'Δ',     left: 35, bottom: 20, size: 2.0, dur: 36, delay: 18 },
  { text: 'E=mc²', left: 42, bottom: 60, size: 1.4, dur: 44, delay:  7 },
  { text: '∫',     left: 50, bottom: 15, size: 2.3, dur: 33, delay: 22 },
  { text: 'H₂O',   left: 58, bottom: 40, size: 1.5, dur: 39, delay:  1 },
  { text: 'DNA',   left: 65, bottom: 70, size: 1.7, dur: 41, delay: 15 },
  { text: '101',   left: 72, bottom: 25, size: 1.9, dur: 37, delay:  9 },
  { text: 'λ',     left: 80, bottom: 55, size: 2.1, dur: 43, delay:  4 },
  { text: 'φ',     left: 88, bottom:  8, size: 1.8, dur: 35, delay: 20 },
  { text: '≈',     left: 15, bottom: 75, size: 2.0, dur: 46, delay: 11 },
  { text: 'θ',     left: 25, bottom: 50, size: 1.6, dur: 38, delay: 25 },
  { text: 'α',     left: 45, bottom: 85, size: 2.2, dur: 40, delay:  6 },
  { text: 'β',     left: 60, bottom: 12, size: 1.5, dur: 34, delay: 17 },
  { text: '∝',     left: 75, bottom: 65, size: 1.9, dur: 45, delay:  2 },
  { text: 'Ω',     left: 92, bottom: 35, size: 2.0, dur: 37, delay: 14 },
  { text: '∂',     left: 38, bottom: 90, size: 1.7, dur: 42, delay:  8 },
  { text: 'μ',     left: 82, bottom: 80, size: 1.6, dur: 36, delay: 21 },
];

export default function ParticleBackground() {
  return (
    <div className="particle-bg" aria-hidden="true">

      {/* Glowing dot particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={`p-${i}`}
          className={`particle ${p.color}`}
          style={{
            left:          `${p.left}%`,
            bottom:        '-8px',
            width:         `${p.size}px`,
            height:        `${p.size}px`,
            animationName:     p.anim,
            animationDuration: `${p.dur}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}

      {/* Floating study symbols */}
      {SYMBOLS.map((s, i) => (
        <span
          key={`s-${i}`}
          className="symbol"
          style={{
            left:              `${s.left}%`,
            bottom:            `${s.bottom}%`,
            fontSize:          `${s.size}rem`,
            animationDuration: `${s.dur}s`,
            animationDelay:    `${s.delay}s`,
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
