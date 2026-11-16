type SoundName = 'click' | 'success' | 'error' | 'coin' | 'levelup' | 'badge' | 'boss' | 'evolve'

class SoundFx {
  private ctx: AudioContext | null = null
  enabled = true

  setEnabled(value: boolean) {
    this.enabled = value
  }

  private context(): AudioContext | null {
    if (!this.enabled) return null
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!Ctor) return null
        this.ctx = new Ctor()
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume()
      return this.ctx
    } catch {
      return null
    }
  }

  private tone(freq: number, start: number, duration: number, type: OscillatorType, gainValue = 0.06) {
    const ctx = this.context()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + start)
    osc.stop(ctx.currentTime + start + duration + 0.03)
  }

  play(name: SoundName) {
    if (!this.enabled) return
    switch (name) {
      case 'click':
        this.tone(520, 0, 0.06, 'triangle', 0.035)
        break
      case 'success':
        this.tone(523.25, 0, 0.1, 'triangle')
        this.tone(659.25, 0.09, 0.1, 'triangle')
        this.tone(783.99, 0.18, 0.16, 'triangle')
        break
      case 'error':
        this.tone(220, 0, 0.16, 'sawtooth', 0.035)
        this.tone(174, 0.12, 0.2, 'sawtooth', 0.03)
        break
      case 'coin':
        this.tone(880, 0, 0.06, 'square', 0.03)
        this.tone(1318, 0.06, 0.1, 'square', 0.025)
        break
      case 'levelup':
        this.tone(523, 0, 0.1, 'triangle')
        this.tone(659, 0.1, 0.1, 'triangle')
        this.tone(784, 0.2, 0.1, 'triangle')
        this.tone(1046, 0.3, 0.24, 'triangle')
        break
      case 'badge':
        this.tone(784, 0, 0.09, 'sine')
        this.tone(1046, 0.09, 0.09, 'sine')
        this.tone(1318, 0.18, 0.22, 'sine')
        break
      case 'boss':
        this.tone(98, 0, 0.25, 'sawtooth', 0.04)
        this.tone(82, 0.2, 0.35, 'sawtooth', 0.035)
        break
      case 'evolve':
        this.tone(392, 0, 0.18, 'sine')
        this.tone(523, 0.16, 0.18, 'sine')
        this.tone(659, 0.32, 0.18, 'sine')
        this.tone(784, 0.48, 0.4, 'triangle')
        break
    }
  }
}

export const sound = new SoundFx()
