import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Orbit,
  ChevronDown,
  Trophy,
  RotateCcw,
  Flame,
  MapPin
} from 'lucide-react'
import { useWorldStore } from '../../store/useWorldStore'
import { KineticScrambleText } from './KineticScrambleText'
import { ToxicityMatrix } from './ToxicityMatrix'
import { ElementalHarvest } from './ElementalHarvest'

export const ScrollStorySections: React.FC = () => {
  const {
    scrollToChapter,
    selectCampus,
    toggleLeftDrawer,
    openModal,
    campuses,
    enterImmersiveOrbit
  } = useWorldStore()

  const dtu = campuses.find((c) => c.id === 'dtu')
  const nsut = campuses.find((c) => c.id === 'nsut')

  // Real-time ticking diversion metric counter in Chapter 0
  const [tickerKg, setTickerKg] = useState(62491180)

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerKg((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full z-10 pointer-events-none">
      
      {/* ========================================================================= */}
      {/* CHAPTER 0: GENESIS / MACRO EARTH                                         */}
      {/* ========================================================================= */}
      <section
        id="chapter-genesis"
        className="min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 py-32"
      >
        <div className="max-w-4xl w-full text-center space-y-8 pointer-events-auto">
          {/* Top Real-time Status Badge */}
          <div className="overflow-hidden inline-block">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-surface/90 border border-white/10 text-xs font-mono tracking-wide text-text-secondary"
            >
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <span>18 Universities Synced</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-emerald font-bold">{tickerKg.toLocaleString()} KG INGESTED</span>
            </motion.div>
          </div>

          {/* Kinetic Scramble Staggered Masked Headline */}
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-text-primary leading-[1.02]"
              >
                Turn Dead Tech into{' '}
                <span className="text-text-primary block sm:inline">
                  <KineticScrambleText text="Living Earth." trigger="mount" duration={1100} />
                </span>
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed"
              >
                A planetary computing instrument transforming discarded university electronics into verified collegiate architecture and closed-loop material recovery.
              </motion.p>
            </div>
          </div>

          {/* Primary Action Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => scrollToChapter(1)}
              data-cursor="explore"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-emerald text-background font-bold text-xs tracking-wider uppercase hover:brightness-105 active:scale-[0.98] transition-all"
            >
              Explore Planetary Narrative
            </button>

            <button
              onClick={() => enterImmersiveOrbit()}
              data-cursor="orbit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-surface border border-white/10 hover:border-white/20 text-text-primary text-xs font-semibold tracking-wide transition-all"
            >
              <Orbit className="w-3.5 h-3.5 text-copper" />
              <span>Direct 3D Orbit [Esc]</span>
            </button>
          </motion.div>

          {/* Micro Telemetry Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-text-muted"
          >
            <span>[NCR · DEL · BLR · BOM]</span>
            <span>•</span>
            <span>CIRCULAR HARDWARE CAPTURE: 100%</span>
            <span>•</span>
            <span>ZERO VIRGIN MINING</span>
          </motion.div>

          {/* Downward Navigation Cue */}
          <div className="pt-8">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="inline-block cursor-pointer"
              onClick={() => scrollToChapter(1)}
            >
              <ChevronDown className="w-4 h-4 text-white/30 hover:text-emerald transition-colors" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 1: THE SILICON CRISIS & TOXICITY MATRIX                          */}
      {/* ========================================================================= */}
      <section
        id="chapter-crisis"
        className="min-h-screen w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 py-32"
      >
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
          {/* Left Column: Story Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-xs font-mono text-copper font-medium"
              >
                Chapter 01 · Global Hardware Crisis
              </motion.span>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.06]"
                >
                  62 Million Tonnes.{' '}
                  <span className="block mt-1 text-copper">
                    <KineticScrambleText text="Buried Every Year." trigger="inView" duration={1000} />
                  </span>
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base text-text-secondary leading-relaxed"
                >
                  Less than a quarter of modern electronics are formally documented as recycled. Discarded motherboards, lithium battery packs, and CRTs leach persistent neurotoxins into municipal aquifers.
                </motion.p>
              </div>
            </div>

            {/* Two Clean Numbers with Immense Breathing Room */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-10 pt-2"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-copper">62M T</div>
                <div className="text-xs font-mono text-text-muted mt-1">
                  Annual E-Waste
                </div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div>
                <div className="text-4xl sm:text-5xl font-mono font-bold text-amber">&lt; 22%</div>
                <div className="text-xs font-mono text-text-muted mt-1">
                  Formally Recycled
                </div>
              </div>
            </motion.div>

            {/* Modal Expansion Link */}
            <div className="pt-2">
              <button
                onClick={() => openModal('vault')}
                className="inline-flex items-center text-xs font-mono text-emerald hover:underline transition-colors"
              >
                Inspect Chemical Impact Ledger
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Toxicity Matrix */}
          <div className="lg:col-span-6">
            <ToxicityMatrix />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 2: COLLEGIATE ARCHITECTURE & ELEMENTAL HARVEST                   */}
      {/* ========================================================================= */}
      <section
        id="chapter-beacons"
        className="min-h-screen w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 py-32"
      >
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pointer-events-auto">
          {/* Left Column: Interactive Elemental Harvest Breakdown */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <ElementalHarvest />
          </div>

          {/* Right Column: Story Copy */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-xs font-mono text-gold font-medium"
              >
                Chapter 02 · Planetary Architectural Beacons
              </motion.span>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.06]"
                >
                  Monuments of{' '}
                  <span className="block mt-1 text-gold">
                    <KineticScrambleText text="Diversion." trigger="inView" duration={1000} />
                  </span>
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base text-text-secondary leading-relaxed"
                >
                  Universities rise as 3D holographic towers across the globe. Each tower is enveloped in the live banner of its sustainability partner, with physical elevation scaling directly to verified kilogram diversion.
                </motion.p>
              </div>
            </div>

            {/* Clean Metric Callout */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3 pt-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-white/10 text-xs font-mono text-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                <span>Tower Height = Verified Kilograms Diverted</span>
              </div>

              <div className="text-xs font-mono text-text-muted tracking-wide pt-2">
                SPONSOR ECOSYSTEM · APPLE · INTEL · TESLA · GOOGLE · NVIDIA · TATA · INFOSYS
              </div>
            </motion.div>

            {/* Action Link */}
            <div className="pt-2">
              <button
                onClick={() => scrollToChapter(3)}
                className="inline-flex items-center text-xs font-mono text-gold hover:underline transition-colors"
              >
                Explore the competitive campus war
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 3: COMPETITIVE DERBY & LIVE SUB-CONTINENT HUB                    */}
      {/* ========================================================================= */}
      <section
        id="chapter-derby"
        className="min-h-screen w-full flex flex-col justify-center items-center px-6 sm:px-12 py-32"
      >
        <div className="max-w-3xl w-full text-center space-y-8 pointer-events-auto">
          {/* Subtle Tag */}
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-xs font-mono text-copper font-medium"
            >
              Chapter 03 · 7-Day Regional Collegiate Derby
            </motion.span>
          </div>

          {/* Staggered Masked Headline */}
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.06]"
              >
                The Campus{' '}
                <span className="text-text-primary block sm:inline">
                  <KineticScrambleText text="Collegiate War." trigger="inView" duration={1000} />
                </span>
              </motion.h2>
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed"
              >
                Universities duel on a 7-day rolling cycle. Every verified gram of lithium and silicon logs cryptographically attested points to elevate the collegiate tower.
              </motion.p>
            </div>
          </div>

          {/* Interactive Live Derby Duel Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface/95 rounded-xl p-6 space-y-5 border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-mono text-copper font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-copper" />
                WEEKLY DERBY SPOTLIGHT
              </span>
              <span className="font-mono text-text-muted">DELHI NCR REGION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {/* NSUT */}
              {nsut && (
                <div
                  onClick={() => selectCampus('nsut')}
                  className="p-4 rounded-lg bg-surface-elevated border border-copper/30 hover:border-copper/70 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-copper font-bold">RANK #{nsut.allTimeRank}</span>
                    <span className="text-xs font-mono text-copper-light">Infosys Partner</span>
                  </div>
                  <h4 className="text-base font-bold text-text-primary group-hover:text-copper transition-colors">
                    NSUT Delhi
                  </h4>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-copper">
                      {nsut.weeklyKg.toFixed(1)} <span className="text-xs font-normal">kg</span>
                    </span>
                    <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-copper" /> Focus Tower
                    </span>
                  </div>
                </div>
              )}

              {/* DTU */}
              {dtu && (
                <div
                  onClick={() => selectCampus('dtu')}
                  className="p-4 rounded-lg bg-surface-elevated border border-emerald/30 hover:border-emerald/70 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald font-bold">RANK #{dtu.allTimeRank}</span>
                    <span className="text-xs font-mono text-emerald-light">TCS Partner</span>
                  </div>
                  <h4 className="text-base font-bold text-text-primary group-hover:text-emerald transition-colors">
                    DTU Delhi
                  </h4>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-emerald">
                      {dtu.weeklyKg.toFixed(1)} <span className="text-xs font-normal">kg</span>
                    </span>
                    <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald" /> Focus Tower
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Duel Momentum Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="h-2 w-full bg-surface-subtle rounded-sm overflow-hidden flex">
                <div className="h-full bg-copper w-[51%]" title="NSUT 51%" />
                <div className="h-full bg-emerald w-[49%]" title="DTU 49%" />
              </div>
              <div className="flex justify-between text-xs font-mono text-text-muted">
                <span>NSUT Momentum: 51.2%</span>
                <span className="text-copper">Gap: 1.5 kg</span>
                <span>DTU Momentum: 48.8%</span>
              </div>
            </div>

            {/* Drawer Opener Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={toggleLeftDrawer}
                className="px-5 py-2.5 rounded-md bg-surface-elevated border border-white/10 text-text-primary hover:border-copper/40 text-xs font-medium transition-all flex items-center gap-2"
              >
                <Trophy className="w-3.5 h-3.5 text-copper" />
                <span>Open Full Global Leaderboard</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CHAPTER 4: THE CIRCULAR HARDWARE ECOSYSTEM                                */}
      {/* ========================================================================= */}
      <section
        id="chapter-action"
        className="min-h-screen w-full flex flex-col justify-between items-center px-6 sm:px-12 py-24"
      >
        <div className="w-full" /> {/* Top Spacer */}

        <div className="max-w-4xl w-full text-center space-y-8 pointer-events-auto">
          {/* Subtle Tag */}
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '100%', opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-xs font-mono text-copper font-medium"
            >
              Chapter 04 · The Circular Hardware Ecosystem
            </motion.span>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.06]"
              >
                Connect Your Campus.{' '}
                <span className="text-text-primary block sm:inline">
                  <KineticScrambleText text="Close the Planetary Loop." trigger="inView" duration={1100} />
                </span>
              </motion.h2>
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed"
              >
                Deploy an automated kiosk node to your university, sponsor campus hardware diversion, or explore verified metallurgical recovery telemetry.
              </motion.p>
            </div>
          </div>

          {/* 3 Refined Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <button
              onClick={() => openModal('recycle')}
              className="px-5 py-2.5 rounded-md bg-emerald text-background font-bold text-xs uppercase tracking-wider hover:brightness-105 active:scale-[0.98] transition-all"
            >
              Deploy Campus Kiosk
            </button>

            <button
              onClick={() => openModal('sponsor_pitch')}
              className="px-5 py-2.5 rounded-md bg-surface border border-white/10 text-text-primary hover:border-copper/40 hover:text-copper text-xs font-semibold tracking-wide transition-all"
            >
              Become a Corporate Sponsor
            </button>

            <button
              onClick={() => openModal('vault')}
              className="px-5 py-2.5 rounded-md bg-surface border border-white/10 text-text-primary hover:border-white/30 text-xs font-semibold tracking-wide transition-all"
            >
              Open Data Vault
            </button>
          </motion.div>

          {/* Return to Top */}
          <div className="pt-4">
            <button
              onClick={() => scrollToChapter(0)}
              className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-copper" />
              <span>Return to Top Orbit</span>
            </button>
          </div>
        </div>

        {/* Minimal Editorial Footer */}
        <footer className="w-full max-w-5xl pt-16 pointer-events-auto text-center border-t border-white/[0.06] mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
            <span>RE—EARTH // 18 UNIVERSITIES CONNECTED // CLOSED-LOOP HARDWARE</span>
            <span>WGS-84 HOLOGRAPHIC PROJECTION // ZERO VIRGIN EXTRACTION</span>
          </div>
        </footer>
      </section>

    </div>
  )
}

export default ScrollStorySections
