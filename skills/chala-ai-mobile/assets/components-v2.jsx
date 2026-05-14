/* global React */
// Chala v2 — sleek dark, 0px edges, hairlines, performance + matte luxury, mono with hint of blue.
// Design system primitives: tokens, screen frame, tab bar, custom glyphs, typography helpers.

const { useTweaks: useTweaksV2 } = window;

// ---------------- TOKENS (live, drive everything) ----------------
const V2 = {
  bg: "#050505",
  bgRaised: "#0B0B0B",
  hairline: "rgba(255,255,255,0.08)",
  hairlineStrong: "rgba(255,255,255,0.16)",
  text: "#fff",
  textDim: "rgba(255,255,255,0.55)",
  textFaint: "rgba(255,255,255,0.32)",
  textMuted: "rgba(255,255,255,0.18)",
  accent: "#fff",       // pure monochrome — accent is just white
  accentDim: "rgba(255,255,255,0.55)",
  radius: 2,            // tiny rounding
};

// ---------------- TYPE ROLES (read tweaks for live preview) ----------------
function getType(tweaks) {
  const heading = tweaks?.headingFont || "geist";
  const numFont = tweaks?.numeralFont || "mono";
  const fonts = {
    geist: '"Geist", system-ui, sans-serif',
    geistMono: '"Geist Mono", ui-monospace, monospace',
    serif: '"Fraunces", "Times New Roman", serif',
    grotesk: '"Space Grotesk", system-ui, sans-serif',
    display: '"Bebas Neue", "Oswald", sans-serif',
  };
  return {
    body: fonts.geist,
    heading: fonts[heading] || fonts.geist,
    numeral: fonts[numFont] || fonts.geistMono,
    label: fonts.geistMono, // labels always mono — instrument feel
  };
}

// ---------------- CUSTOM GLYPHS (replace emoji) ----------------
// Thin-stroke monochrome SVGs. Uniform 24×24 viewBox, currentColor stroke.
const Glyph = ({ name, size = 18, color }) => {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color || "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };
  switch (name) {
    case "home":
      return <svg {...props}><path d="M3 11 L12 4 L21 11 V20 H14 V14 H10 V20 H3 Z" /></svg>;
    case "chat":
      return <svg {...props}><path d="M4 5 H20 V17 H13 L9 21 V17 H4 Z" /></svg>;
    case "calendar":
      return <svg {...props}><path d="M4 6 H20 V20 H4 Z M4 10 H20 M9 4 V8 M15 4 V8" /></svg>;
    case "profile":
      return <svg {...props}><circle cx="12" cy="9" r="3.5" /><path d="M5 20 C5 15 8 13 12 13 C16 13 19 15 19 20" /></svg>;
    case "bell":
      return <svg {...props}><path d="M6 17 V11 C6 7.5 8.5 5 12 5 C15.5 5 18 7.5 18 11 V17 H20 H4 Z M10 20 C10.5 21 11.2 21.5 12 21.5 C12.8 21.5 13.5 21 14 20" /></svg>;
    case "arrow-right":
      return <svg {...props}><path d="M5 12 H19 M14 6 L20 12 L14 18" /></svg>;
    case "arrow-up":
      return <svg {...props}><path d="M12 19 V5 M6 11 L12 5 L18 11" /></svg>;
    case "chevron-left":
      return <svg {...props}><path d="M14 6 L8 12 L14 18" /></svg>;
    case "chevron-right":
      return <svg {...props}><path d="M10 6 L16 12 L10 18" /></svg>;
    case "dumbbell":
      return <svg {...props}><path d="M3 9 V15 M5 7 V17 M7 10 H17 M19 7 V17 M21 9 V15" /></svg>;
    case "pulse":
      return <svg {...props}><path d="M3 12 H7 L9 6 L13 18 L15 12 H21" /></svg>;
    case "moon":
      return <svg {...props}><path d="M19 14 A8 8 0 1 1 10 5 A6 6 0 0 0 19 14 Z" /></svg>;
    case "spark":
      return <svg {...props}><path d="M12 3 V8 M12 16 V21 M3 12 H8 M16 12 H21 M5.5 5.5 L8 8 M16 16 L18.5 18.5 M18.5 5.5 L16 8 M8 16 L5.5 18.5" /></svg>;
    case "book":
      return <svg {...props}><path d="M5 4 H12 C13.5 4 14 5 14 6 V20 C14 19 13.5 18 12 18 H5 Z M19 4 H12 C13.5 4 14 5 14 6 V20 C14 19 13.5 18 12 18 H19 Z" /></svg>;
    case "apple":
      return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M12 4 V20 M4 12 H20 M6 6 L18 18 M18 6 L6 18" /></svg>;
    case "droplet":
      return <svg {...props}><path d="M12 3 L17 11 C17 15 15 18 12 18 C9 18 7 15 7 11 Z" /></svg>;
    case "flame":
      return <svg {...props}><path d="M12 3 C12 7 16 8 16 13 C16 16.5 14 19 12 19 C10 19 8 16.5 8 13 C8 11 9 10 10 9 C10 11 11 12 12 12 C11 9 12 6 12 3 Z" /></svg>;
    case "watch":
      return <svg {...props}><rect x="6" y="7" width="12" height="10" /><path d="M9 7 V4 H15 V7 M9 17 V20 H15 V17 M12 10 V12 L14 14" /></svg>;
    case "sports":
      // Runner figure
      return <svg {...props}><circle cx="14" cy="5" r="1.6" /><path d="M9 10 L13 8 L17 11 L15 14 L18 18 M13 8 L11 13 L7 14 M11 13 L13 17" /></svg>;
    case "qr":
      return <svg {...props}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><path d="M14 14 H17 M20 14 V17 M14 17 V20 M17 17 V20 H20 M20 17" /></svg>;
    case "chevron-right":
      return <svg {...props}><path d="M9 6 L15 12 L9 18" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M18.4 5.6 L17 7 M7 17 L5.6 18.4" /></svg>;
    case "wallet":
      return <svg {...props}><rect x="3" y="6" width="18" height="14" /><path d="M3 10 H21 M16 14 H18" /></svg>;
    case "moon-z":
      return <svg {...props}><path d="M19 14 A8 8 0 1 1 10 5 A6 6 0 0 0 19 14 Z" /></svg>;
    case "pin":
      return <svg {...props}><path d="M9 4 H15 L14 8 L17 11 L13 11 V19 L11 19 V11 L7 11 L10 8 Z" /></svg>;
    case "check":
      return <svg {...props}><path d="M5 12 L10 17 L19 7" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21 M5.5 5.5 L7.5 7.5 M16.5 16.5 L18.5 18.5 M18.5 5.5 L16.5 7.5 M7.5 16.5 L5.5 18.5" /></svg>;
    case "more":
      return <svg {...props}><circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" /></svg>;
    case "play":
      return <svg {...props}><path d="M7 5 L19 12 L7 19 Z" /></svg>;
    default:
      return <svg {...props}><rect x="4" y="4" width="16" height="16" /></svg>;
  }
};

