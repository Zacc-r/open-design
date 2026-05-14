/* global React */
// Chala v2 screens — unified dark, 0px edges, hairlines, typography-forward, custom glyphs.

const {
  V2, ChalaScreenV2, TabBarV2, WordmarkV2, Glyph,
  Label, Numeric, Heading, ButtonV2, Rule,
} = window;

// =================================================================================
// AUTH — shared form primitives
// =================================================================================
function FormField({ label, value, placeholder, hint, type = "text", showToggle, tweaks, last }) {
  const numFont = getType(tweaks).numeral;
  return (
    <div style={{
      padding: "14px 0",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
    }}>
      <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 8 }}>{label}</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, fontSize: 15, color: value ? V2.text : V2.textMuted, fontFamily: type === "password" ? numFont : "inherit", letterSpacing: type === "password" ? "0.2em" : "normal" }}>
          {value || placeholder}
        </div>
        {showToggle && (
          <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em" }}>SHOW</div>
        )}
        {hint && (
          <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{hint}</div>
        )}
      </div>
    </div>
  );
}

function GoogleButton({ tweaks }) {
  return (
    <div style={{
      height: 52,
      border: `1px solid ${V2.hairlineStrong}`,
      borderRadius: V2.radius,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
      cursor: "pointer",
    }}>
      {/* Stylized G monogram — single colour to fit monochrome system */}
      <svg width="14" height="14" viewBox="0 0 24 24">
        <path d="M21 12 H12 V14.5 H17.8 C17 17 14.7 18.5 12 18.5 A6.5 6.5 0 1 1 12 5.5 C13.6 5.5 15 6.1 16.1 7 L18 5.1 A9 9 0 1 0 21 12 Z" fill="#E0E0E0" />
      </svg>
      <span style={{ fontSize: 13, color: V2.text, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>Continue with Google</span>
    </div>
  );
}

function AuthDivider({ label = "Or" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: V2.hairline }}></div>
      <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: "ui-monospace, 'Geist Mono', monospace", letterSpacing: "0.16em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: V2.hairline }}></div>
    </div>
  );
}

// =================================================================================
// SIGN IN
// =================================================================================
function SignInScreenV2({ tweaks }) {
  return (
    <ChalaScreenV2 label="01 Sign in" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px 28px", overflow: "auto" }}>
        {/* Wordmark + intro */}
        <div style={{ marginBottom: 36 }}>
          <WordmarkV2 width={120} dim={1} src="chala-logo.png" />
          <Heading size={32} weight={500} tweaks={tweaks} style={{ marginTop: 28, marginBottom: 10 }}>
            Welcome back.
          </Heading>
          <div style={{ fontSize: 14, color: V2.textDim, lineHeight: 1.5 }}>
            Sign in to continue training with intent.
          </div>
        </div>

        {/* Form fields */}
        <div style={{ marginBottom: 8 }}>
          <FormField label="Email or username" value="alex@morgan.co" tweaks={tweaks} />
          <FormField label="Password" value="••••••••••" type="password" showToggle tweaks={tweaks} last />
        </div>

        {/* Forgot */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 24px" }}>
          <div style={{ fontSize: 11, color: V2.textDim, letterSpacing: "0.04em", textDecoration: "underline", textDecorationColor: V2.hairlineStrong, textUnderlineOffset: 3 }}>
            Forgot password?
          </div>
        </div>

        {/* Primary CTA */}
        <ButtonV2 variant="primary">Sign in</ButtonV2>

        {/* Social — direct, no divider */}
        <div style={{ marginTop: 10 }}>
          <GoogleButton tweaks={tweaks} />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 32 }}></div>

        {/* Footer link */}
        <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
          <span style={{ fontSize: 13, color: V2.textFaint }}>New here? </span>
          <span style={{ fontSize: 13, color: V2.text, fontWeight: 500, letterSpacing: "0.02em" }}>Create account →</span>
        </div>
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <Label tweaks={tweaks} color={V2.textMuted} size={9}>By continuing — Terms · Privacy</Label>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// SIGN UP
// =================================================================================
function SignUpScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // Password strength bar — 4 segments, 3 lit (Strong)
  const strengthSegments = [1, 1, 1, 0];
  const strengthLabel = "STRONG";

  return (
    <ChalaScreenV2 label="02 Sign up" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 28px 28px", overflow: "auto" }}>
        {/* Wordmark + intro */}
        <div style={{ marginBottom: 28 }}>
          <WordmarkV2 width={120} dim={1} src="chala-logo.png" />
          <Heading size={32} weight={500} tweaks={tweaks} style={{ marginTop: 28, marginBottom: 10 }}>
            Create your<br />account.
          </Heading>
          <div style={{ fontSize: 14, color: V2.textDim, lineHeight: 1.5 }}>
            Six fields. Then your coach gets to work.
          </div>
        </div>

        {/* Form fields */}
        <div style={{ marginBottom: 14 }}>
          <FormField label="Name"          value="Alex Morgan"        tweaks={tweaks} />
          <FormField label="Email"         value="alex@morgan.co"     tweaks={tweaks} />
          <FormField label="Username"      value="alex.runs"          hint="AVAILABLE" tweaks={tweaks} />
          <FormField label="Date of birth" value="03 / 14 / 1992"     tweaks={tweaks} />
          <FormField label="Password"      value="•••••••••••"         type="password" showToggle tweaks={tweaks} />

          {/* Password strength */}
          <div style={{ padding: "10px 0 14px", borderBottom: `1px solid ${V2.hairline}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1, display: "flex", gap: 3 }}>
                {strengthSegments.map((on, i) => (
                  <div key={i} style={{ flex: 1, height: 3, background: on ? V2.text : V2.hairlineStrong }}></div>
                ))}
              </div>
              <div style={{ fontSize: 9, color: V2.text, fontFamily: numFont, letterSpacing: "0.1em" }}>{strengthLabel}</div>
            </div>
            <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>
              12+ CHARS · 1 NUMBER · 1 SYMBOL
            </div>
          </div>

          <FormField label="Confirm password" value="•••••••••••" type="password" showToggle hint="MATCH" tweaks={tweaks} last />
        </div>

        {/* Primary CTA */}
        <ButtonV2 variant="primary">Create account</ButtonV2>

        {/* Social — direct, no divider */}
        <div style={{ marginTop: 10 }}>
          <GoogleButton tweaks={tweaks} />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 24 }}></div>

        {/* Footer link */}
        <div style={{ textAlign: "center", padding: "16px 0 4px" }}>
          <span style={{ fontSize: 13, color: V2.textFaint }}>Have an account? </span>
          <span style={{ fontSize: 13, color: V2.text, fontWeight: 500, letterSpacing: "0.02em" }}>Sign in →</span>
        </div>
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <Label tweaks={tweaks} color={V2.textMuted} size={9}>By continuing — Terms · Privacy</Label>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// ---------------- HOME ----------------
function HomeScreenV2({ tweaks }) {
  return (
    <ChalaScreenV2 label="02 Home" tweaks={tweaks}>
      <div style={{ flex: 1, padding: "12px 28px 0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Top row: dim logo + bell */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 }}>
          <WordmarkV2 width={64} dim={0.4} src="chala-logo.png" />
          <Glyph name="bell" size={18} color={V2.textFaint} />
        </div>

        <Rule style={{ marginTop: 8, marginBottom: 24 }} />

        {/* Greeting block — typography-forward */}
        <div style={{ marginBottom: 28 }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 10 }}>Tue · Mar 12 · 09:41</Label>
          <Heading size={36} weight={500} tweaks={tweaks}>
            Good morning,<br />
            <span style={{ color: V2.textDim }}>Alex.</span>
          </Heading>
        </div>

        {/* Day strip — instrument feel */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <Label tweaks={tweaks}>Week 11 · Day 04 / 07</Label>
            <Label tweaks={tweaks} color={V2.text}>Streak <Numeric size={11} tweaks={tweaks} color={V2.text}>03</Numeric></Label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => {
              const done = i < 4;
              const today = i === 4;
              return (
                <div key={i} style={{
                  height: 4,
                  background: today ? V2.accent : done ? V2.text : V2.hairline,
                }}></div>
              );
            })}
          </div>
        </div>

        {/* Today hero — sharp, hairline, typographic */}
        <div style={{ border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius, marginBottom: 24 }}>
          <div style={{ padding: "20px 20px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Label tweaks={tweaks}>Today · Push</Label>
              <Glyph name="dumbbell" size={16} color={V2.textDim} />
            </div>
            <Heading size={26} weight={500} tweaks={tweaks} style={{ marginBottom: 16 }}>
              Chest &<br />Shoulders
            </Heading>
            <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
              <div>
                <Numeric size={20} tweaks={tweaks}>58</Numeric>
                <span style={{ fontSize: 11, color: V2.textFaint, marginLeft: 4 }}>MIN</span>
              </div>
              <div style={{ width: 1, height: 14, background: V2.hairline }}></div>
              <div>
                <Numeric size={20} tweaks={tweaks}>06</Numeric>
                <span style={{ fontSize: 11, color: V2.textFaint, marginLeft: 4 }}>EXERCISES</span>
              </div>
              <div style={{ width: 1, height: 14, background: V2.hairline }}></div>
              <div>
                <Numeric size={20} tweaks={tweaks} color={V2.accent}>+12</Numeric>
                <span style={{ fontSize: 11, color: V2.textFaint, marginLeft: 4 }}>VOL</span>
              </div>
            </div>
          </div>
          <Rule color={V2.hairlineStrong} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer" }}>
            <Label tweaks={tweaks} color={V2.text} size={11}>Begin session</Label>
            <Glyph name="arrow-right" size={18} color={V2.text} />
          </div>
        </div>

        {/* Coach insight */}
        <div style={{ marginBottom: 24 }}>
          <Label tweaks={tweaks} style={{ marginBottom: 10 }}>Coach Insight</Label>
          <div style={{ fontSize: 14, color: V2.textDim, lineHeight: 1.55, fontFamily: 'var(--type-heading)' }}>
            Your sleep dropped 8% this week. Pushing intensity today, then deload calves tomorrow.
          </div>
        </div>

        {/* Quick actions — 2 hairline cells */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, marginTop: "auto", marginBottom: 16 }}>
          <div style={{ padding: 16, borderRight: `1px solid ${V2.hairline}` }}>
            <Glyph name="pulse" size={16} color={V2.textDim} />
            <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: V2.text }}>Check-in</div>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 2 }}>How you feel</Label>
          </div>
          <div style={{ padding: 16 }}>
            <Glyph name="chat" size={16} color={V2.textDim} />
            <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: V2.text }}>Ask Coach</div>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 2 }}>Anytime</Label>
          </div>
        </div>
      </div>
      <TabBarV2 active="home" />
    </ChalaScreenV2>
  );
}

// ---------------- CHAT — Empty ----------------
function ChatScreenV2({ tweaks }) {
  const prompts = [
    "What should I eat before a workout?",
    "How do I improve my bench?",
    "I'm sore — should I train?",
    "Quick ab routine",
  ];
  return (
    <ChalaScreenV2 label="03 Chat — Empty" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "8px 28px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 4 }}>Coach</Label>
            <Heading size={24} weight={500} tweaks={tweaks}>Chala</Heading>
          </div>
          <Glyph name="settings" size={16} color={V2.textFaint} />
        </div>
        <Rule />

        {/* Empty state — typographic */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px" }}>
          <div style={{ width: 32, height: 32, border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Glyph name="spark" size={14} color={V2.text} />
          </div>
          <Heading size={32} weight={500} tweaks={tweaks} style={{ marginBottom: 12 }}>
            Ask anything.
          </Heading>
          <div style={{ fontSize: 14, color: V2.textDim, lineHeight: 1.55, marginBottom: 28, maxWidth: 280 }}>
            Workouts, nutrition, recovery. The coach knows your training history.
          </div>

          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 12 }}>Try</Label>
          <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${V2.hairline}`, borderRadius: V2.radius }}>
            {prompts.map((p, i) => (
              <div key={p} style={{
                padding: "14px 16px",
                fontSize: 14,
                color: V2.text,
                borderTop: i === 0 ? "none" : `1px solid ${V2.hairline}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span>{p}</span>
                <Glyph name="arrow-right" size={14} color={V2.textFaint} />
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${V2.hairline}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, fontSize: 14, color: V2.textFaint }}>Message Chala</div>
          <div style={{ width: 36, height: 36, border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glyph name="arrow-up" size={14} color={V2.textMuted} />
          </div>
        </div>
      </div>
      <TabBarV2 active="chat" />
    </ChalaScreenV2>
  );
}

// ---------------- CHAT — Active ----------------
// Distinction strategy: typographic, not chromatic.
//   USER  : right-aligned, bold white, slightly larger, NO rail
//   COACH : left-aligned, dim text, hairline rail on left, smaller-tracked byline
// Plus: pinned workout context, "Coach is thinking" pulse, reply chips below last coach msg.
function ChatActiveScreenV2({ tweaks }) {
  const type = getType(tweaks);
  const UserMsg = ({ text }) => (
    <div style={{ padding: "0 24px", marginBottom: 22, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <Label tweaks={tweaks} color={V2.text} size={9} style={{ marginBottom: 6 }}>You</Label>
      <div style={{
        fontSize: 17,
        lineHeight: 1.4,
        color: V2.text,
        fontWeight: 500,
        textAlign: "right",
        maxWidth: "82%",
        letterSpacing: "-0.01em",
      }}>{text}</div>
    </div>
  );
  const CoachMsg = ({ text, gradient }) => (
    <div style={{ padding: "0 24px 0 28px", marginBottom: 22, position: "relative" }}>
      <div style={{
        position: "absolute", left: 24, top: 6, bottom: 6,
        width: 1, background: V2.hairlineStrong,
      }}></div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Label tweaks={tweaks} color={V2.textDim} size={9}>Chala</Label>
        <div style={{ width: 12, height: 1, background: V2.hairline }}></div>
        <Label tweaks={tweaks} color={V2.textMuted} size={9}>09:41</Label>
      </div>
      <div style={{
        fontSize: 14,
        lineHeight: 1.55,
        color: V2.textDim,
        maxWidth: "92%",
        ...(gradient ? {
          background: `linear-gradient(180deg, ${V2.text} 0%, ${V2.textDim} 80%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        } : {}),
      }}>{text}</div>
    </div>
  );

  return (
    <ChalaScreenV2 label="04 Chat — Active" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "8px 28px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 4 }}>Coach</Label>
            <Heading size={24} weight={500} tweaks={tweaks}>Chala</Heading>
          </div>
          <Glyph name="settings" size={16} color={V2.textFaint} />
        </div>
        <Rule />

        {/* Pinned workout context */}
        <div style={{ padding: "12px 24px 0" }}>
          <div style={{
            border: `1px solid ${V2.hairline}`, borderRadius: V2.radius,
            padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            background: V2.bgRaised,
          }}>
            <Glyph name="pin" size={12} color={V2.textFaint} />
            <Label tweaks={tweaks} color={V2.textFaint} size={9}>Pinned</Label>
            <div style={{ width: 1, height: 10, background: V2.hairline }}></div>
            <span style={{ fontSize: 12, color: V2.text, fontWeight: 500, flex: 1 }}>Today · Push — Chest & Shoulders</span>
            <Glyph name="arrow-right" size={12} color={V2.textDim} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, paddingTop: 20, overflow: "auto" }}>
          <UserMsg text="Sore from yesterday. Should I still train?" />
          <CoachMsg text="Light soreness is fine to push through. Sharp or localized — swap to mobility plus zone-2 cardio. Where on a 1–10?" />
          <UserMsg text="Maybe a 4. Mostly chest and tris." />
          <CoachMsg text="Good. Today is Pull, won't aggravate it. Adding an extra warm-up set on row." gradient />

          {/* Reply chips below last coach msg */}
          <div style={{ padding: "0 24px 0 28px", marginBottom: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Sounds good", "Make it harder", "Why pull?"].map((r) => (
                <div key={r} style={{
                  border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
                  padding: "8px 12px",
                  fontSize: 12, color: V2.text,
                  letterSpacing: "0.02em",
                }}>{r}</div>
              ))}
            </div>
          </div>

          {/* Thinking pulse */}
          <div style={{ padding: "0 24px 0 28px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <span style={{
                position: "absolute", inset: 0,
                background: V2.text, borderRadius: V2.radius,
                animation: "chala-pulse 1.4s ease-in-out infinite",
              }}></span>
            </div>
            <Label tweaks={tweaks} color={V2.textFaint} size={9}>Chala is thinking</Label>
          </div>
          <style>{`
            @keyframes chala-pulse {
              0%, 100% { opacity: 0.25; transform: scale(0.7); }
              50% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${V2.hairline}`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, fontSize: 14, color: V2.text }}>Sounds good</div>
          <div style={{ width: 36, height: 36, background: V2.text, borderRadius: V2.radius, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glyph name="arrow-up" size={14} color={V2.bg} />
          </div>
        </div>
      </div>
      <TabBarV2 active="chat" />
    </ChalaScreenV2>
  );
}

