import { useId } from "react"

export function VehicleRecoveryAnimatedCover({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "")

  return (
    <div
      className={`vehicle-animated-cover-wrap ${className}`}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.68",
        backgroundColor: "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`
        /* 1. Map Pin gently scales bigger and smaller in place */
        @keyframes vrcPinScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.18);
          }
        }

        /* 2. Towed car hanging in the air swings smoothly from the winch hook */
        @keyframes vrcCarSwing {
          0%, 100% {
            transform: rotate(-3deg);
            transform-origin: 205px 240px;
          }
          50% {
            transform: rotate(3deg);
            transform-origin: 205px 240px;
          }
        }

        .vrc-pin-pulse {
          animation: vrcPinScale 2.4s ease-in-out infinite;
          transform-origin: 573px 315px;
        }

        .vrc-car-swing {
          animation: vrcCarSwing 3.2s ease-in-out infinite;
          transform-origin: 205px 240px;
        }
      `}</style>

      <svg
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "92%",
          height: "92%",
          maxHeight: "100%",
          display: "block",
        }}
      >
        <defs>
          <filter id={`shadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#091e2b" floodOpacity="0.08" />
          </filter>
          {/* Clip path constraining the map to the laptop screen bounds */}
          <clipPath id={`screen-clip-${uid}`}>
            <rect x="312" y="222" width="406" height="291" rx="8" />
          </clipPath>
        </defs>

        {/* ── LAPTOP DISPLAY WORKSPACE (Static) ───────── */}
        <g id="laptop-screen" filter={`url(#shadow-${uid})`}>
          {/* Laptop Base Stand */}
          <rect x="250" y="525" width="530" height="18" rx="8" fill="#181c20" />
          <rect x="470" y="525" width="90" height="6" rx="3" fill="#3b4249" />

          {/* Laptop Bezel */}
          <rect x="300" y="210" width="430" height="315" rx="14" fill="#181c20" />
          {/* Screen Inner Display – light background for map */}
          <rect x="312" y="222" width="406" height="291" rx="8" fill="#e8f4f0" />
        </g>

        {/* ── MAP ILLUSTRATION INSIDE LAPTOP SCREEN (clipped) ── */}
        <g clipPath={`url(#screen-clip-${uid})`}>
          {/* Map base — pale beige/green */}
          <rect x="312" y="222" width="406" height="291" fill="#eaf4e8" />

          {/* City blocks — greenish parks / lighter districts */}
          <rect x="322" y="232" width="70" height="55" rx="3" fill="#d6ead4" />
          <rect x="402" y="232" width="95" height="55" rx="3" fill="#cbe7d5" />
          <rect x="507" y="232" width="80" height="55" rx="3" fill="#d8ecd6" />
          <rect x="597" y="232" width="120" height="55" rx="3" fill="#c8e2c6" />

          <rect x="322" y="297" width="70" height="65" rx="3" fill="#d8eadc" />
          <rect x="402" y="297" width="45" height="65" rx="3" fill="#f5f2e0" />
          <rect x="457" y="297" width="40" height="65" rx="3" fill="#f0edd8" />
          <rect x="597" y="297" width="120" height="65" rx="3" fill="#d0e8ce" />

          <rect x="322" y="372" width="70" height="80" rx="3" fill="#cce8cc" />
          <rect x="402" y="372" width="95" height="80" rx="3" fill="#f5f2e0" />
          <rect x="507" y="372" width="80" height="80" rx="3" fill="#e8f0e0" />
          <rect x="597" y="372" width="120" height="80" rx="3" fill="#d4e8d0" />

          <rect x="322" y="462" width="70" height="50" rx="3" fill="#d2e8ce" />
          <rect x="402" y="462" width="210" height="50" rx="3" fill="#f0eddc" />
          <rect x="617" y="462" width="100" height="50" rx="3" fill="#cce4ca" />

          {/* Blue river / water body cutting diagonally */}
          <path
            d="M 312 420 Q 370 380 430 390 Q 490 400 520 360 Q 560 310 600 330 Q 640 350 680 320 L 718 305 L 718 340 Q 680 360 640 340 Q 600 320 560 370 Q 520 410 480 398 Q 430 382 380 420 Q 350 448 312 448 Z"
            fill="#a8d8ea"
            opacity="0.7"
          />

          {/* Road network — gray grid roads */}
          {/* Horizontal main roads */}
          <line x1="312" y1="292" x2="718" y2="292" stroke="#c4ccc8" strokeWidth="10" />
          <line x1="312" y1="367" x2="718" y2="367" stroke="#c4ccc8" strokeWidth="10" />
          <line x1="312" y1="457" x2="718" y2="457" stroke="#c4ccc8" strokeWidth="10" />
          {/* Vertical main roads */}
          <line x1="397" y1="222" x2="397" y2="513" stroke="#c4ccc8" strokeWidth="10" />
          <line x1="502" y1="222" x2="502" y2="513" stroke="#c4ccc8" strokeWidth="10" />
          <line x1="592" y1="222" x2="592" y2="513" stroke="#c4ccc8" strokeWidth="10" />

          {/* Road center dashes */}
          <line x1="312" y1="292" x2="718" y2="292" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" />
          <line x1="312" y1="367" x2="718" y2="367" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" />
          <line x1="397" y1="222" x2="397" y2="513" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" />
          <line x1="502" y1="222" x2="502" y2="513" stroke="#ffffff" strokeWidth="2" strokeDasharray="14 10" />

          {/* Building footprints — small rectangles inside city blocks */}
          <rect x="330" y="238" width="22" height="14" rx="1" fill="#b8d4b4" />
          <rect x="358" y="238" width="18" height="20" rx="1" fill="#aac8aa" />
          <rect x="330" y="258" width="30" height="12" rx="1" fill="#b0ccb0" />
          <rect x="410" y="238" width="28" height="18" rx="1" fill="#e8e0c8" />
          <rect x="444" y="238" width="18" height="22" rx="1" fill="#e0d8c4" />
          <rect x="468" y="238" width="24" height="16" rx="1" fill="#ddd4c0" />
          <rect x="516" y="238" width="30" height="18" rx="1" fill="#c8e0c4" />
          <rect x="554" y="238" width="22" height="22" rx="1" fill="#c0d8bc" />
          <rect x="608" y="238" width="36" height="20" rx="1" fill="#b8d0b8" />
          <rect x="650" y="238" width="24" height="28" rx="1" fill="#b0c8b0" />
          <rect x="684" y="238" width="28" height="16" rx="1" fill="#b8d4b4" />

          {/* Lower block buildings */}
          <rect x="410" y="378" width="26" height="16" rx="1" fill="#e8e0c8" />
          <rect x="442" y="378" width="20" height="22" rx="1" fill="#e0d8c4" />
          <rect x="468" y="390" width="24" height="14" rx="1" fill="#ddd4c0" />
          <rect x="516" y="380" width="28" height="18" rx="1" fill="#d4e8ce" />
          <rect x="550" y="376" width="24" height="24" rx="1" fill="#cce4c8" />
          <rect x="608" y="380" width="36" height="18" rx="1" fill="#c8e0c4" />
          <rect x="652" y="380" width="28" height="22" rx="1" fill="#c0d8bc" />
          <rect x="686" y="382" width="20" height="18" rx="1" fill="#b8d0b8" />

          {/* Green park patch */}
          <rect x="330" y="303" width="58" height="55" rx="4" fill="#a8d8a0" />
          <circle cx="345" cy="318" r="6" fill="#85c27a" />
          <circle cx="362" cy="324" r="8" fill="#7aba6e" />
          <circle cx="378" cy="315" r="5" fill="#85c27a" />
          <circle cx="355" cy="340" r="7" fill="#7aba6e" />
          <circle cx="375" cy="344" r="6" fill="#85c27a" />

          {/* Navigation compass arrow (static) — top-right of screen */}
          <polygon
            points="690,242 660,270 672,274 680,286"
            fill="#439fe0"
            stroke="#181c20"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* ── ANIMATED ELEMENT 1: RED GPS MAP PIN (Grows bigger and smaller) ── */}
          <g className="vrc-pin-pulse">
            {/* Pin Body */}
            <path
              d="M 573 330 C 573 330 543 296 543 271 A 30 30 0 1 1 603 271 C 603 296 573 330 573 330 Z"
              fill="#ff4d4f"
              stroke="#181c20"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            {/* Inner White Dot */}
            <circle cx="573" cy="269" r="10" fill="#ffffff" stroke="#181c20" strokeWidth="5" />
          </g>
        </g>

        {/* ── TOW TRUCK (Completely Static) ───────────── */}
        <g id="tow-truck-static">
          {/* Crane Arm Rigging */}
          <line x1="205" y1="240" x2="490" y2="350" stroke="#181c20" strokeWidth="12" strokeLinecap="round" />
          <circle cx="205" cy="240" r="14" fill="#181c20" />
          <circle cx="490" cy="350" r="14" fill="#181c20" />
          <line x1="490" y1="350" x2="490" y2="470" stroke="#181c20" strokeWidth="14" strokeLinecap="round" />

          {/* Flatbed Ramp */}
          <line x1="140" y1="500" x2="385" y2="455" stroke="#181c20" strokeWidth="14" strokeLinecap="round" />
          <line x1="380" y1="460" x2="480" y2="430" stroke="#181c20" strokeWidth="6" />
          <line x1="375" y1="475" x2="480" y2="455" stroke="#181c20" strokeWidth="6" />

          {/* Truck Lower Chassis Base Beam */}
          <rect x="260" y="475" width="370" height="28" rx="6" fill="#181c20" />

          {/* Cabin Body */}
          <path
            d="M 480 475 L 480 395 A 10 10 0 0 1 490 385 L 530 385 A 14 14 0 0 1 542 392 L 565 435 A 16 16 0 0 1 570 445 L 635 448 A 12 12 0 0 1 647 460 L 647 482 L 480 482 Z"
            fill="#ced4da"
            stroke="#181c20"
            strokeWidth="7"
            strokeLinejoin="round"
          />

          {/* Cab Window */}
          <path
            d="M 500 395 L 528 395 L 552 435 L 500 435 Z"
            fill="#ffffff"
            stroke="#181c20"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Door Handle */}
          <rect x="506" y="445" width="10" height="15" rx="2" fill="#181c20" />

          {/* Amber Warning Beacon */}
          <path
            d="M 505 385 L 505 376 A 4 4 0 0 1 509 372 L 521 372 A 4 4 0 0 1 525 376 L 525 385 Z"
            fill="#ff922b"
            stroke="#181c20"
            strokeWidth="3"
          />

          {/* Front Grille Bumper */}
          <rect x="642" y="468" width="12" height="22" rx="3" fill="#181c20" />

          {/* Truck Wheels (Static) */}
          <circle cx="305" cy="505" r="28" fill="#ffffff" stroke="#181c20" strokeWidth="10" />
          <circle cx="305" cy="505" r="14" fill="#181c20" />
          <circle cx="605" cy="505" r="28" fill="#ffffff" stroke="#181c20" strokeWidth="10" />
          <circle cx="605" cy="505" r="14" fill="#181c20" />
        </g>

        {/* ── ANIMATED ELEMENT 2: SUSPENDED RED CAR SWINGING ON HOIST ── */}
        <g className="vrc-car-swing">
          {/* Steel Winch Cable */}
          <line
            x1="205"
            y1="240"
            x2="205"
            y2="340"
            stroke="#181c20"
            strokeWidth="5"
            strokeDasharray="4 2"
            strokeLinecap="round"
          />

          {/* Hoist Hook Sling Connection */}
          <path d="M 205 338 L 195 352 L 215 352 Z" fill="#181c20" />

          {/* Suspended Red Car */}
          <g transform="rotate(-12 210 390)">
            {/* Main Body */}
            <path
              d="M 125 395 L 140 330 A 8 8 0 0 1 148 324 L 235 324 A 12 12 0 0 1 245 330 L 285 365 A 14 14 0 0 1 292 376 L 292 410 A 8 8 0 0 1 284 418 L 133 418 A 8 8 0 0 1 125 410 Z"
              fill="#ff5252"
              stroke="#181c20"
              strokeWidth="7"
              strokeLinejoin="round"
            />

            {/* Windshield & Windows */}
            <path
              d="M 152 334 L 195 334 L 195 365 L 145 365 Z"
              fill="#ffffff"
              stroke="#181c20"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M 205 334 L 238 334 L 268 365 L 205 365 Z"
              fill="#ffffff"
              stroke="#181c20"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Door Cut Line & Handle */}
            <line x1="198" y1="334" x2="198" y2="415" stroke="#181c20" strokeWidth="5" />
            <rect x="206" y="375" width="12" height="4" rx="2" fill="#181c20" />

            {/* Headlight */}
            <path d="M 288 382 L 292 382 L 292 396 L 288 396 Z" fill="#ffd034" />

            {/* Front Wheel */}
            <g transform="translate(255, 418)">
              <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#181c20" strokeWidth="8" />
              <circle cx="0" cy="0" r="10" fill="#181c20" />
            </g>
            {/* Rear Wheel */}
            <g transform="translate(160, 418)">
              <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#181c20" strokeWidth="8" />
              <circle cx="0" cy="0" r="10" fill="#181c20" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
