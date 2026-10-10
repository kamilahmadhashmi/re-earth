import { useEffect, useRef, useState, useCallback } from 'react'

class SpatialAudioEngine {
  private ctx: AudioContext | null = null
  private ambientOsc: OscillatorNode | null = null
  private ambientGain: GainNode | null = null
  private isMuted: boolean = true

  constructor() {
    // Lazy initialize upon user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    if (!muted) {
      this.initContext()
      this.startAmbientDrone()
    } else {
      this.stopAmbientDrone()
    }
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  // Soft ambient cosmic drone (432Hz harmonic sub-octave at 54Hz)
  private startAmbientDrone() {
    if (!this.ctx || this.isMuted || this.ambientOsc) return
    try {
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(54, this.ctx.currentTime) // low sub-bass drone

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(140, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 3) // ultra subtle background

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      this.ambientOsc = osc
      this.ambientGain = gain
    } catch (e) {
      console.warn('Audio drone error', e)
    }
  }

  private stopAmbientDrone() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5)
        setTimeout(() => {
          if (this.ambientOsc) {
            this.ambientOsc.stop()
            this.ambientOsc.disconnect()
            this.ambientOsc = null
          }
        }, 500)
      } catch (e) {
        this.ambientOsc = null
      }
    }
  }

  // Subtle UI Hover Tick (1600Hz micro chirp, 8ms)
  public playHoverTick() {
    if (!this.ctx || this.isMuted) return
    try {
      this.initContext()
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.015)

      gain.gain.setValueAtTime(0.012, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.015)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.015)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Crisp Tactile Click (600Hz -> 200Hz sine burst, 20ms)
  public playTactileClick() {
    if (!this.ctx || this.isMuted) return
    try {
      this.initContext()
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(680, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // ignore
    }
  }

  // Resonant Harmonic Chime on Tower Focus or Telemetry Spike (528Hz Solfeggio Love frequency)
  public playHarmonicChime() {
    if (!this.ctx || this.isMuted) return
    try {
      this.initContext()
      const frequencies = [528, 792, 1056]
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04)

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + idx * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.03 / (idx + 1), this.ctx.currentTime + idx * 0.04 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.04 + 0.9)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(this.ctx.currentTime + idx * 0.04)
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.9)
      })
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new SpatialAudioEngine()

export function useSpatialAudio() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev
      audioEngine.setMuted(!next)
      if (next) {
        audioEngine.playHarmonicChime()
      }
      return next
    })
  }, [])

  return {
    isAudioEnabled,
    toggleAudio,
    playHover: () => audioEngine.playHoverTick(),
    playClick: () => audioEngine.playTactileClick(),
    playChime: () => audioEngine.playHarmonicChime()
  }
}
