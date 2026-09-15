import type { SoundProfile } from "@/stores/keyboard-store"

let context: AudioContext | null = null
const buffers = new Map<string, AudioBuffer>()

// Short, cached synthesized impacts: no audio downloads or per-key contexts.
export function playKeySound(profile: SoundProfile, volume: number, code = "") {
  if (
    profile === "off" ||
    volume <= 0 ||
    typeof window === "undefined" ||
    typeof AudioContext === "undefined"
  )
    return
  try {
    if (!context || context.state === "closed") {
      context = new AudioContext()
      buffers.clear()
    }
    const ctx = context
    const play = () => {
      if (ctx.state !== "running") return
      let buffer = buffers.get(profile)
      if (!buffer) {
        const duration =
          profile === "blue" ? 0.065 : profile === "red" ? 0.075 : 0.11
        buffer = ctx.createBuffer(
          1,
          Math.ceil(ctx.sampleRate * duration),
          ctx.sampleRate
        )
        const data = buffer.getChannelData(0)
        const body = profile === "blue" ? 950 : profile === "red" ? 520 : 240
        let smoothNoise = 0
        for (let i = 0; i < data.length; i++) {
          const t = i / ctx.sampleRate
          const noise = Math.random() * 2 - 1
          smoothNoise = 0.65 * smoothNoise + 0.35 * noise
          const attack = Math.min(t / 0.0008, 1)
          const impact = Math.sin(2 * Math.PI * body * t) * Math.exp(-t * 85)
          const texture =
            (profile === "blue" ? noise : smoothNoise) *
            Math.exp(-t * (profile === "creamy" ? 65 : 150))
          const clickTime = t - 0.012
          const click =
            profile === "blue" && clickTime > 0
              ? noise * Math.exp(-clickTime * 450) * 0.5
              : 0
          const tail = Math.min((duration - t) / 0.006, 1)
          data[i] = (impact * 0.35 + texture * 0.5 + click) * attack * tail
        }
        buffers.set(profile, buffer)
      }
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = buffer
      source.playbackRate.value = code === "Space" ? 0.8 : 1
      gain.gain.value = Math.min(1, Math.max(0, volume)) * 0.65
      source.connect(gain)
      gain.connect(ctx.destination)
      source.onended = () => {
        source.disconnect()
        gain.disconnect()
      }
      source.start()
    }
    if (ctx.state === "suspended")
      void ctx
        .resume()
        .then(play)
        .catch(() => {})
    else play()
  } catch {
    // Audio permissions or an unavailable device must never interrupt testing.
  }
}