// ---------------- SCREEN FRAME ----------------
// Note: when wrapped by an IOSDevice frame, the frame supplies its own status bar.
// We render content only — no internal status bar — and let the device chrome handle it.
function ChalaScreenV2({ children, label, tweaks }) {
  const type = getType(tweaks);
  return (
    <div
      data-screen-label={label}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        minHeight: 0,
        background: V2.bg,
        color: V2.text,
        fontFamily: type.body,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Spacer for status bar / dynamic island */}
      <div style={{ height: 56, flexShrink: 0 }}></div>
      {children}
    </div>
  );
}

// ---------------- TAB BAR — flat, hairline divider, icons only ----------------
function TabBarV2({ active = "home" }) {
  const tabs = [
    { id: "home", glyph: "home" },
    { id: "chat", glyph: "chat" },
    { id: "sports", glyph: "sports" },
    { id: "nutrition", glyph: "apple" },
    { id: "profile", glyph: "profile" },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${V2.hairline}`,
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      padding: "14px 0 36px",
      flexShrink: 0,
      background: V2.bg,
    }}>
      {tabs.map((t) => (
        <div key={t.id} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          color: active === t.id ? V2.text : V2.textMuted,
        }}>
          <Glyph name={t.glyph} size={20} />
          {active === t.id && (
            <div style={{ width: 4, height: 4, background: V2.text, marginTop: 2 }}></div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------- WORDMARK — uses real logo asset, correct proportions ----------------
// Real PNG is 1322×822 with bar occupying a portion. To preserve proportions, render image at width
// and let height auto-size. For a header, give it a width.
function WordmarkV2({ width = 88, dim = 1, src = "chala-logo.png" }) {
  return (
    <img
      src={src}
      alt="Chala"
      style={{ width, height: "auto", display: "block", opacity: dim, objectFit: "contain" }}
    />
  );
}

// ---------------- LABEL — small, mono, uppercase, tracked ----------------
function Label({ children, color = V2.textDim, size = 10, tweaks, style }) {
  const type = getType(tweaks);
  return (
    <div style={{
      fontFamily: type.label,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
      ...style,
    }}>{children}</div>
  );
}

// ---------------- NUMERIC — for timers, counts, stats ----------------
function Numeric({ children, size = 28, weight = 500, color = V2.text, tweaks, style }) {
  const type = getType(tweaks);
  return (
    <span style={{
      fontFamily: type.numeral,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: "-0.02em",
      fontVariantNumeric: "tabular-nums",
      color,
      lineHeight: 1,
      ...style,
    }}>{children}</span>
  );
}

// ---------------- HEADING — uses heading font role ----------------
function Heading({ children, size = 28, weight = 500, tweaks, style }) {
  const type = getType(tweaks);
  return (
    <div style={{
      fontFamily: type.heading,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: "-0.02em",
      lineHeight: 1.05,
      color: V2.text,
      ...style,
    }}>{children}</div>
  );
}

// ---------------- BUTTON — sharp, 2px radius ----------------
function ButtonV2({ children, variant = "primary", style }) {
  const v = {
    primary: { background: "#E0E0E0", color: "#0B0B0B", border: "1px solid #E0E0E0" },
    secondary: { background: "transparent", color: V2.textDim, border: `1px solid ${V2.hairlineStrong}` },
    ghost: { background: "transparent", color: V2.textDim, border: `1px solid ${V2.hairline}` },
  };
  return (
    <div style={{
      ...v[variant],
      height: 52,
      borderRadius: V2.radius,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      cursor: "pointer",
      ...style,
    }}>{children}</div>
  );
}

// ---------------- HAIRLINE DIVIDER ----------------
function Rule({ color = V2.hairline, style }) {
  return <div style={{ height: 1, background: color, ...style }}></div>;
}

Object.assign(window, {
  V2, getType, Glyph, ChalaScreenV2, TabBarV2, WordmarkV2,
  Label, Numeric, Heading, ButtonV2, Rule,
});