// ---------------- CALENDAR ----------------
function CalendarScreenV2({ tweaks }) {
  const days = [
    { d: "S", n: 9, has: true },
    { d: "M", n: 10, has: true },
    { d: "T", n: 11, has: true },
    { d: "W", n: 12, has: true, sel: true, today: true },
    { d: "T", n: 13, has: false },
    { d: "F", n: 14, has: false },
    { d: "S", n: 15, has: false },
  ];
  return (
    <ChalaScreenV2 label="05 Calendar" tweaks={tweaks}>
      <div style={{ flex: 1, padding: "12px 28px 0", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Calendar</Label>
        </div>
        <Heading size={36} weight={500} tweaks={tweaks} style={{ marginBottom: 24 }}>
          March<br />
          <span style={{ color: V2.textDim }}>2025</span>
        </Heading>

        {/* Week nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Glyph name="chevron-left" size={18} color={V2.textDim} />
          <Label tweaks={tweaks}>Week 11</Label>
          <Glyph name="chevron-right" size={18} color={V2.textDim} />
        </div>

        {/* Days */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: V2.hairline, border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, marginBottom: 24 }}>
          {days.map((d) => (
            <div key={d.n} style={{
              background: d.sel ? V2.text : V2.bg,
              color: d.sel ? V2.bg : V2.text,
              padding: "12px 0 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
              <Label tweaks={tweaks} color={d.sel ? V2.bg : V2.textFaint} size={9}>{d.d}</Label>
              <Numeric size={18} tweaks={tweaks} color={d.sel ? V2.bg : V2.text}>{String(d.n).padStart(2, "0")}</Numeric>
              <div style={{ width: 4, height: 4, background: d.has ? (d.sel ? V2.bg : V2.accent) : "transparent" }}></div>
            </div>
          ))}
        </div>

        {/* Day detail */}
        <Label tweaks={tweaks} style={{ marginBottom: 12 }}>Wed · Mar 12</Label>
        <div style={{ border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, marginBottom: 24 }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <Glyph name="pulse" size={16} color={V2.textDim} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: V2.text }}>Check-in logged</div>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 4 }}>Mood 04 · Energy 04 · Sleep 7.2H</Label>
            </div>
            <Glyph name="check" size={14} color={V2.accent} />
          </div>
          <Rule />
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <Glyph name="dumbbell" size={16} color={V2.textDim} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: V2.text }}>Push — Chest & Shoulders</div>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 4 }}>18 sets · Rating 04 / 05 · 58 min</Label>
            </div>
            <Glyph name="arrow-right" size={14} color={V2.textFaint} />
          </div>
        </div>

        {/* Tools */}
        <Label tweaks={tweaks} style={{ marginBottom: 12 }}>Tools</Label>
        <div style={{ border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, padding: "20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <Glyph name="book" size={18} color={V2.textDim} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: V2.text }}>Exercise Library</div>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 4 }}>By muscle · equipment · level</Label>
          </div>
          <Glyph name="arrow-right" size={14} color={V2.text} />
        </div>
      </div>
      <TabBarV2 active="calendar" />
    </ChalaScreenV2>
  );
}

