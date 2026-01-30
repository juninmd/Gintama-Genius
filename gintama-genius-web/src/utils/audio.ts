// Audio Utility with Web Audio API Fallback

type SoundKey = string | number;

const FREQUENCIES: { [key: number]: number } = {
  1: 261.63, // Red (C4)
  2: 329.63, // Green (E4)
  3: 392.00, // Blue (G4)
  4: 523.25, // Yellow (C5)
};

const ERROR_FREQ = 110; // A2

class AudioController {
  private context: AudioContext | null = null;
  public muted: boolean = false;
  private buffers: { [key: string]: AudioBuffer } = {};
  private sounds: { [key: string]: string } = {
    1: '/assets/sounds/vermelho.wav',
    2: '/assets/sounds/verde.wav',
    3: '/assets/sounds/azul.wav',
    4: '/assets/sounds/amarelo.wav',
    gameOver: '/assets/sounds/fimdejogo.wav',
    vapo: '/assets/sounds/uow.wav',
    novo: '/assets/sounds/novo.wav',
  };

  constructor() {
    this.initContext();
    // Fire and forget preload
    this.preloadSounds().catch(e => console.warn("Audio preload failed:", e));
  }

  private initContext() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  // Allow resuming context on first user interaction
  public resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(e => console.warn("Failed to resume audio context:", e));
    }
  }

  public toggleMute(): boolean {
      this.muted = !this.muted;
      return this.muted;
  }

  private async preloadSounds() {
    if (!this.context) return;

    const promises = Object.entries(this.sounds).map(async ([key, src]) => {
        try {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            if (this.context) {
                 const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                 this.buffers[key] = audioBuffer;
            }
        } catch (e) {
            console.warn(`Failed to load sound ${key} (${src}), falling back to synth.`, e);
        }
    });

    await Promise.allSettled(promises);
  }

  public play(key: SoundKey) {
    if (this.muted) return;
    this.resume();
    if (!this.context) return;

    try {
        // Try playing buffer first
        if (this.buffers[key]) {
            const source = this.context.createBufferSource();
            source.buffer = this.buffers[key];
            source.connect(this.context.destination);
            source.start(0);
        } else {
            // Fallback to synth
            this.playSynth(key);
        }
    } catch (e) {
        console.error("Error playing sound:", e);
    }
  }

  private playSynth(key: SoundKey) {
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.context.destination);

    // Determine frequency
    let freq = 440;
    let type: OscillatorType = 'sine';
    let duration = 0.5;

    if (typeof key === 'number' || (typeof key === 'string' && !isNaN(Number(key)))) {
       freq = FREQUENCIES[Number(key)] || 440;
       type = 'triangle';
    } else if (key === 'gameOver') {
       freq = ERROR_FREQ;
       type = 'sawtooth';
       duration = 1.0;
       // Slide down effect
       osc.frequency.setValueAtTime(150, this.context.currentTime);
       osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + duration);
    } else if (key === 'novo') {
        // Arpeggio-ish effect simulated by slide
        osc.frequency.setValueAtTime(400, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(800, this.context.currentTime + 0.3);
        duration = 0.3;
    } else if (key === 'vapo') {
        type = 'square';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.context.currentTime + 0.5);
    }

    if (key !== 'gameOver' && key !== 'novo' && key !== 'vapo') {
        osc.frequency.value = freq;
    }

    osc.type = type;

    // Envelope
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

    osc.start();
    osc.stop(this.context.currentTime + duration);
  }
}

export const audioController = new AudioController();
