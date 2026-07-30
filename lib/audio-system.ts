// Audio System - Child-friendly sound effects for educational games
// Uses Web Audio API for performance and instant feedback

interface AudioConfig {
  muted: boolean
}

class AudioSystem {
  private config: AudioConfig = { muted: false }
  private audioContext: AudioContext | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  setMuted(muted: boolean) {
    this.config.muted = muted
    if (typeof window !== "undefined") {
      localStorage.setItem("games-audio-muted", muted ? "true" : "false")
    }
  }

  isMuted(): boolean {
    return this.config.muted
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (this.config.muted) return

    try {
      const ctx = this.getContext()
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = frequency
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch (e) {
      console.log("[v0] Audio playback not available")
    }
  }

  // Success/correct answer - cheerful chime
  playCorrect() {
    if (this.config.muted) return
    this.playTone(800, 0.15, 0.3)
    setTimeout(() => this.playTone(1000, 0.1, 0.3), 80)
  }

  // Error/incorrect answer - gentle descending tone
  playError() {
    if (this.config.muted) return
    this.playTone(500, 0.2, 0.2)
    setTimeout(() => this.playTone(400, 0.1, 0.2), 100)
  }

  // Button click - light pop
  playClick() {
    if (this.config.muted) return
    this.playTone(600, 0.05, 0.15)
  }

  // Level/game complete - fanfare
  playComplete() {
    if (this.config.muted) return
    const frequencies = [523, 659, 784, 1047] // C, E, G, C (higher octave)
    frequencies.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.2, 0.25), idx * 100)
    })
  }

  // Combo achieved - ascending tones
  playCombo() {
    if (this.config.muted) return
    const frequencies = [400, 500, 600, 700]
    frequencies.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.1, 0.2), idx * 50)
    })
  }

  // Badge earned - special fanfare
  playBadge() {
    if (this.config.muted) return
    this.playTone(800, 0.2, 0.3)
    setTimeout(() => this.playTone(1000, 0.2, 0.3), 150)
    setTimeout(() => this.playTone(1200, 0.3, 0.3), 300)
  }
}

export const audioSystem = new AudioSystem()

// Load muted state from localStorage on initialization
if (typeof window !== "undefined") {
  const savedMuted = localStorage.getItem("games-audio-muted")
  if (savedMuted) {
    audioSystem.setMuted(savedMuted === "true")
  }
}