// ---------------- PROFILE ----------------
function ProfileScreenV2({ tweaks, isEtaMember = true }) {
  const Stat = ({ value, label }) => (
    <div style={{ flex: 1, padding: "20px 0", borderRight: `1px solid ${V2.hairline}` }}>
      <Numeric size={32} tweaks={tweaks}>{value}</Numeric>
      <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 8 }}>{label}</Label>
    </div>
  );
  const Pref = ({ label, value, last }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 20px",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
    }}>
      <Label tweaks={tweaks} color={V2.textFaint}>{label}</Label>
      <span style={{ fontSize: 14, fontWeight: 500, color: V2.text }}>{value}</span>
    </div>
  );
  return (
    <ChalaScreenV2 label="06 Profile" tweaks={tweaks}>
      <div style={{ flex: 1, padding: "12px 28px 0", overflow: "auto" }}>
        <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 8 }}>Profile</Label>
        <Heading size={36} weight={500} tweaks={tweaks} style={{ marginBottom: 28 }}>
          Alex<br />
          <span style={{ color: V2.textDim }}>Morgan.</span>
        </Heading>

        {/* Identity row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56,
            border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Heading size={20} weight={500} tweaks={tweaks}>AM</Heading>
          </div>
          <div>
            <Label tweaks={tweaks} color={V2.accent} style={{ marginBottom: 4 }}>Intermediate</Label>
            <Label tweaks={tweaks} color={V2.textFaint} size={9}>Member since Mar 2025</Label>
          </div>
        </div>

        {/* Stats — 3 cells, hairline divided */}
        <div style={{ display: "flex", border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, padding: "0 20px", marginBottom: 24 }}>
          <Stat value="14" label="Sessions" />
          <Stat value="11" label="Check-ins" />
          <div style={{ flex: 1, padding: "20px 0" }}>
            <Numeric size={32} tweaks={tweaks}>03</Numeric>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginTop: 8 }}>Streak</Label>
          </div>
        </div>

        {/* ETA Gym Pass — conditional, only for ETA members */}
        {isEtaMember && (
          <div style={{
            border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
            padding: "16px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 14,
          }}>
            {/* Mini QR — stylized 9×9 grid */}
            <div style={{
              width: 56, height: 56, background: "#fff", padding: 4,
              borderRadius: V2.radius, flexShrink: 0,
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: 0,
            }}>
              {Array.from({ length: 81 }).map((_, i) => {
                const r = Math.floor(i / 9), c = i % 9;
                // 3 corner finder squares
                const inFinder = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
                const onEdge = (r === 0 || r === 2 || c === 0 || c === 2) && r < 3 && c < 3;
                const corner = inFinder && ((r === 0 || r === 2 || c === 0 || c === 2) && (r < 3) && (c < 3));
                let fill = false;
                if (inFinder) {
                  // approximate finder pattern
                  const lr = r < 3 ? r : r - 6;
                  const lc = c < 3 ? c : c - 6;
                  fill = (lr === 0 || lr === 2 || lc === 0 || lc === 2) || (lr === 1 && lc === 1);
                } else {
                  // pseudo-random for visual texture
                  fill = ((r * 7 + c * 13 + r * c) % 3) === 0;
                }
                return <div key={i} style={{ background: fill ? "#000" : "#fff" }}></div>;
              })}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ fontSize: 14, color: V2.text, fontWeight: 500 }}>ETA Williamsburg</div>
              </div>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>FOUNDER · ETA-0042-7K9</Label>
            </div>
            <div style={{
              padding: "10px 14px",
              border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
              flexShrink: 0,
            }}>
              <Label tweaks={tweaks} color={V2.text} size={9}>Show</Label>
            </div>
          </div>
        )}

        {/* Training prefs */}
        <Label tweaks={tweaks} style={{ marginBottom: 12 }}>Training</Label>
        <div style={{ border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, marginBottom: 24 }}>
          <Pref label="Goal" value="Build Muscle" />
          <Pref label="Frequency" value="04 / week" />
          <Pref label="Units" value="lbs · imperial" last />
        </div>

        {/* Settings link */}
        <div style={{ border: `1px solid ${V2.hairline}`, borderRadius: V2.radius, padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Label tweaks={tweaks} color={V2.text}>Settings</Label>
          <Glyph name="arrow-right" size={14} color={V2.text} />
        </div>
      </div>
      <TabBarV2 active="profile" />
    </ChalaScreenV2>
  );
}

