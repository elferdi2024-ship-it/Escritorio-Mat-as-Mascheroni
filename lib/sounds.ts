// filepath: d:/PROYECTOS/REMATE CAMPO/lib/sounds.ts
// @optimization: ui-ux-pro-max - Sonidos de puja y victoria sintéticos con Web Audio API (cero latencia y cero assets)

let audioContext: AudioContext | null = null

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

export function playBidSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    // Tono ascendente rápido y sutil (de 580Hz a 880Hz)
    osc.frequency.setValueAtTime(580, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1)

    // Desvanecimiento progresivo rápido
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  } catch (e) {
    console.warn('Error al reproducir sonido de puja', e)
  }
}

export function playWinSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    // Acorde arpegiado alegre (Do, Mi, Sol, Do)
    const notes = [523.25, 659.25, 783.99, 1046.50]
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1)

      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.4)

      osc.start(ctx.currentTime + idx * 0.1)
      osc.stop(ctx.currentTime + idx * 0.1 + 0.4)
    })
  } catch (e) {
    console.warn('Error al reproducir sonido de victoria', e)
  }
}

export function playOutbidSound() {
  if (typeof window === 'undefined') return
  try {
    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sawtooth'
    // Tono descendente de alerta sutil
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.25)
  } catch (e) {
    console.warn('Error al reproducir sonido de superación', e)
  }
}
