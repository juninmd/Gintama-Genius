import Phaser from 'phaser';
import { COLORS } from '../constants';
import { colorAt, getColorHex, getQuadrantStart } from './boardGeometry';

export interface BoardBridge {
  onPress: (color: number) => void;
  isDisabled: () => boolean;
}

const GAP = 0.03; // radians between slices
const SPARK = 'spark';

/** Phaser scene that draws the Genius board, glow, sparks and hub. */
export class BoardScene extends Phaser.Scene {
  private readonly bridge: BoardBridge;
  private slices = new Map<number, Phaser.GameObjects.Graphics>();
  private level = new Map<number, number>();
  private hub?: Phaser.GameObjects.Container;
  private ready = false;
  private pending: number | null = null;
  private emitters = new Map<number, Phaser.GameObjects.Particles.ParticleEmitter>();

  constructor(bridge: BoardBridge) {
    super('BoardScene');
    this.bridge = bridge;
  }

  create(): void {
    this.makeSparkTexture();
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    COLORS.forEach((c) => {
      this.slices.set(c, this.add.graphics());
      this.level.set(c, 0);
      this.emitters.set(c, this.makeEmitter(c));
    });
    this.hub = this.makeHub();
    this.scale.on('resize', () => this.redraw());
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.handlePointer(p));
    this.ready = true;
    this.redraw();
    this.setActive(this.pending);
  }

  /** Lights a color (or none) with a smooth tween; called from React when `activeColor` changes. */
  setActive(color: number | null): void {
    this.pending = color;
    if (!this.ready) return;
    COLORS.forEach((c) => this.tweenLevel(c, c === color ? 1 : 0));
    if (color) {
      this.burst(color);
      this.tweens.add({ targets: this.hub, angle: '+=90', duration: 350, ease: 'Cubic.easeOut' });
    }
  }

  private handlePointer(p: Phaser.Input.Pointer): void {
    if (this.bridge.isDisabled()) return;
    const color = colorAt(p.x, p.y, this.scale.width);
    if (color) this.bridge.onPress(color);
  }

  private tweenLevel(color: number, to: number): void {
    const state = { v: this.level.get(color) ?? 0 };
    this.tweens.add({
      targets: state,
      v: to,
      duration: to ? 80 : 220,
      onUpdate: () => {
        this.level.set(color, state.v);
        this.drawSlice(color);
      },
    });
  }

  private drawSlice(color: number): void {
    const g = this.slices.get(color);
    if (!g) return;
    const size = this.scale.width;
    const r = size / 2 - 4;
    const lv = this.level.get(color) ?? 0;
    const start = getQuadrantStart(color) + GAP;
    const end = start + Math.PI / 2 - GAP * 2;
    const hex = getColorHex(color);
    g.clear();
    for (let i = 3; i >= 1 && lv > 0; i--) {
      g.fillStyle(hex, 0.12 * lv);
      g.slice(size / 2, size / 2, r + i * 3, start, end).fillPath();
    }
    g.fillStyle(hex, 0.28 + 0.72 * lv);
    g.slice(size / 2, size / 2, r, start, end).fillPath();
    g.lineStyle(3, 0xffffff, 0.15 + 0.6 * lv);
    g.slice(size / 2, size / 2, r, start, end).strokePath();
    g.fillStyle(0xffffff, 0.18 * (1 - lv * 0.5));
    g.slice(size / 2, size / 2, r * 0.55, start, start + (end - start) / 2).fillPath();
  }

  private redraw(): void {
    const size = this.scale.width;
    COLORS.forEach((c) => this.drawSlice(c));
    this.hub?.setPosition(size / 2, size / 2).setScale(size / 300);
  }

  private makeHub(): Phaser.GameObjects.Container {
    const ring = this.add.circle(0, 0, 50, 0x050508).setStrokeStyle(4, 0xffffff, 0.25);
    const glyph = this.add
      .text(0, 0, '銀', { fontFamily: "'Mochiy Pop P One', serif", fontSize: '48px', color: '#f9f871' })
      .setOrigin(0.5)
      .setShadow(0, 0, '#f9f871', 12, true, true);
    return this.add.container(0, 0, [ring, glyph]);
  }

  private makeSparkTexture(): void {
    if (this.textures.exists(SPARK)) return;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1).fillCircle(6, 6, 6);
    g.generateTexture(SPARK, 12, 12);
    g.destroy();
  }

  private makeEmitter(color: number): Phaser.GameObjects.Particles.ParticleEmitter {
    return this.add.particles(0, 0, SPARK, {
      lifespan: 600,
      speed: { min: 60, max: 220 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: getColorHex(color),
      blendMode: 'ADD',
      emitting: false,
    });
  }

  private burst(color: number): void {
    const size = this.scale.width;
    const start = getQuadrantStart(color) + Math.PI / 4;
    const x = size / 2 + Math.cos(start) * size * 0.28;
    const y = size / 2 + Math.sin(start) * size * 0.28;
    this.emitters.get(color)?.explode(14, x, y);
  }
}