// ---------------- NUTRITION ----------------
// Dense, ordered: header date · macro rings · today's meals · water · wearable strip · body metrics
function NutritionScreenV2({ tweaks }) {
  // Macro ring (SVG circle stroke-dasharray) — pure monochrome, hairline track + bright arc
  const Ring = ({ pct, label, value, target, unit }) => {
    const r = 26;
    const c = 2 * Math.PI * r;
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="32" cy="32" r={r} fill="none" stroke={V2.hairlineStrong} strokeWidth="1.5" />
            <circle cx="32" cy="32" r={r} fill="none" stroke={V2.text} strokeWidth="1.5"
              strokeDasharray={`${(c * pct) / 100} ${c}`} strokeLinecap="butt" />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <Numeric size={14} weight={500} tweaks={tweaks}>{value}</Numeric>
            <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>/{target}{unit}</div>
          </div>
        </div>
        <Label tweaks={tweaks} color={V2.textDim} size={9}>{label}</Label>
      </div>
    );
  };

  // Meal row — hairline cell, time-numeric, food, kcal
  const Meal = ({ time, name, kcal, items }) => (
    <div style={{ padding: "16px 24px", borderBottom: `1px solid ${V2.hairline}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ width: 44, flexShrink: 0 }}>
        <Numeric size={11} weight={500} color={V2.textDim} tweaks={tweaks}>{time}</Numeric>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: V2.text, fontWeight: 500, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 11, color: V2.textFaint, lineHeight: 1.5 }}>{items}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <Numeric size={14} weight={500} tweaks={tweaks}>{kcal}</Numeric>
        <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em", marginTop: 2 }}>KCAL</div>
      </div>
    </div>
  );

  // Wearable stat — compact 4-up
  const Wear = ({ glyph, value, unit, label }) => (
    <div style={{ flex: 1, padding: "16px 12px", borderRight: `1px solid ${V2.hairline}`, display: "flex", flexDirection: "column", gap: 8 }}>
      <Glyph name={glyph} size={14} color={V2.textDim} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <Numeric size={18} weight={500} tweaks={tweaks}>{value}</Numeric>
        {unit && <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>{unit}</div>}
      </div>
      <Label tweaks={tweaks} color={V2.textFaint} size={8}>{label}</Label>
    </div>
  );

  // Body metric row
  const BodyRow = ({ label, value, unit, delta }) => (
    <div style={{ padding: "16px 24px", borderBottom: `1px solid ${V2.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Label tweaks={tweaks} color={V2.textDim} size={9}>{label}</Label>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <Numeric size={16} weight={500} tweaks={tweaks}>{value}</Numeric>
        <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>{unit}</div>
        {delta && <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral }}>{delta}</div>}
      </div>
    </div>
  );

  return (
    <ChalaScreenV2 label="05 Nutrition" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "8px 28px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>Today · Tue 14</Label>
            <Heading size={30} weight={500} tweaks={tweaks}>Fuel</Heading>
          </div>
          <div style={{
            width: 36, height: 36, border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ fontSize: 18, color: V2.text, fontWeight: 300, marginTop: -2 }}>+</div>
          </div>
        </div>
        <Rule />

        {/* Calorie banner */}
        <div style={{ padding: "20px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 8 }}>Remaining</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <Numeric size={42} weight={500} tweaks={tweaks}>684</Numeric>
              <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>KCAL</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em", marginBottom: 4 }}>1,816 / 2,500</div>
            <div style={{ width: 120, height: 2, background: V2.hairline, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "73%", background: V2.text }}></div>
            </div>
          </div>
        </div>

        {/* Macro rings */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 12 }}>
          <Ring pct={84} label="Protein" value={142} target={170} unit="g" />
          <Ring pct={68} label="Carbs"   value={188} target={275} unit="g" />
          <Ring pct={52} label="Fat"     value={43}  target={83}  unit="g" />
        </div>
        <Rule />

        {/* Meals */}
        <div style={{ padding: "20px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Meals · 3 logged</Label>
          <Label tweaks={tweaks} color={V2.text} size={9}>+ Add</Label>
        </div>
        <Rule />
        <Meal time="07:20" name="Oats & whey" kcal={420} items="Rolled oats · banana · whey · almond butter" />
        <Meal time="12:45" name="Chicken bowl" kcal={612} items="Grilled chicken · rice · avocado · greens" />
        <Meal time="16:10" name="Snack" kcal={184} items="Greek yogurt · honey · berries" />

        {/* Coach suggestion */}
        <div style={{ padding: "16px 24px 20px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 1, alignSelf: "stretch", background: V2.hairlineStrong, marginTop: 4 }}></div>
          <div style={{ flex: 1 }}>
            <Label tweaks={tweaks} color={V2.textDim} size={9} style={{ marginBottom: 6 }}>Chala suggests</Label>
            <div style={{ fontSize: 13, color: V2.textDim, lineHeight: 1.5 }}>
              You're 28g short on protein. <span style={{ color: V2.text, fontWeight: 500 }}>Salmon + sweet potato</span> tonight closes it cleanly.
            </div>
          </div>
        </div>
        <Rule />

        {/* Water */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label tweaks={tweaks} color={V2.textFaint}>Water</Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <Numeric size={14} weight={500} tweaks={tweaks}>1.6</Numeric>
              <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>/ 3.0 L</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 4 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                height: 28,
                background: i < 4 ? V2.text : "transparent",
                border: i < 4 ? "none" : `1px solid ${V2.hairlineStrong}`,
                borderRadius: V2.radius,
              }}></div>
            ))}
          </div>
        </div>
        <Rule />

        {/* Wearable strip */}
        <div style={{ padding: "20px 0 0 24px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Garmin · synced 12 min ago</Label>
        </div>
        <div style={{ display: "flex", marginTop: 16, borderTop: `1px solid ${V2.hairline}`, borderBottom: `1px solid ${V2.hairline}` }}>
          <Wear glyph="flame" value="2,884" unit="KCAL" label="Burned" />
          <Wear glyph="watch" value="78" unit="%"   label="Battery" />
          <Wear glyph="moon-z" value="7:42"          label="Sleep" />
          <div style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <Glyph name="bell" size={14} color={V2.textDim} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <Numeric size={18} weight={500} tweaks={tweaks}>62</Numeric>
              <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>BPM</div>
            </div>
            <Label tweaks={tweaks} color={V2.textFaint} size={8}>Resting HR</Label>
          </div>
        </div>

        {/* Body metrics */}
        <div style={{ padding: "20px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Body</Label>
        </div>
        <Rule />
        <BodyRow label="Weight"     value="184.2" unit="LB" delta="−0.4" />
        <BodyRow label="Body Fat"   value="14.8"  unit="%"  delta="−0.2" />
        <BodyRow label="HRV"        value="64"    unit="MS" delta="+3" />
        <BodyRow label="Steps"      value="9,420" unit=""   delta="" />

        <div style={{ height: 24 }}></div>
      </div>
      <TabBarV2 active="nutrition" />
    </ChalaScreenV2>
  );
}

// ---------------- SPORTS ----------------
// Hero: weekly mileage + load chart. Then activity types, recent feed, race countdown.
function SportsScreenV2({ tweaks }) {
  // Bar chart data — 7 days
  const days = [
    { d: "M", val: 38, label: "Run · 5.2mi" },
    { d: "T", val: 0,  label: "Rest" },
    { d: "W", val: 72, label: "Bike · 22mi" },
    { d: "T", val: 28, label: "BJJ · 75min" },
    { d: "F", val: 55, label: "Run · 7.4mi" },
    { d: "S", val: 90, label: "Long ride" },
    { d: "S", val: 0,  label: "Rest" },
  ];
  const max = 100;

  const Activity = ({ glyph, name, count }) => (
    <div style={{
      flex: 1, minWidth: 0,
      padding: "20px 14px",
      border: `1px solid ${V2.hairline}`,
      borderRadius: V2.radius,
      display: "flex", flexDirection: "column", gap: 12,
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", color: V2.textFaint }}>
        <Glyph name="more" size={12} color={V2.textFaint} />
      </div>
      <Glyph name={glyph} size={16} color={V2.textDim} />
      <div>
        <div style={{ fontSize: 13, color: V2.text, fontWeight: 500, marginBottom: 4 }}>{name}</div>
        <Numeric size={11} weight={500} color={V2.textFaint} tweaks={tweaks}>{count}</Numeric>
      </div>
    </div>
  );

  const Feed = ({ icon, title, meta, distance, unit, time, last }) => (
    <div style={{
      padding: "16px 24px",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 36, height: 36,
        border: `1px solid ${V2.hairlineStrong}`, borderRadius: V2.radius,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Glyph name={icon} size={14} color={V2.textDim} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: V2.text, fontWeight: 500, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.04em" }}>{meta}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "flex-end" }}>
          <Numeric size={15} weight={500} tweaks={tweaks}>{distance}</Numeric>
          <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>{unit}</div>
        </div>
        <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.04em", marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );

  return (
    <ChalaScreenV2 label="07 Sports" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Header */}
        <div style={{ padding: "8px 28px 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>Week 32 · Aug 11 – 17</Label>
            <Heading size={30} weight={500} tweaks={tweaks}>Sports</Heading>
          </div>
          <div style={{ padding: "6px 12px", border: `1px solid ${V2.hairlineStrong}`, fontSize: 10, color: V2.text, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
            Edit
          </div>
        </div>
        <Rule />

        {/* HERO — weekly mileage + load chart */}
        <div style={{ padding: "24px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 8 }}>Volume this week</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <Numeric size={48} weight={500} tweaks={tweaks}>34.6</Numeric>
                <div style={{ fontSize: 12, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>MI</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>Load</Label>
              <div style={{ fontSize: 13, color: V2.text, fontWeight: 500 }}>Optimal</div>
              <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.04em", marginTop: 2 }}>+12% vs last</div>
            </div>
          </div>

          {/* Bar chart — hairline baseline + bars */}
          <div style={{ position: "relative", height: 110 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, height: 1, background: V2.hairline }}></div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 22, display: "flex", alignItems: "flex-end", gap: 8 }}>
              {days.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{
                    width: "100%",
                    height: `${(d.val / max) * 100}%`,
                    minHeight: d.val > 0 ? 2 : 0,
                    background: d.val > 0 ? V2.text : "transparent",
                    border: d.val === 0 ? `1px dashed ${V2.hairlineStrong}` : "none",
                    borderBottom: d.val === 0 ? "none" : "none",
                  }}></div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: 8 }}>
              {days.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>{d.d}</div>
              ))}
            </div>
          </div>
        </div>
        <Rule style={{ marginTop: 20 }} />

        {/* Race countdown */}
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${V2.hairline}` }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>Next race</Label>
            <div style={{ fontSize: 16, color: V2.text, fontWeight: 500, marginBottom: 4 }}>NYC Marathon</div>
            <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.04em" }}>Nov 02 · Sun · 26.2 mi</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end" }}>
              <Numeric size={36} weight={500} tweaks={tweaks}>78</Numeric>
              <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>DAYS</div>
            </div>
            <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.04em", marginTop: 4 }}>Plan · Week 04 / 16</div>
          </div>
        </div>

        {/* Activity grid */}
        <div style={{ padding: "20px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Activities · this month</Label>
        </div>
        <div style={{ padding: "0 24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <Activity glyph="sports" name="Run"     count="08 logged" />
          <Activity glyph="watch"  name="Ride"    count="03 logged" />
          <Activity glyph="droplet" name="Swim"   count="02 logged" />
          <Activity glyph="flame"  name="BJJ"     count="06 logged" />
          <Activity glyph="settings" name="Climb" count="04 logged" />
          <Activity glyph="pin"    name="Hike"    count="01 logged" />
        </div>

        {/* Plan a run — AI routes CTA */}
        <div style={{ padding: "8px 24px 24px" }}>
          <div style={{
            border: `1px solid ${V2.hairlineStrong}`,
            padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 36, height: 36, flexShrink: 0,
                border: `1px solid ${V2.hairlineStrong}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Glyph name="pin" size={14} color={V2.text} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: V2.text, fontWeight: 500, marginBottom: 3 }}>Plan a run</div>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>COACH · GENERATE 3 ROUTES</div>
              </div>
            </div>
            <Glyph name="chevron-right" size={14} color={V2.textDim} />
          </div>
        </div>

        {/* Recent feed */}
        <div style={{ padding: "8px 24px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Recent · synced from Garmin</Label>
          <Label tweaks={tweaks} color={V2.text} size={9}>See all</Label>
        </div>
        <Rule />
        <Feed icon="sports"  title="Easy run · East River"  meta="08:32 PACE · 156 BPM" distance="5.2"  unit="MI"  time="YESTERDAY" />
        <Feed icon="watch"   title="Long ride · Nyack loop" meta="220 W AVG · 18.4 MPH"  distance="42.1" unit="MI"  time="SAT" />
        <Feed icon="flame"   title="BJJ · open mat"         meta="HEART ZONE 3 · 75 MIN" distance="—"    unit=""    time="FRI" />
        <Feed icon="droplet" title="Pool · masters set"     meta="1:42 / 100Y · 2400Y"   distance="2400" unit="YD"  time="THU" last />

        <div style={{ height: 24 }}></div>
      </div>
      <TabBarV2 active="sports" />
    </ChalaScreenV2>
  );
}

// ---------------- SETTINGS ----------------
function SettingsScreenV2({ tweaks }) {
  const Row = ({ label, value, glyph, last, danger }) => (
    <div style={{
      padding: "18px 24px",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        {glyph && <Glyph name={glyph} size={14} color={V2.textDim} />}
        <span style={{ fontSize: 14, color: danger ? V2.text : V2.text, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: V2.textFaint }}>
        {value && <span style={{ fontSize: 12, color: V2.textDim }}>{value}</span>}
        <Glyph name="chevron-right" size={12} color={V2.textFaint} />
      </div>
    </div>
  );
  const SectionLabel = ({ children }) => (
    <div style={{ padding: "24px 24px 10px" }}>
      <Label tweaks={tweaks} color={V2.textFaint}>{children}</Label>
    </div>
  );

  return (
    <ChalaScreenV2 label="08 Settings" tweaks={tweaks}>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {/* Header — back chevron + title */}
        <div style={{ padding: "8px 24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 4 }}>Profile · Settings</Label>
            <Heading size={26} weight={500} tweaks={tweaks}>Preferences</Heading>
          </div>
        </div>
        <Rule />

        {/* Account */}
        <SectionLabel>Account</SectionLabel>
        <Rule />
        <Row glyph="profile" label="Email" value="alex@morgan.co" />
        <Row glyph="settings" label="Password" value="Last changed 24d" />
        <Row glyph="bell" label="Two-factor" value="On" last />

        {/* Sports & activities */}
        <SectionLabel>Training</SectionLabel>
        <Rule />
        <Row glyph="sports" label="Sports & activities" value="06 tracked" />
        <Row glyph="flame" label="Goals & weekly volume" value="3 active" last />

        {/* Notifications */}
        <SectionLabel>Notifications</SectionLabel>
        <Rule />
        <Row glyph="bell" label="Workout reminders" value="On" />
        <Row glyph="chat" label="Coach pings" value="Smart" />
        <Row glyph="moon-z" label="Quiet hours" value="22:00 – 07:00" last />

        {/* Units */}
        <SectionLabel>Units & format</SectionLabel>
        <Rule />
        <Row label="Weight" value="lbs" />
        <Row label="Distance" value="miles" />
        <Row label="Energy" value="kcal" last />

        {/* Connected apps */}
        <SectionLabel>Connected apps</SectionLabel>
        <Rule />
        <Row glyph="watch" label="Garmin" value="Connected" />
        <Row glyph="apple" label="Apple Health" value="Connected" />
        <Row glyph="sports" label="Strava" value="Off" />
        <Row glyph="flame" label="Whoop" value="Off" last />

        {/* Privacy */}
        <SectionLabel>Privacy & data</SectionLabel>
        <Rule />
        <Row label="Data sharing" value="Coach only" />
        <Row label="Export my data" />
        <Row label="Delete account" danger last />

        <div style={{ height: 32 }}></div>
        <div style={{ padding: "0 24px 24px" }}>
          <Label tweaks={tweaks} color={V2.textFaint} size={9}>Chala · v2.4.1 · build 2025.08.14</Label>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// ---------------- GYM PASS — fullscreen QR view ----------------
function GymPassScreenV2({ tweaks }) {
  // Render QR as a stylized 21x21 grid — pure monochrome blocks
  // Static seeded pattern for visual consistency.
  const size = 21;
  const seed = 1664525;
  let x = seed;
  const cells = [];
  for (let i = 0; i < size * size; i++) {
    x = (x * 22695477 + 1) >>> 0;
    cells.push((x >>> 16) & 1);
  }
  // Force 3 corner finder squares
  const setCell = (r, c, v) => { cells[r * size + c] = v; };
  const drawFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
      const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      setCell(r0 + r, c0 + c, isOuter || isInner ? 1 : 0);
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  return (
    <ChalaScreenV2 label="09 Gym Pass" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "8px 24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Gym Pass</Label>
          <Glyph name="sun" size={18} color={V2.text} />
        </div>
        <Rule />

        {/* Tier + location */}
        <div style={{ padding: "32px 32px 0", textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            padding: "4px 10px",
            border: `1px solid ${V2.hairlineStrong}`,
            borderRadius: V2.radius,
            marginBottom: 16,
          }}>
            <Label tweaks={tweaks} color={V2.text} size={9}>Founder · 002</Label>
          </div>
          <Heading size={26} weight={500} tweaks={tweaks} style={{ marginBottom: 6 }}>ETA Williamsburg</Heading>
          <div style={{ fontSize: 12, color: V2.textFaint, fontFamily: getType(tweaks).numeral, letterSpacing: "0.06em" }}>
            195 KENT AVE · BROOKLYN
          </div>
        </div>

        {/* QR */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px" }}>
          <div style={{
            background: "#fff",
            padding: 18,
            borderRadius: V2.radius,
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${size}, 9px)`,
              gridAutoRows: "9px",
              gap: 0,
            }}>
              {cells.map((v, i) => (
                <div key={i} style={{ background: v ? "#000" : "#fff" }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Member meta */}
        <div style={{ padding: "0 24px 16px", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${V2.hairline}`, paddingTop: 18 }}>
          <div>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Member ID</Label>
            <div style={{ fontSize: 13, color: V2.text, fontFamily: getType(tweaks).numeral, fontWeight: 500, letterSpacing: "0.06em" }}>ETA-0042-7K9</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Last check-in</Label>
            <div style={{ fontSize: 13, color: V2.text, fontFamily: getType(tweaks).numeral, fontWeight: 500, letterSpacing: "0.04em" }}>Today · 06:42</div>
          </div>
        </div>

        {/* Wallet button */}
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{
            border: `1px solid ${V2.hairlineStrong}`,
            borderRadius: V2.radius,
            padding: "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <Glyph name="wallet" size={14} color={V2.text} />
            <span style={{ fontSize: 13, color: V2.text, fontWeight: 500, letterSpacing: "0.02em" }}>Add to Apple Wallet</span>
          </div>
        </div>

        <div style={{ padding: "0 24px 16px", textAlign: "center" }}>
          <Label tweaks={tweaks} color={V2.textFaint} size={8}>Brightness boosted · auto-dim in 30s</Label>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// MAP PRIMITIVE — black canvas + faint grid + white route trace
// =================================================================================
// SVG-based, viewBox 0 0 400 280. Pass a `path` string (SVG path d-attr)
// for the actual route. `start` and `end` are [x,y] pairs in viewBox coords.
// Optional `mileMarkers` is an array of [x,y] pairs rendered as small ticks.
function MapTrace({
  path,
  start,
  end,
  mileMarkers = [],
  height = 280,
  showCompass = true,
  showScale = true,
  showGrid = true,
  showCityHints = true,
}) {
  return (
    <div style={{ position: "relative", width: "100%", height, background: "#000", overflow: "hidden" }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
        {/* Faint grid */}
        {showGrid && (
          <g stroke="#161616" strokeWidth="0.5">
            <line x1="0" y1="40" x2="400" y2="40" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="120" x2="400" y2="120" />
            <line x1="0" y1="160" x2="400" y2="160" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="0" y1="240" x2="400" y2="240" />
            <line x1="50"  y1="0" x2="50"  y2="280" />
            <line x1="100" y1="0" x2="100" y2="280" />
            <line x1="150" y1="0" x2="150" y2="280" />
            <line x1="200" y1="0" x2="200" y2="280" />
            <line x1="250" y1="0" x2="250" y2="280" />
            <line x1="300" y1="0" x2="300" y2="280" />
            <line x1="350" y1="0" x2="350" y2="280" />
          </g>
        )}

        {/* Faint city hints — sparse street/park outlines as visual texture */}
        {showCityHints && (
          <g stroke="#1a1a1a" strokeWidth="0.6" fill="none">
            {/* a couple of long avenues */}
            <path d="M0 60 L400 70" />
            <path d="M0 145 L400 155" />
            <path d="M0 220 L400 215" />
            {/* a park outline */}
            <path d="M260 95 L340 100 L335 165 L255 160 Z" />
            {/* a waterway */}
            <path d="M0 250 Q120 240 240 255 T400 245" stroke="#181818" strokeWidth="1" />
          </g>
        )}

        {/* Route — bold white trace */}
        <path
          d={path}
          stroke="#ffffff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Mile markers */}
        {mileMarkers.map(([mx, my], i) => (
          <g key={i}>
            <circle cx={mx} cy={my} r="3" fill="#000" stroke="#fff" strokeWidth="1.5" />
          </g>
        ))}

        {/* Start (filled) and End (ring) */}
        {start && (
          <g>
            <circle cx={start[0]} cy={start[1]} r="6" fill="#fff" />
            <circle cx={start[0]} cy={start[1]} r="11" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.4" />
          </g>
        )}
        {end && (
          <g>
            <circle cx={end[0]} cy={end[1]} r="6" fill="#000" stroke="#fff" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Compass */}
      {showCompass && (
        <div style={{ position: "absolute", top: 14, right: 14, width: 26, height: 26, border: `1px solid ${V2.hairlineStrong}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
          <svg width="10" height="14" viewBox="0 0 10 14">
            <path d="M5 1 L8 13 L5 10 L2 13 Z" fill="#fff" />
          </svg>
        </div>
      )}

      {/* Scale bar */}
      {showScale && (
        <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 36, height: 1, background: "#fff" }}></div>
          <div style={{ width: 1, height: 5, background: "#fff", marginLeft: -3 }}></div>
          <div style={{ width: 1, height: 5, background: "#fff", marginLeft: -1 }}></div>
          <div style={{ fontSize: 9, color: V2.textDim, fontFamily: "ui-monospace, 'Geist Mono', monospace", letterSpacing: "0.08em", marginLeft: 2 }}>0.5 MI</div>
        </div>
      )}

      {/* START / END labels */}
      {start && (
        <div style={{ position: "absolute", top: `${(start[1] / 280) * 100}%`, left: `${(start[0] / 400) * 100}%`, transform: "translate(10px, -50%)", fontSize: 9, color: "#fff", fontFamily: "ui-monospace, 'Geist Mono', monospace", letterSpacing: "0.1em" }}>START</div>
      )}
      {end && (
        <div style={{ position: "absolute", top: `${(end[1] / 280) * 100}%`, left: `${(end[0] / 400) * 100}%`, transform: "translate(10px, -50%)", fontSize: 9, color: "#fff", fontFamily: "ui-monospace, 'Geist Mono', monospace", letterSpacing: "0.1em" }}>END</div>
      )}
    </div>
  );
}

// =================================================================================
// RUN DETAIL SCREEN — drilled in from Sports recent feed
// =================================================================================
function RunDetailScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // The route as a path inside viewBox 0 0 400 280
  // East River loop — feels like a city run with a curve along water
  const routePath = "M60 220 L75 195 L95 175 L120 155 L150 140 L185 130 L220 120 L250 105 L275 95 L290 80 L300 65 L295 50 L280 45 L255 55 L225 70 L195 85 L165 100 L135 115 L110 135 L85 160 L65 190 Z";
  const start = [60, 220];
  const end = [60, 220]; // loop
  const mileMarkers = [
    [120, 155],
    [220, 120],
    [295, 50],
    [165, 100],
    [85, 160],
  ];

  // Splits — 5 miles
  const splits = [
    { mi: 1, time: "08:42", pace: "08:42", hr: 148, elev: "+18" },
    { mi: 2, time: "17:18", pace: "08:36", hr: 154, elev: "+24" },
    { mi: 3, time: "25:48", pace: "08:30", hr: 158, elev: "+12" },
    { mi: 4, time: "34:22", pace: "08:34", hr: 161, elev: "−08" },
    { mi: 5, time: "42:48", pace: "08:26", hr: 163, elev: "−16" },
  ];

  // HR zones — % of run spent in each
  const zones = [
    { z: 1, label: "Recovery",  pct: 6,  range: "<128" },
    { z: 2, label: "Easy",      pct: 22, range: "128–142" },
    { z: 3, label: "Aerobic",   pct: 48, range: "142–158" },
    { z: 4, label: "Threshold", pct: 21, range: "158–172" },
    { z: 5, label: "Max",       pct: 3,  range: ">172" },
  ];

  // Elevation profile — 32 sample points (ft)
  const elev = [12, 14, 18, 22, 26, 32, 38, 44, 48, 52, 58, 62, 68, 72, 78, 84, 88, 92, 90, 86, 80, 74, 68, 60, 52, 44, 38, 32, 26, 22, 18, 14];
  const elevMax = Math.max(...elev);
  const elevMin = Math.min(...elev);
  const elevRange = elevMax - elevMin;
  const elevPath = elev.map((v, i) => {
    const x = (i / (elev.length - 1)) * 100;
    const y = 100 - ((v - elevMin) / elevRange) * 100;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  return (
    <ChalaScreenV2 label="10 Run detail" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Run · Yesterday · 06:42</Label>
          <Glyph name="settings" size={18} color={V2.text} />
        </div>

        {/* HERO MAP */}
        <MapTrace
          path={routePath}
          start={start}
          end={end}
          mileMarkers={mileMarkers}
          height={280}
        />

        {/* Watch flyover CTA */}
        <div style={{ padding: "12px 24px 4px", borderBottom: `1px solid ${V2.hairline}` }}>
          <div style={{
            padding: "12px 14px",
            border: `1px solid ${V2.hairlineStrong}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, border: `1px solid ${V2.text}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Glyph name="play" size={11} color={V2.text} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: V2.text, fontWeight: 500, marginBottom: 2 }}>Watch flyover</div>
                <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>3D PLAYBACK · 0:42</div>
              </div>
            </div>
            <Glyph name="chevron-right" size={14} color={V2.textDim} />
          </div>
        </div>

        {/* Title + key stats */}
        <div style={{ padding: "20px 24px 4px" }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>East River loop · Brooklyn</Label>
          <Heading size={26} weight={500} tweaks={tweaks} style={{ marginBottom: 18 }}>Easy run</Heading>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: `1px solid ${V2.hairline}`, borderBottom: `1px solid ${V2.hairline}`, padding: "20px 0" }}>
            <div>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 6 }}>Distance</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Numeric size={28} weight={500} tweaks={tweaks}>5.21</Numeric>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>MI</div>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 16 }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 6 }}>Time</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Numeric size={28} weight={500} tweaks={tweaks}>42:48</Numeric>
              </div>
            </div>
            <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 16 }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 6 }}>Avg pace</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Numeric size={28} weight={500} tweaks={tweaks}>08:32</Numeric>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>/MI</div>
              </div>
            </div>
          </div>
        </div>

        {/* SPLITS table */}
        <div style={{ padding: "24px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Splits</Label>
        </div>
        <div style={{ padding: "0 24px" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 1fr 1fr", gap: 12, padding: "8px 0", borderBottom: `1px solid ${V2.hairlineStrong}` }}>
            <Label tweaks={tweaks} color={V2.textFaint} size={9}>MI</Label>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ textAlign: "right" }}>TIME</Label>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ textAlign: "right" }}>PACE</Label>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ textAlign: "right" }}>BPM</Label>
            <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ textAlign: "right" }}>ELEV</Label>
          </div>
          {splits.map((s, i) => {
            // Bar overlay = pace relative; faster pace = longer bar
            const allPaces = splits.map(x => parseInt(x.pace.split(":")[0]) * 60 + parseInt(x.pace.split(":")[1]));
            const fastest = Math.min(...allPaces);
            const slowest = Math.max(...allPaces);
            const myPace = parseInt(s.pace.split(":")[0]) * 60 + parseInt(s.pace.split(":")[1]);
            const barPct = slowest === fastest ? 100 : 100 - ((myPace - fastest) / (slowest - fastest)) * 60; // 40-100%
            return (
              <div key={i} style={{ position: "relative", padding: "12px 0", borderBottom: i === splits.length - 1 ? "none" : `1px solid ${V2.hairline}` }}>
                <div style={{ position: "absolute", left: 0, right: `${100 - barPct}%`, top: 0, bottom: 0, background: "rgba(255,255,255,0.025)" }}></div>
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "32px 1fr 1fr 1fr 1fr", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: V2.text, fontFamily: numFont, fontWeight: 500 }}>{String(s.mi).padStart(2, "0")}</div>
                  <div style={{ fontSize: 13, color: V2.text, fontFamily: numFont, textAlign: "right" }}>{s.time}</div>
                  <div style={{ fontSize: 13, color: V2.text, fontFamily: numFont, textAlign: "right", fontWeight: 500 }}>{s.pace}</div>
                  <div style={{ fontSize: 13, color: V2.textDim, fontFamily: numFont, textAlign: "right" }}>{s.hr}</div>
                  <div style={{ fontSize: 13, color: V2.textDim, fontFamily: numFont, textAlign: "right" }}>{s.elev}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* HR ZONES */}
        <div style={{ padding: "32px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Label tweaks={tweaks} color={V2.textFaint}>Heart rate</Label>
            <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>AVG 156 · MAX 168 BPM</div>
          </div>
        </div>
        <div style={{ padding: "16px 24px 0" }}>
          {/* Stacked bar */}
          <div style={{ display: "flex", height: 8, marginBottom: 14, overflow: "hidden" }}>
            {zones.map((z, i) => (
              <div key={i} style={{
                width: `${z.pct}%`,
                background: z.z === 3 ? "#fff" : z.z === 4 ? "rgba(255,255,255,0.7)" : z.z === 2 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
                borderRight: i === zones.length - 1 ? "none" : "1px solid #000",
              }}></div>
            ))}
          </div>
          {/* Zone rows */}
          {zones.map((z, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr 60px 50px", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i === zones.length - 1 ? "none" : `1px solid ${V2.hairline}` }}>
              <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>Z{z.z}</div>
              <div style={{ fontSize: 13, color: V2.text }}>{z.label}</div>
              <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em", textAlign: "right" }}>{z.range}</div>
              <div style={{ fontSize: 13, color: V2.text, fontFamily: numFont, fontWeight: 500, textAlign: "right" }}>{z.pct}%</div>
            </div>
          ))}
        </div>

        {/* ELEVATION */}
        <div style={{ padding: "32px 24px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Label tweaks={tweaks} color={V2.textFaint}>Elevation</Label>
            <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>+88 / −88 FT · GAIN 96</div>
          </div>
        </div>
        <div style={{ padding: "16px 24px 0" }}>
          <div style={{ position: "relative", height: 80, border: `1px solid ${V2.hairline}` }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d={`${elevPath} L100 100 L0 100 Z`} fill="rgba(255,255,255,0.06)" />
              <path d={elevPath} stroke="#fff" strokeWidth="0.7" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{ position: "absolute", left: 6, top: 4, fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{elevMax} FT</div>
            <div style={{ position: "absolute", left: 6, bottom: 4, fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{elevMin} FT</div>
          </div>
        </div>

        {/* CADENCE / STRIDE / POWER */}
        <div style={{ padding: "32px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Form & power</Label>
        </div>
        <div style={{ padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: `1px solid ${V2.hairline}` }}>
          {[
            { label: "Cadence",      val: "172",  unit: "SPM" },
            { label: "Stride",       val: "1.21", unit: "M" },
            { label: "Power",        val: "264",  unit: "W" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "16px 14px", borderLeft: i === 0 ? "none" : `1px solid ${V2.hairline}` }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 8 }}>{m.label}</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <Numeric size={20} weight={500} tweaks={tweaks}>{m.val}</Numeric>
                <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{m.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* WEATHER */}
        <div style={{ padding: "32px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Conditions</Label>
        </div>
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ border: `1px solid ${V2.hairline}`, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Glyph name="sun" size={18} color={V2.text} />
              <div>
                <div style={{ fontSize: 13, color: V2.text, fontWeight: 500 }}>Clear · sunrise</div>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em", marginTop: 3 }}>WIND 6 MPH NE</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
              <div style={{ textAlign: "right" }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={8} style={{ marginBottom: 3 }}>TEMP</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "flex-end" }}>
                  <Numeric size={18} weight={500} tweaks={tweaks}>64</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>°F</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={8} style={{ marginBottom: 3 }}>HUM</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "flex-end" }}>
                  <Numeric size={18} weight={500} tweaks={tweaks}>72</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// AI ROUTES SCREEN — generated routes from Coach
// =================================================================================
function AIRoutesScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // 1 hero + 2 alternates
  // Each route: path, start/end, plus meta
  const hero = {
    name: "Greenpoint loop · waterfront",
    path: "M50 220 L65 200 L85 180 L115 160 L150 145 L190 138 L230 130 L265 115 L290 95 L305 75 L300 55 L280 50 L250 60 L215 75 L180 90 L150 105 L120 125 L90 150 L70 180 L55 210 Z",
    start: [50, 220],
    end: [50, 220],
    mileMarkers: [[150, 145], [290, 95], [180, 90], [90, 150]],
    distance: "6.04",
    estTime: "51:30",
    elevation: "+98",
    surface: "70% road · 30% park",
    safety: "A",
    water: 3,
    lighting: "Lit · sunset+",
    avgPace: "08:32",
    type: "LOOP",
  };

  const alt1 = {
    name: "Out & back · East River",
    path: "M40 200 L70 180 L110 165 L155 150 L200 138 L245 128 L285 120 L320 115 L350 110 L355 100",
    start: [40, 200],
    end: [355, 100],
    mileMarkers: [[155, 150], [285, 120]],
    distance: "6.18",
    estTime: "52:45",
    elevation: "+42",
    surface: "100% road",
    safety: "B+",
    water: 2,
    lighting: "Lit",
    avgPace: "08:32",
    type: "OUT & BACK",
  };

  const alt2 = {
    name: "McCarren park · loops",
    path: "M180 180 Q120 160 100 110 Q120 60 200 70 Q280 80 290 130 Q280 180 220 185 Z M180 180 Q150 220 110 220 Q70 220 60 180",
    start: [180, 180],
    end: [60, 180],
    mileMarkers: [[100, 110], [290, 130]],
    distance: "5.85",
    estTime: "49:55",
    elevation: "+62",
    surface: "20% road · 80% park",
    safety: "A+",
    water: 4,
    lighting: "Partial",
    avgPace: "08:32",
    type: "LOOP",
  };

  const Chip = ({ label, value, active }) => (
    <div style={{
      flexShrink: 0,
      padding: "10px 14px",
      border: `1px solid ${active ? V2.text : V2.hairlineStrong}`,
      borderRadius: V2.radius,
      display: "flex", flexDirection: "column", gap: 3,
      minWidth: 92,
      background: active ? "rgba(255,255,255,0.04)" : "transparent",
    }}>
      <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 13, color: V2.text, fontWeight: 500 }}>{value}</div>
    </div>
  );

  const RouteMeta = ({ icon, label, value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <Glyph name={icon} size={12} color={V2.textDim} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: V2.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      </div>
    </div>
  );

  const AlternateCard = ({ r }) => (
    <div style={{ border: `1px solid ${V2.hairline}`, marginBottom: 12 }}>
      <div style={{ display: "flex" }}>
        <div style={{ width: 130, height: 130, flexShrink: 0, borderRight: `1px solid ${V2.hairline}` }}>
          <MapTrace path={r.path} start={r.start} end={r.end} mileMarkers={r.mileMarkers} height={130} showCompass={false} showScale={false} showCityHints={false} />
        </div>
        <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: V2.text, fontWeight: 500, lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em", border: `1px solid ${V2.hairlineStrong}`, padding: "2px 5px", flexShrink: 0 }}>{r.type}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <Numeric size={20} weight={500} tweaks={tweaks}>{r.distance}</Numeric>
                <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>MI</div>
              </div>
              <div style={{ fontSize: 11, color: V2.textDim, fontFamily: numFont }}>· {r.estTime}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em", flexWrap: "wrap" }}>
            <span>↑ {r.elevation} FT</span>
            <span>· SAFE {r.safety}</span>
            <span>· {r.water} H₂O</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ChalaScreenV2 label="11 AI routes" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Plan a run</Label>
          <Glyph name="settings" size={18} color={V2.text} />
        </div>
        <Rule />

        {/* Title */}
        <div style={{ padding: "20px 24px 6px" }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>Coach generated · 3 routes</Label>
          <Heading size={28} weight={500} tweaks={tweaks}>Tue · easy 6mi</Heading>
        </div>

        {/* INPUT CHIPS — horizontal scroll */}
        <div style={{ padding: "16px 0 4px", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 8, padding: "0 24px" }}>
            <Chip label="Distance" value="6 mi" active />
            <Chip label="Time"     value="≈ 50 min" />
            <Chip label="Surface"  value="Road + park" />
            <Chip label="Elev"     value="Flat–rolling" />
            <Chip label="Shape"    value="Loop" />
            <Chip label="Avoid"    value="Traffic" />
          </div>
        </div>
        <div style={{ padding: "10px 24px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <Glyph name="chevron-right" size={11} color={V2.textFaint} />
          <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>MATCHED TO YOUR LAST WED EASY · 6.04 MI</div>
        </div>

        {/* HERO ROUTE CARD */}
        <div style={{ padding: "20px 24px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <Label tweaks={tweaks} color={V2.text} size={10}>Recommended</Label>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>01 / 03</div>
          </div>
        </div>
        <div style={{ margin: "0 24px", border: `1px solid ${V2.hairlineStrong}` }}>
          <MapTrace path={hero.path} start={hero.start} end={hero.end} mileMarkers={hero.mileMarkers} height={220} />

          <div style={{ padding: "16px 18px 14px", borderTop: `1px solid ${V2.hairline}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: V2.text, fontWeight: 500, marginBottom: 4 }}>{hero.name}</div>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{hero.type} · STARTS AT 195 KENT AVE</div>
              </div>
              <div style={{ flexShrink: 0, padding: "3px 7px", border: `1px solid ${V2.text}`, fontSize: 9, color: V2.text, fontFamily: numFont, letterSpacing: "0.1em" }}>BEST MATCH</div>
            </div>

            {/* Big stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderTop: `1px solid ${V2.hairline}`, borderBottom: `1px solid ${V2.hairline}`, padding: "14px 0", marginBottom: 14 }}>
              <div>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Distance</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={22} weight={500} tweaks={tweaks}>{hero.distance}</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>MI</div>
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 14 }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Est time</Label>
                <Numeric size={22} weight={500} tweaks={tweaks}>{hero.estTime}</Numeric>
                <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em", marginTop: 2 }}>AT {hero.avgPace}/MI</div>
              </div>
              <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 14 }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Elevation</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={22} weight={500} tweaks={tweaks}>{hero.elevation}</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>FT</div>
                </div>
              </div>
            </div>

            {/* Meta row 1 */}
            <div style={{ display: "flex", gap: 0, marginBottom: 12 }}>
              <RouteMeta icon="pin"     label="Surface"  value={hero.surface} />
              <RouteMeta icon="sun"     label="Lighting" value={hero.lighting} />
            </div>
            {/* Meta row 2 */}
            <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
              <RouteMeta icon="droplet" label="Water" value={`${hero.water} stops`} />
              <RouteMeta icon="flame"   label="Safety" value={`Score ${hero.safety}`} />
            </div>

            {/* Strava-like crowd line */}
            <div style={{ borderTop: `1px solid ${V2.hairline}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em", marginBottom: 3 }}>OTHER RUNNERS HERE</div>
                <div style={{ fontSize: 12, color: V2.text }}>Avg pace · 08:14 / mi</div>
              </div>
              <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>342 RUNS · LAST 30D</div>
            </div>
          </div>

          {/* Action bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${V2.hairlineStrong}` }}>
            <div style={{ padding: "16px 0", textAlign: "center", borderRight: `1px solid ${V2.hairline}`, fontSize: 12, color: V2.textDim, fontWeight: 500, letterSpacing: "0.04em" }}>
              Save
            </div>
            <div style={{ padding: "16px 0", textAlign: "center", background: V2.text, color: V2.bg, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              Start run →
            </div>
          </div>
        </div>

        {/* ALTERNATES */}
        <div style={{ padding: "28px 24px 10px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Alternates</Label>
        </div>
        <div style={{ padding: "0 24px 32px" }}>
          <AlternateCard r={alt1} />
          <AlternateCard r={alt2} />

          {/* Regenerate */}
          <div style={{ marginTop: 4, padding: "14px 0", border: `1px dashed ${V2.hairlineStrong}`, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: V2.textDim, letterSpacing: "0.04em" }}>↻  Regenerate · ask Coach for variations</div>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// WORKOUT SUMMARY — full-screen, auto-shown when run/workout ends
// =================================================================================
function WorkoutSummaryScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  return (
    <ChalaScreenV2 label="12 Workout summary" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar — close + share */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <Label tweaks={tweaks} color={V2.textFaint}>Workout complete</Label>
          <div style={{ fontSize: 11, color: V2.text, fontWeight: 500, letterSpacing: "0.04em" }}>Share</div>
        </div>
        <Rule />

        {/* HERO — celebratory */}
        <div style={{ padding: "32px 28px 28px", borderBottom: `1px solid ${V2.hairline}` }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 8 }}>Easy run · East River loop</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
            <Numeric size={88} weight={500} tweaks={tweaks} style={{ lineHeight: 0.95 }}>5.21</Numeric>
            <div style={{ fontSize: 14, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>MI</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: `1px solid ${V2.hairline}`, paddingTop: 18 }}>
            <div>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 5 }}>Time</Label>
              <Numeric size={22} weight={500} tweaks={tweaks}>42:48</Numeric>
            </div>
            <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 18 }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 5 }}>Avg pace</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <Numeric size={22} weight={500} tweaks={tweaks}>08:32</Numeric>
                <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont }}>/MI</div>
              </div>
            </div>
          </div>
        </div>

        {/* PR badges */}
        <div style={{ padding: "20px 24px 8px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Records</Label>
        </div>
        <div style={{ padding: "0 24px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Fastest mile",    val: "07:48", sub: "MI 05 · prev 07:54" },
            { label: "Longest streak",  val: "12",    sub: "DAYS · since Aug 02", unit: "" },
          ].map((pr, i) => (
            <div key={i} style={{ border: `1px solid ${V2.text}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, border: `1px solid ${V2.text}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: V2.text, fontFamily: numFont, fontWeight: 600, letterSpacing: "0.04em" }}>PR</div>
                <div>
                  <div style={{ fontSize: 13, color: V2.text, fontWeight: 500, marginBottom: 2 }}>{pr.label}</div>
                  <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{pr.sub}</div>
                </div>
              </div>
              <Numeric size={20} weight={500} tweaks={tweaks}>{pr.val}</Numeric>
            </div>
          ))}
        </div>

        <Rule />

        {/* Coach quick take */}
        <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${V2.hairline}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, background: V2.accent, borderRadius: "50%" }}></div>
            <Label tweaks={tweaks} color={V2.text}>Coach</Label>
          </div>
          <div style={{ fontSize: 16, color: V2.text, lineHeight: 1.5, marginBottom: 12 }}>
            Strong negative split — last two miles were your fastest. HR stayed in zone 3 the whole way.
          </div>
          <div style={{ fontSize: 13, color: V2.textDim, lineHeight: 1.5 }}>
            Tomorrow's session: short tempo. You're trending well for the marathon plan.
          </div>
        </div>

        {/* Comparison to last similar */}
        <div style={{ padding: "24px 24px 8px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>vs. last easy run · Aug 09</Label>
        </div>
        <div style={{ padding: "0 24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: `1px solid ${V2.hairline}` }}>
          {[
            { label: "Distance", a: "5.21", b: "5.04", unit: "MI", delta: "+0.17", up: true },
            { label: "Pace",     a: "08:32", b: "08:48", unit: "/MI", delta: "−16s", up: true },
            { label: "Avg HR",   a: "156",  b: "152",  unit: "BPM", delta: "+4",   up: false },
          ].map((c, i) => (
            <div key={i} style={{ padding: "14px 12px", borderLeft: i === 0 ? "none" : `1px solid ${V2.hairline}` }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 6 }}>{c.label}</Label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 4 }}>
                <Numeric size={16} weight={500} tweaks={tweaks}>{c.a}</Numeric>
                <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>{c.unit}</div>
              </div>
              <div style={{ fontSize: 10, color: c.up ? V2.text : V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>
                {c.up ? "↑" : "↓"} {c.delta}
              </div>
            </div>
          ))}
        </div>

        <Rule />

        {/* Mood / effort rating */}
        <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${V2.hairline}` }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 14 }}>How did it feel?</Label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const sel = n === 3;
              return (
                <div key={n} style={{
                  padding: "16px 0",
                  border: `1px solid ${sel ? V2.text : V2.hairlineStrong}`,
                  background: sel ? "rgba(255,255,255,0.04)" : "transparent",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 16, color: V2.text, fontFamily: numFont, fontWeight: 500, marginBottom: 4 }}>{n}</div>
                  <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>
                    {n === 1 ? "TOUGH" : n === 2 ? "HARD" : n === 3 ? "STEADY" : n === 4 ? "EASY" : "FLOAT"}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em" }}>RPE 3 · STEADY · LEGS FELT GOOD</div>
        </div>

        {/* Share card preview */}
        <div style={{ padding: "24px 24px 8px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Share card · ready to post</Label>
        </div>
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ aspectRatio: "1 / 1", background: "#000", border: `1px solid ${V2.hairlineStrong}`, position: "relative", overflow: "hidden" }}>
            {/* Mini route as background */}
            <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <g stroke="#161616" strokeWidth="0.5">
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="200" x2="400" y2="200" />
                <line x1="0" y1="300" x2="400" y2="300" />
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
              </g>
              <path d="M80 320 L100 280 L130 240 L170 210 L215 190 L260 170 L295 145 L320 110 L325 80 L305 65 L270 75 L230 95 L195 120 L160 150 L130 185 L105 230 L85 280 Z"
                stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="80" cy="320" r="7" fill="#fff" />
            </svg>
            {/* Overlay text */}
            <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <WordmarkV2 width={56} dim={1} src="chala-logo.png" />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: numFont, letterSpacing: "0.1em" }}>AUG 14 · 06:42</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                  <div style={{ fontSize: 56, color: "#fff", fontFamily: numFont, fontWeight: 500, lineHeight: 0.95 }}>5.21</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: numFont, letterSpacing: "0.06em" }}>MI</div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontFamily: numFont, letterSpacing: "0.08em" }}>42:48 · 08:32 /MI · 156 BPM</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div style={{ padding: "0 24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: "16px 0", textAlign: "center", border: `1px solid ${V2.hairlineStrong}`, fontSize: 12, color: V2.textDim, fontWeight: 500, letterSpacing: "0.06em" }}>Discard</div>
            <div style={{ padding: "16px 0", textAlign: "center", background: "#E0E0E0", color: "#0B0B0B", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>Save run</div>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// ROUTE FLYOVER — animated playback of a completed run, Strava-style
// =================================================================================
function RouteFlyoverScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // Route path (same coords as run-detail)
  const routePath = "M60 220 L75 195 L95 175 L120 155 L150 140 L185 130 L220 120 L250 105 L275 95 L290 80 L300 65 L295 50 L280 45 L255 55 L225 70 L195 85 L165 100 L135 115 L110 135 L85 160 L65 190 Z";

  // Camera-following dot at progress ~ 0.55
  // Get a position along the path approximated — use a hand-picked point
  const dotPos = [195, 85]; // mid-route
  const elapsed = "23:32";
  const distAtDot = "2.86";

  // Elevation samples for the synced strip
  const elev = [12, 14, 18, 22, 26, 32, 38, 44, 48, 52, 58, 62, 68, 72, 78, 84, 88, 92, 90, 86, 80, 74, 68, 60, 52, 44, 38, 32, 26, 22, 18, 14];
  const elevMax = Math.max(...elev);
  const elevMin = Math.min(...elev);
  const elevPath = elev.map((v, i) => {
    const x = (i / (elev.length - 1)) * 100;
    const y = 100 - ((v - elevMin) / (elevMax - elevMin)) * 100;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const dotProgress = 0.55;

  // Photo pins along the route
  const photos = [
    { pos: [120, 155], n: 1 },
    { pos: [275, 95],  n: 2 },
    { pos: [110, 135], n: 3 },
  ];

  // Music waveform — 32 bars, varying height
  const wave = [3, 5, 8, 6, 10, 14, 11, 9, 13, 16, 18, 15, 12, 17, 20, 22, 19, 16, 14, 11, 13, 17, 15, 12, 9, 7, 10, 13, 8, 5, 6, 4];

  return (
    <ChalaScreenV2 label="13 Route flyover" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#000" }}>
        {/* Top bar */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Flyover</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", border: `1px solid ${V2.hairlineStrong}` }}>
            <svg width="11" height="11" viewBox="0 0 24 24"><path d="M4 12 L12 4 L20 12 M12 4 L12 20" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
            <span style={{ fontSize: 10, color: V2.text, fontFamily: numFont, letterSpacing: "0.08em" }}>SHARE VIDEO</span>
          </div>
        </div>

        {/* MAP — fills available space, with overlays */}
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
            {/* Tilted/perspective grid for flyover feel */}
            <g stroke="#181818" strokeWidth="0.5">
              <line x1="0" y1="40" x2="400" y2="40" />
              <line x1="0" y1="80" x2="400" y2="80" />
              <line x1="0" y1="120" x2="400" y2="120" />
              <line x1="0" y1="160" x2="400" y2="160" />
              <line x1="0" y1="200" x2="400" y2="200" />
              <line x1="0" y1="240" x2="400" y2="240" />
              <line x1="50" y1="0" x2="50" y2="280" />
              <line x1="100" y1="0" x2="100" y2="280" />
              <line x1="150" y1="0" x2="150" y2="280" />
              <line x1="200" y1="0" x2="200" y2="280" />
              <line x1="250" y1="0" x2="250" y2="280" />
              <line x1="300" y1="0" x2="300" y2="280" />
              <line x1="350" y1="0" x2="350" y2="280" />
            </g>
            {/* Faint city hints */}
            <g stroke="#1a1a1a" strokeWidth="0.6" fill="none">
              <path d="M0 60 L400 70" />
              <path d="M0 145 L400 155" />
              <path d="M0 220 L400 215" />
              <path d="M260 95 L340 100 L335 165 L255 160 Z" />
              <path d="M0 250 Q120 240 240 255 T400 245" stroke="#181818" strokeWidth="1" />
            </g>
            {/* Trailing path — bright up to dot, dim after */}
            <path d={routePath} stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routePath} stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray={`${dotProgress} ${1 - dotProgress}`} />

            {/* Photo pins (small squares) */}
            {photos.map((p, i) => (
              <g key={i}>
                <rect x={p.pos[0] - 6} y={p.pos[1] - 6} width="12" height="12" fill="#000" stroke="#fff" strokeWidth="1" />
                <text x={p.pos[0]} y={p.pos[1] + 3} textAnchor="middle" fontSize="7" fill="#fff" fontFamily="ui-monospace, 'Geist Mono', monospace" fontWeight="500">{p.n}</text>
              </g>
            ))}

            {/* Camera dot with HR ring */}
            <g>
              <circle cx={dotPos[0]} cy={dotPos[1]} r="14" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <circle cx={dotPos[0]} cy={dotPos[1]} r="14" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="48 100" transform={`rotate(-90 ${dotPos[0]} ${dotPos[1]})`} />
              <circle cx={dotPos[0]} cy={dotPos[1]} r="6" fill="#fff" />
              <circle cx={dotPos[0]} cy={dotPos[1]} r="2" fill="#000" />
            </g>
          </svg>

          {/* Top-left LIVE pace overlay */}
          <div style={{ position: "absolute", top: 16, left: 16, padding: "10px 12px", background: "rgba(0,0,0,0.55)", border: `1px solid rgba(255,255,255,0.16)`, backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontFamily: numFont, letterSpacing: "0.1em", marginBottom: 4 }}>PACE · LIVE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <Numeric size={20} weight={500} tweaks={tweaks}>08:14</Numeric>
              <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>/MI</div>
            </div>
          </div>

          {/* Top-right HR overlay */}
          <div style={{ position: "absolute", top: 16, right: 16, padding: "10px 12px", background: "rgba(0,0,0,0.55)", border: `1px solid rgba(255,255,255,0.16)`, backdropFilter: "blur(4px)", textAlign: "right" }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontFamily: numFont, letterSpacing: "0.1em", marginBottom: 4 }}>HR · ZONE 3</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "flex-end" }}>
              <Numeric size={20} weight={500} tweaks={tweaks}>158</Numeric>
              <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont }}>BPM</div>
            </div>
          </div>

          {/* Photo thumb at current location */}
          <div style={{ position: "absolute", top: `${(dotPos[1] / 280) * 100}%`, left: `${(dotPos[0] / 400) * 100}%`, transform: "translate(20px, -50%)" }}>
            <div style={{ width: 56, height: 56, border: `1px solid #fff`, background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontFamily: numFont, letterSpacing: "0.1em" }}>IMG 02</div>
            </div>
          </div>
        </div>

        {/* ELEVATION strip — synced with progress */}
        <div style={{ padding: "12px 24px 4px", flexShrink: 0, borderTop: `1px solid ${V2.hairline}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <Label tweaks={tweaks} color={V2.textFaint} size={9}>Elevation · synced</Label>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{elevMax} FT MAX</div>
          </div>
          <div style={{ position: "relative", height: 36 }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d={`${elevPath} L100 100 L0 100 Z`} fill="rgba(255,255,255,0.05)" />
              <path d={elevPath} stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* Progress marker */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${dotProgress * 100}%`, width: 1, background: "#fff" }}></div>
            <div style={{ position: "absolute", top: -2, left: `${dotProgress * 100}%`, width: 6, height: 6, background: "#fff", borderRadius: "50%", transform: "translate(-3px, 0)" }}></div>
          </div>
        </div>

        {/* MUSIC — track that played */}
        <div style={{ padding: "12px 24px", flexShrink: 0, borderTop: `1px solid ${V2.hairline}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#1a1a1a", border: `1px solid ${V2.hairlineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24"><path d="M9 18 V6 L20 4 V16 M9 18 A3 3 0 0 1 6 21 A3 3 0 0 1 3 18 A3 3 0 0 1 6 15 A3 3 0 0 1 9 18 M20 16 A3 3 0 0 1 17 19 A3 3 0 0 1 14 16 A3 3 0 0 1 17 13 A3 3 0 0 1 20 16" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: V2.text, fontWeight: 500, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Solid Air · John Martyn</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 12 }}>
              {wave.map((h, i) => (
                <div key={i} style={{
                  flex: 1,
                  height: `${(h / 22) * 100}%`,
                  background: i / wave.length < dotProgress ? "#fff" : "rgba(255,255,255,0.25)",
                }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrubber + controls */}
        <div style={{ padding: "12px 24px 18px", flexShrink: 0, borderTop: `1px solid ${V2.hairline}` }}>
          <div style={{ position: "relative", height: 2, background: V2.hairline, marginBottom: 10 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${dotProgress * 100}%`, background: "#fff" }}></div>
            <div style={{ position: "absolute", left: `${dotProgress * 100}%`, top: -5, width: 12, height: 12, background: "#fff", borderRadius: "50%", transform: "translateX(-6px)" }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{elapsed} · {distAtDot} MI</div>
            <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>42:48 · 5.21 MI</div>
          </div>
          {/* Transport */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ padding: "5px 8px", border: `1px solid ${V2.hairlineStrong}`, fontSize: 10, color: V2.text, fontFamily: numFont, letterSpacing: "0.06em" }}>0.5×</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M19 5 L9 12 L19 19 Z M5 5 L5 19" fill="currentColor" /></svg>
              <div style={{ width: 44, height: 44, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24"><path d="M6 4 L20 12 L6 20 Z" fill="#000" /></svg>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 5 L15 12 L5 19 Z M19 5 L19 19" fill="currentColor" /></svg>
            </div>
            <div style={{ padding: "5px 8px", border: `1px solid ${V2.hairlineStrong}`, fontSize: 10, color: V2.text, fontFamily: numFont, letterSpacing: "0.06em" }}>2×</div>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

// =================================================================================
// EDIT SPORTS — full screen, reorder + customize per-sport
// =================================================================================
function EditSportsScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // Sports with order, primary flag, metrics, weekly goal
  const sports = [
    { id: "run",    name: "Run",         glyph: "sports",   metrics: "Distance · Pace · HR · Cadence", goal: "30 mi / wk", primary: true },
    { id: "ride",   name: "Ride",        glyph: "watch",    metrics: "Distance · Power · HR",          goal: "60 mi / wk" },
    { id: "swim",   name: "Swim",        glyph: "droplet",  metrics: "Distance · Pace · SWOLF",         goal: "5,000 yd / wk" },
    { id: "bjj",    name: "BJJ",         glyph: "flame",    metrics: "Rounds · Duration · HR",          goal: "3 sessions / wk" },
    { id: "climb",  name: "Climb",       glyph: "settings", metrics: "Routes · Grade · Duration",       goal: "2 sessions / wk" },
    { id: "hike",   name: "Hike",        glyph: "pin",      metrics: "Distance · Elevation · Time",     goal: "Off" },
  ];

  const Row = ({ s, i, last }) => (
    <div style={{
      padding: "16px 24px",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      {/* Drag handle */}
      <div style={{ width: 16, display: "flex", flexDirection: "column", gap: 3, opacity: 0.4, flexShrink: 0 }}>
        <div style={{ height: 1, background: V2.text }}></div>
        <div style={{ height: 1, background: V2.text }}></div>
        <div style={{ height: 1, background: V2.text }}></div>
      </div>
      {/* Glyph */}
      <div style={{ width: 36, height: 36, border: `1px solid ${V2.hairlineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Glyph name={s.glyph} size={14} color={V2.textDim} />
      </div>
      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ fontSize: 14, color: V2.text, fontWeight: 500 }}>{s.name}</div>
          {s.primary && (
            <div style={{ padding: "2px 6px", border: `1px solid ${V2.text}`, fontSize: 8, color: V2.text, fontFamily: numFont, letterSpacing: "0.1em" }}>PRIMARY</div>
          )}
        </div>
        <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.04em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>{s.metrics.toUpperCase()}</div>
        <div style={{ fontSize: 10, color: V2.textDim, fontFamily: numFont, letterSpacing: "0.04em" }}>GOAL · {s.goal.toUpperCase()}</div>
      </div>
      {/* Edit chevron */}
      <Glyph name="chevron-right" size={12} color={V2.textFaint} />
    </div>
  );

  return (
    <ChalaScreenV2 label="14 Edit sports" tweaks={tweaks}>
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Sports & activities</Label>
          <div style={{ fontSize: 11, color: V2.text, fontWeight: 500, letterSpacing: "0.04em" }}>Done</div>
        </div>
        <Rule />

        {/* Title */}
        <div style={{ padding: "20px 24px 6px" }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 6 }}>06 sports · Coach optimizes Run</Label>
          <Heading size={26} weight={500} tweaks={tweaks}>Your sports</Heading>
        </div>

        <div style={{ padding: "16px 24px 6px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Tracking · drag to reorder</Label>
        </div>
        <Rule />
        {sports.map((s, i) => (
          <Row key={s.id} s={s} i={i} last={i === sports.length - 1} />
        ))}
        <Rule />

        {/* Add — custom sport */}
        <div style={{ padding: "20px 24px 12px" }}>
          <Label tweaks={tweaks} color={V2.textFaint}>Add</Label>
        </div>
        <div style={{ padding: "0 24px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { name: "Pickleball", meta: "FROM CATALOG" },
            { name: "Yoga",       meta: "FROM CATALOG" },
            { name: "Rowing",     meta: "FROM CATALOG" },
          ].map((x, i) => (
            <div key={i} style={{ padding: "12px 14px", border: `1px solid ${V2.hairline}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, height: 18, border: `1px solid ${V2.hairlineStrong}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="9" height="9" viewBox="0 0 12 12"><path d="M6 1 V11 M1 6 H11" stroke="currentColor" strokeWidth="1.5" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: V2.text }}>{x.name}</div>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>{x.meta}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: V2.textDim, letterSpacing: "0.04em" }}>Add</div>
            </div>
          ))}
        </div>

        {/* Custom sport input */}
        <div style={{ padding: "16px 24px 32px" }}>
          <div style={{ padding: "14px 16px", border: `1px dashed ${V2.hairlineStrong}`, display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 4 V20 M4 12 H20" stroke="currentColor" strokeWidth="1.5" /></svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: V2.text, marginBottom: 2 }}>Create custom sport</div>
              <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>NAME IT · CHOOSE METRICS · SET GOAL</div>
            </div>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}

Object.assign(window, {
  SignInScreenV2, SignUpScreenV2, HomeScreenV2, ChatScreenV2, ChatActiveScreenV2,
  CalendarScreenV2, ProfileScreenV2, NutritionScreenV2,
  SportsScreenV2, SettingsScreenV2, GymPassScreenV2,
  RunDetailScreenV2, AIRoutesScreenV2, MapTrace,
  WorkoutSummaryScreenV2, RouteFlyoverScreenV2, EditSportsScreenV2,
});
