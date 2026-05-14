/* global React */
// Chala v2 — extra screens: Active workout (live) + Exercise library
// Matches screens-v2.jsx voice: dark, hairlines, 0px edges, typography-forward.

const {
  V2, ChalaScreenV2, WordmarkV2, Glyph,
  Label, Numeric, Heading, ButtonV2, Rule,
  // getType is global (defined in components-v2.jsx)
} = window;

// =================================================================================
// 16 ACTIVE WORKOUT — single screen, weight-training, with warm-up + cool-down
// =================================================================================
// Anatomy:
//   • Top bar: pause + workout title + "End"
//   • Big elapsed timer + secondary stats strip (sets done, volume, BPM)
//   • Section: WARM-UP (collapsed/expanded blocks, hairline)
//   • Section: MAIN LIFTS (current exercise expanded; sets log w/ weight × reps + RPE)
//   • Section: COOL-DOWN
//   • Floating REST timer banner (auto-starts after a logged set)
//   • Bottom action: Log set / Add set
// =================================================================================
function ActiveWorkoutScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  // --- Set row ---
  const SetRow = ({ n, weight, reps, rpe, done, current, warmup }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "28px 1fr 1fr 56px 22px",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: `1px solid ${V2.hairline}`,
      opacity: done && !current ? 0.55 : 1,
    }}>
      <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>
        {warmup ? `W${n}` : String(n).padStart(2, "0")}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <Numeric size={current ? 18 : 14} weight={500} tweaks={tweaks} color={current ? V2.text : V2.textDim}>
          {weight}
        </Numeric>
        <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>LB</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <Numeric size={current ? 18 : 14} weight={500} tweaks={tweaks} color={current ? V2.text : V2.textDim}>
          {reps}
        </Numeric>
        <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>REPS</div>
      </div>
      <div style={{ fontSize: 10, color: rpe ? V2.textDim : V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>
        {rpe ? `RPE ${rpe}` : "—"}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {done ? (
          <Glyph name="check" size={12} color={V2.accent} />
        ) : current ? (
          <div style={{ width: 10, height: 10, border: `1px solid ${V2.text}` }}></div>
        ) : (
          <div style={{ width: 10, height: 10, border: `1px solid ${V2.hairlineStrong}` }}></div>
        )}
      </div>
    </div>
  );

  // --- Exercise card (collapsed = title + status row; expanded = full sets) ---
  const ExerciseCard = ({ idx, name, target, sets, expanded, status }) => (
    <div style={{ borderBottom: `1px solid ${V2.hairline}` }}>
      <div style={{ padding: "16px 24px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <Numeric size={11} tweaks={tweaks} color={V2.textFaint}>{String(idx).padStart(2, "0")}</Numeric>
            <div style={{ fontSize: 15, color: V2.text, fontWeight: 500, letterSpacing: "-0.01em" }}>{name}</div>
          </div>
          <div style={{ fontSize: 9, color: status === "done" ? V2.accent : V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em" }}>
            {status === "done" ? "DONE" : status === "active" ? "ACTIVE" : "QUEUED"}
          </div>
        </div>
        <Label tweaks={tweaks} color={V2.textFaint} size={9}>{target}</Label>

        {expanded && (
          <div style={{ marginTop: 14 }}>
            {/* Column header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 1fr 56px 22px",
              padding: "0 0 8px",
              borderBottom: `1px solid ${V2.hairlineStrong}`,
              marginBottom: 2,
            }}>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em" }}>SET</div>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em" }}>LOAD</div>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em" }}>REPS</div>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em" }}>EFFORT</div>
              <div></div>
            </div>
            {sets.map((s, i) => <SetRow key={i} {...s} />)}

            {/* Add set */}
            <div style={{
              padding: "12px 0 4px",
              display: "flex", alignItems: "center", gap: 10,
              cursor: "pointer",
            }}>
              <div style={{ width: 14, height: 14, border: `1px solid ${V2.hairlineStrong}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="7" height="7" viewBox="0 0 12 12"><path d="M6 1 V11 M1 6 H11" stroke="currentColor" strokeWidth="1.5" /></svg>
              </div>
              <div style={{ fontSize: 11, color: V2.textDim, letterSpacing: "0.04em" }}>Add set</div>
            </div>

            {/* Notes / coach cue */}
            <div style={{
              marginTop: 12,
              padding: "10px 12px",
              border: `1px solid ${V2.hairline}`,
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <Glyph name="spark" size={11} color={V2.textDim} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em", marginBottom: 4 }}>COACH CUE</div>
                <div style={{ fontSize: 11, color: V2.textDim, lineHeight: 1.5 }}>
                  Pause 1s on chest. Drive elbows in — last set was 2s shy.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ChalaScreenV2 label="16 Active workout" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

        {/* TOP BAR */}
        <div style={{ padding: "8px 24px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", border: `1px solid ${V2.hairlineStrong}` }}>
            <div style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 2, height: 9, background: V2.text }}></div>
              <div style={{ width: 2, height: 9, background: V2.text }}></div>
            </div>
            <div style={{ fontSize: 9, color: V2.text, fontFamily: numFont, letterSpacing: "0.12em" }}>PAUSE</div>
          </div>
          <Label tweaks={tweaks} color={V2.textFaint}>Push · Chest & Shoulders</Label>
          <div style={{ fontSize: 11, color: V2.text, fontWeight: 500, letterSpacing: "0.04em" }}>End</div>
        </div>
        <Rule />

        {/* SCROLL BODY */}
        <div style={{ flex: 1, overflow: "auto" }}>

          {/* HERO TIMER */}
          <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${V2.hairline}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>Elapsed</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: V2.accent, borderRadius: "50%" }}></div>
                <div style={{ fontSize: 9, color: V2.accent, fontFamily: numFont, letterSpacing: "0.16em" }}>LIVE</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 18 }}>
              <Numeric size={64} weight={500} tweaks={tweaks}>32</Numeric>
              <div style={{ fontSize: 32, color: V2.textDim, fontFamily: numFont }}>:</div>
              <Numeric size={64} weight={500} tweaks={tweaks}>14</Numeric>
            </div>

            {/* Stat strip */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: `1px solid ${V2.hairline}`, paddingTop: 16 }}>
              <div>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Sets</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={16} weight={500} tweaks={tweaks}>08</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>/ 18</div>
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 14 }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>Volume</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={16} weight={500} tweaks={tweaks}>4,820</Numeric>
                  <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>LB</div>
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 14 }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>BPM</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={16} weight={500} tweaks={tweaks}>132</Numeric>
                </div>
              </div>
              <div style={{ borderLeft: `1px solid ${V2.hairline}`, paddingLeft: 14 }}>
                <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 4 }}>kCal</Label>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <Numeric size={16} weight={500} tweaks={tweaks}>248</Numeric>
                </div>
              </div>
            </div>
          </div>

          {/* SESSION PROGRESS BAR */}
          <div style={{ padding: "14px 24px 18px", borderBottom: `1px solid ${V2.hairline}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>Session · 44%</Label>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>~26 MIN LEFT</Label>
            </div>
            {/* segmented progress: warm-up · main · cooldown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr 1fr", gap: 4 }}>
              <div style={{ height: 4, background: V2.text }}></div>
              <div style={{ height: 4, background: V2.hairlineStrong, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: "33%", background: V2.text }}></div>
              </div>
              <div style={{ height: 4, background: V2.hairlineStrong }}></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr 1fr", gap: 4, marginTop: 6 }}>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em" }}>WARM-UP</div>
              <div style={{ fontSize: 8, color: V2.text, fontFamily: numFont, letterSpacing: "0.1em" }}>MAIN</div>
              <div style={{ fontSize: 8, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em", textAlign: "right" }}>COOL</div>
            </div>
          </div>

          {/* ============== WARM-UP ============== */}
          <div style={{ padding: "20px 24px 6px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <Heading size={18} weight={500} tweaks={tweaks}>Warm-up</Heading>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>02 / 02 · 6:12</Label>
            </div>
          </div>
          <div style={{ padding: "0 24px 14px" }}>
            <div style={{ borderTop: `1px solid ${V2.hairline}` }}>
              {[
                { name: "Arm circles + scap pulls", meta: "2 × 30s", done: true },
                { name: "Band pull-aparts",          meta: "2 × 15",  done: true },
                { name: "Empty bar bench",           meta: "1 × 10",  done: true },
              ].map((w, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: i === arr.length - 1 ? "none" : `1px solid ${V2.hairline}`,
                  opacity: 0.55,
                }}>
                  <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph name="check" size={12} color={V2.accent} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: V2.textDim, textDecoration: "line-through", textDecorationColor: V2.hairlineStrong }}>{w.name}</div>
                  <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{w.meta.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ============== MAIN LIFTS ============== */}
          <div style={{ padding: "8px 24px 10px", borderTop: `1px solid ${V2.hairlineStrong}` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 14 }}>
              <Heading size={20} weight={500} tweaks={tweaks}>Main lifts</Heading>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>04 lifts · 18 sets</Label>
            </div>
          </div>

          {/* Exercise A — done */}
          <ExerciseCard
            idx={1}
            name="Barbell bench press"
            target="4 × 6 · 70% 1RM · 2:30 rest"
            status="done"
            expanded={false}
            sets={[]}
          />

          {/* Exercise B — ACTIVE / EXPANDED */}
          <ExerciseCard
            idx={2}
            name="Incline DB press"
            target="4 × 8 · RPE 8 · 2:00 rest"
            status="active"
            expanded={true}
            sets={[
              { n: 1, weight: 60, reps: 8, rpe: 7,  done: true },
              { n: 2, weight: 65, reps: 8, rpe: 8,  done: true },
              { n: 3, weight: 65, reps: 8, rpe: "—", current: true },
              { n: 4, weight: 65, reps: 8, rpe: "—" },
            ]}
          />

          {/* Exercise C — queued */}
          <ExerciseCard
            idx={3}
            name="Cable fly"
            target="3 × 12 · drop set last · 1:30 rest"
            status="queued"
            expanded={false}
            sets={[]}
          />

          {/* Exercise D — queued */}
          <ExerciseCard
            idx={4}
            name="Seated DB shoulder press"
            target="3 × 10 · RPE 7 · 1:30 rest"
            status="queued"
            expanded={false}
            sets={[]}
          />

          {/* ============== COOL-DOWN ============== */}
          <div style={{ padding: "22px 24px 10px", borderTop: `1px solid ${V2.hairlineStrong}` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: 14 }}>
              <Heading size={18} weight={500} tweaks={tweaks}>Cool-down</Heading>
              <Label tweaks={tweaks} color={V2.textFaint} size={9}>00 / 03 · 5:00</Label>
            </div>
          </div>
          <div style={{ padding: "0 24px 32px" }}>
            <div style={{ borderTop: `1px solid ${V2.hairline}` }}>
              {[
                { name: "Doorway pec stretch",        meta: "2 × 30s" },
                { name: "Child's pose to thread",     meta: "1 × 60s" },
                { name: "Box breathing",              meta: "2 min" },
              ].map((c, i, arr) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 0",
                  borderBottom: i === arr.length - 1 ? "none" : `1px solid ${V2.hairline}`,
                }}>
                  <div style={{ width: 12, height: 12, border: `1px solid ${V2.hairlineStrong}` }}></div>
                  <div style={{ flex: 1, fontSize: 13, color: V2.text }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em" }}>{c.meta.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REST TIMER BANNER (floating above the action bar) */}
        <div style={{
          flexShrink: 0,
          padding: "12px 16px",
          borderTop: `1px solid ${V2.hairlineStrong}`,
          background: V2.bgRaised,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, background: V2.text, borderRadius: "50%" }}></div>
            <div style={{ fontSize: 9, color: V2.text, fontFamily: numFont, letterSpacing: "0.14em" }}>REST</div>
          </div>
          <div style={{ flex: 1, height: 3, background: V2.hairlineStrong, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, width: "62%", background: V2.text }}></div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <Numeric size={18} weight={500} tweaks={tweaks}>1:14</Numeric>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.08em" }}>/ 2:00</div>
          </div>
          <div style={{ fontSize: 10, color: V2.textDim, letterSpacing: "0.06em", padding: "5px 10px", border: `1px solid ${V2.hairlineStrong}` }}>+15s</div>
          <div style={{ fontSize: 10, color: V2.textDim, letterSpacing: "0.06em", padding: "5px 10px", border: `1px solid ${V2.hairlineStrong}` }}>Skip</div>
        </div>

        {/* ACTION BAR — Log set */}
        <div style={{ padding: "12px 16px 18px", borderTop: `1px solid ${V2.hairline}`, flexShrink: 0, display: "flex", gap: 8 }}>
          <div style={{
            width: 52, height: 52,
            border: `1px solid ${V2.hairlineStrong}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Glyph name="chat" size={16} color={V2.text} />
          </div>
          <div style={{ flex: 1 }}>
            <ButtonV2 variant="primary">Log set · 65 lb × 8</ButtonV2>
          </div>
        </div>
      </div>
    </ChalaScreenV2>
  );
}


// =================================================================================
// 17 EXERCISE LIBRARY — search · filter chips · grouped by muscle
// =================================================================================
function ExerciseLibraryScreenV2({ tweaks }) {
  const numFont = getType(tweaks).numeral;

  const ExerciseRow = ({ name, equip, level, primary, sets, last }) => (
    <div style={{
      padding: "14px 24px",
      borderBottom: last ? "none" : `1px solid ${V2.hairline}`,
      display: "flex", alignItems: "center", gap: 14,
    }}>
      {/* Thumbnail placeholder — diagonal hairline */}
      <div style={{
        width: 44, height: 44,
        border: `1px solid ${V2.hairlineStrong}`,
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <svg width="44" height="44" style={{ position: "absolute", inset: 0 }}>
          <line x1="0" y1="44" x2="44" y2="0" stroke={V2.hairline} strokeWidth="1" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Glyph name="dumbbell" size={14} color={V2.textFaint} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ fontSize: 14, color: V2.text, fontWeight: 500, letterSpacing: "-0.01em" }}>{name}</div>
          {primary && (
            <div style={{ padding: "1px 5px", border: `1px solid ${V2.hairlineStrong}`, fontSize: 8, color: V2.textDim, fontFamily: numFont, letterSpacing: "0.1em" }}>
              IN PLAN
            </div>
          )}
        </div>
        <div style={{ fontSize: 10, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.06em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {equip.toUpperCase()} · {level.toUpperCase()} · {sets.toUpperCase()}
        </div>
      </div>
      <Glyph name="chevron-right" size={12} color={V2.textFaint} />
    </div>
  );

  const Chip = ({ label, on, count }) => (
    <div style={{
      padding: "7px 12px",
      border: `1px solid ${on ? V2.text : V2.hairlineStrong}`,
      background: on ? V2.text : "transparent",
      color: on ? V2.bg : V2.textDim,
      fontSize: 11,
      letterSpacing: "0.04em",
      display: "inline-flex", alignItems: "center", gap: 6,
      flexShrink: 0,
    }}>
      <span>{label}</span>
      {count != null && (
        <span style={{ fontSize: 9, fontFamily: numFont, opacity: 0.7, letterSpacing: "0.08em" }}>{String(count).padStart(2, "0")}</span>
      )}
    </div>
  );

  const GroupHeader = ({ name, count }) => (
    <div style={{
      padding: "16px 24px 10px",
      display: "flex", alignItems: "baseline", justifyContent: "space-between",
      borderTop: `1px solid ${V2.hairlineStrong}`,
      background: V2.bg,
      position: "sticky", top: 0, zIndex: 1,
    }}>
      <div style={{ fontSize: 11, color: V2.text, fontFamily: numFont, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {name}
      </div>
      <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em" }}>
        {String(count).padStart(2, "0")} EXERCISES
      </div>
    </div>
  );

  return (
    <ChalaScreenV2 label="17 Exercise library" tweaks={tweaks}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ padding: "8px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <Glyph name="chevron-left" size={20} color={V2.text} />
          <Label tweaks={tweaks} color={V2.textFaint}>Library</Label>
          <Glyph name="settings" size={18} color={V2.text} />
        </div>
        <Rule />

        {/* Title block */}
        <div style={{ padding: "20px 24px 18px", flexShrink: 0 }}>
          <Label tweaks={tweaks} color={V2.textFaint} style={{ marginBottom: 8 }}>318 movements · weight training</Label>
          <Heading size={30} weight={500} tweaks={tweaks}>Exercise<br />library</Heading>
        </div>

        {/* Search */}
        <div style={{ padding: "0 24px 14px", flexShrink: 0 }}>
          <div style={{
            border: `1px solid ${V2.hairlineStrong}`,
            padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M15 15 L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div style={{ flex: 1, fontSize: 13, color: V2.textMuted }}>Search exercise, muscle, equipment</div>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.1em", padding: "3px 6px", border: `1px solid ${V2.hairline}` }}>⌘ K</div>
          </div>
        </div>

        {/* Filter chip rows */}
        <div style={{ padding: "0 24px 6px", flexShrink: 0 }}>
          <Label tweaks={tweaks} color={V2.textFaint} size={9} style={{ marginBottom: 8 }}>Muscle</Label>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 10, marginLeft: -2, marginRight: -2 }}>
            <Chip label="All" on count={318} />
            <Chip label="Chest" count={42} />
            <Chip label="Back" count={61} />
            <Chip label="Shoulders" count={38} />
            <Chip label="Legs" count={74} />
            <Chip label="Arms" count={52} />
            <Chip label="Core" count={51} />
          </div>
        </div>
        <div style={{ padding: "0 24px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em", marginRight: 4 }}>EQUIP</div>
            <Chip label="Barbell" />
            <Chip label="Dumbbell" on />
            <Chip label="Cable" />
            <Chip label="Body" />
            <Chip label="Machine" />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
            <div style={{ fontSize: 9, color: V2.textFaint, fontFamily: numFont, letterSpacing: "0.12em", marginRight: 4 }}>LEVEL</div>
            <Chip label="Beginner" />
            <Chip label="Intermediate" on />
            <Chip label="Advanced" />
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflow: "auto" }}>

          <GroupHeader name="Chest" count={6} />
          <ExerciseRow name="Barbell bench press"  equip="Barbell"  level="Intermediate" sets="4 × 6"  primary />
          <ExerciseRow name="Incline DB press"     equip="Dumbbell" level="Intermediate" sets="4 × 8"  primary />
          <ExerciseRow name="Cable fly"            equip="Cable"    level="Beginner"     sets="3 × 12" primary />
          <ExerciseRow name="Decline DB press"     equip="Dumbbell" level="Intermediate" sets="3 × 10" />
          <ExerciseRow name="Push-up · weighted"   equip="Body"     level="Intermediate" sets="3 × 12" />
          <ExerciseRow name="Pec deck"             equip="Machine"  level="Beginner"     sets="3 × 12" last />

          <GroupHeader name="Shoulders" count={5} />
          <ExerciseRow name="Seated DB press"      equip="Dumbbell" level="Intermediate" sets="3 × 10" primary />
          <ExerciseRow name="Lateral raise"        equip="Dumbbell" level="Beginner"     sets="3 × 15" />
          <ExerciseRow name="Face pull"            equip="Cable"    level="Beginner"     sets="3 × 15" />
          <ExerciseRow name="Arnold press"         equip="Dumbbell" level="Intermediate" sets="3 × 10" />
          <ExerciseRow name="Overhead barbell press" equip="Barbell" level="Advanced"   sets="4 × 6" last />

          <GroupHeader name="Back" count={4} />
          <ExerciseRow name="Pull-up · weighted"   equip="Body"     level="Advanced"     sets="4 × 6" />
          <ExerciseRow name="Barbell row"          equip="Barbell"  level="Intermediate" sets="4 × 8" />
          <ExerciseRow name="Cable lat pulldown"   equip="Cable"    level="Beginner"     sets="3 × 10" />
          <ExerciseRow name="Single-arm DB row"    equip="Dumbbell" level="Beginner"     sets="3 × 10" last />

        </div>
      </div>
    </ChalaScreenV2>
  );
}


Object.assign(window, {
  ActiveWorkoutScreenV2,
  ExerciseLibraryScreenV2,
});
