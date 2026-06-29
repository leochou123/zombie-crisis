import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Gamepad2, Users, RotateCcw, Skull, Shield, Zap } from "lucide-react";

// Web Audio API Retro Sound Effects Manager
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPistol() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playUzi() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playShotgun() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Generate simple white noise for blast
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playRocket() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playHit() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(80, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playPowerup() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [300, 450, 600].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.07 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.07);
    });
  }

  playDeath() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.4);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

const sfx = new SoundFX();

// Game Types & Interfaces
interface Player {
  id: 1 | 2;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  speed: number;
  score: number;
  weaponTier: number; // 1: Pistol, 2: Uzi, 3: Shotgun, 4: Rocket Launcher, 5: Laser, 6: Cannon, 7: Grenade, 8: Airstrike
  ammo: number;
  cooldown: number;
  angle: number;
  lastDx: number; // for P2 auto-aim direction
  lastDy: number;
  damageFlash: number; // red flash frame counter
  muzzleFlash: number; // muzzle flash frame counter
  weaponsOwned: { [tier: number]: boolean };
  ammos: { [tier: number]: number };
}

interface Zombie {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  speed: number;
  type: "standard" | "devil" | "miniboss" | "megaboss";
  shootTimer: number; // For firing projectile/cannon
  color: string;
  slowTimer?: number;
  lastHitByPlayerId?: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  damage: number;
  isRocket: boolean;
  isLaser?: boolean;
  isCannon?: boolean;
  isFlame?: boolean;
  isCryo?: boolean;
  hitZombieIds?: number[];
  ownerId: 1 | 2;
}

interface Grenade {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  fuse: number;
  damage: number;
  ownerId: 1 | 2;
}

interface Airstrike {
  id: number;
  targetX: number;
  targetY: number;
  timer: number;
  bombed: boolean;
  ownerId: 1 | 2;
}

interface HealthPack {
  x: number;
  y: number;
  w: number;
  h: number;
  pulse: number;
}

interface BossCannonball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  damage: number;
}

interface Fireball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  damage: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface Splatter {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Powerup {
  x: number;
  y: number;
  w: number;
  h: number;
  pulse: number;
}

interface RocketExplosion {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  currentFrame: number;
  totalFrames: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  life: number;
}

// 4 Symmetrical light-gray rectangular obstacles
const OBSTACLES = [
  { x: 180, y: 150, w: 120, h: 80 },
  { x: 600, y: 150, w: 120, h: 80 },
  { x: 180, y: 440, w: 120, h: 80 },
  { x: 600, y: 440, w: 120, h: 80 },
];

const WEAPONS = {
  1: { name: "Pistol", speed: 13, cooldown: 14, damage: 25, ammoType: "Pistol Ammo", maxAmmo: Infinity },
  2: { name: "Uzi", speed: 15, cooldown: 5, damage: 18, ammoType: "Light Bullets", maxAmmo: 300 },
  3: { name: "Shotgun", speed: 11, cooldown: 28, damage: 28, ammoType: "Shotgun Shells", maxAmmo: 72 },
  4: { name: "Rocket Launcher", speed: 8, cooldown: 48, damage: 100, ammoType: "HE Rockets", maxAmmo: 24 },
  5: { name: "Laser Rifle", speed: 22, cooldown: 4, damage: 22, ammoType: "Plasma Energy", maxAmmo: 240 },
  6: { name: "Heavy Cannon", speed: 6, cooldown: 65, damage: 160, ammoType: "Steel Slugs", maxAmmo: 36 },
  7: { name: "Bouncy Grenade", speed: 5, cooldown: 38, damage: 90, ammoType: "Hand Grenades", maxAmmo: 30 },
  8: { name: "Air Strike", speed: 0, cooldown: 120, damage: 200, ammoType: "Laser Beacons", maxAmmo: 9 },
  9: { name: "Flamethrower", speed: 10, cooldown: 2, damage: 12, ammoType: "Flame Fuel", maxAmmo: 450 },
  10: { name: "Cryo Beam", speed: 16, cooldown: 18, damage: 35, ammoType: "Cryo Liquid", maxAmmo: 90 },
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game Setup & View states
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [isCoop, setIsCoop] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [waveNum, setWaveNum] = useState<number>(0);
  
  // High scores & stats shown on UI
  const [p1Stats, setP1Stats] = useState({
    score: 0,
    hp: 100,
    weapon: "Pistol",
    ammo: 0,
    weaponsOwned: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } as Record<number, boolean>,
    ammos: { 1: Infinity, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 } as Record<number, number>,
  });
  const [p2Stats, setP2Stats] = useState({
    score: 0,
    hp: 100,
    weapon: "Pistol",
    ammo: 0,
    active: false,
    weaponsOwned: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } as Record<number, boolean>,
    ammos: { 1: Infinity, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 } as Record<number, number>,
  });

  // Game Loop references to hold instantaneous state without re-rendering lags
  const stateRef = useRef<{
    p1: Player | null;
    p2: Player | null;
    zombies: Zombie[];
    bullets: Bullet[];
    fireballs: Fireball[];
    particles: Particle[];
    splatters: Splatter[];
    powerups: Powerup[];
    explosions: RocketExplosion[];
    floatingTexts: FloatingText[];
    grenades: Grenade[];
    airstrikes: Airstrike[];
    healthPacks: HealthPack[];
    bossCannonballs: BossCannonball[];
    spawnDirections: number[];
    
    wave: number;
    waveState: "banner" | "active";
    waveTimer: number; // 3 seconds banner = 180 frames at 60fps
    zombiesToSpawn: number;
    spawnTimer: number;
    nextZombieId: number;
    nextTextId: number;

    mouseX: number;
    mouseY: number;
    keys: { [key: string]: boolean };
  }>({
    p1: null,
    p2: null,
    zombies: [],
    bullets: [],
    fireballs: [],
    particles: [],
    splatters: [],
    powerups: [],
    explosions: [],
    floatingTexts: [],
    grenades: [],
    airstrikes: [],
    healthPacks: [],
    bossCannonballs: [],
    spawnDirections: [0, 1, 2, 3],
    
    wave: 0,
    waveState: "banner",
    waveTimer: 180,
    zombiesToSpawn: 0,
    spawnTimer: 0,
    nextZombieId: 0,
    nextTextId: 0,

    mouseX: 450,
    mouseY: 335,
    keys: {},
  });

  // Track sound state
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  const switchWeapon = (playerId: 1 | 2, direction: number) => {
    const state = stateRef.current;
    const player = playerId === 1 ? state.p1 : state.p2;
    if (!player || player.hp <= 0) return;

    // Get list of currently unlocked/owned weapon tiers (1-10)
    const unlockedTiers: number[] = [];
    for (let i = 1; i <= 10; i++) {
      if (player.weaponsOwned[i]) {
        unlockedTiers.push(i);
      }
    }

    if (unlockedTiers.length <= 1) return; // Only Pistol owned, cannot switch

    let currentIndex = unlockedTiers.indexOf(player.weaponTier);
    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = (currentIndex + direction + unlockedTiers.length) % unlockedTiers.length;
    player.weaponTier = unlockedTiers[nextIndex];
    player.ammo = player.ammos[player.weaponTier];

    sfx.playPowerup();
    addFloatingText(WEAPONS[player.weaponTier as keyof typeof WEAPONS].name.toUpperCase(), player.x + player.w / 2, player.y - 15, "#fbbf24");
  };

  // Handle game input events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = true;
      // Prevent default scroll behavior for standard action keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "r" || e.key === "R") {
        if (gameState === "gameover") {
          startGame(isCoop);
        }
      }
      
      // Weapon Switching
      if (gameState === "playing") {
        if (e.key === "q" || e.key === "Q") {
          switchWeapon(1, -1);
        }
        if (e.key === "e" || e.key === "E") {
          switchWeapon(1, 1);
        }
        if (e.key === "," || e.key === "<") {
          switchWeapon(2, -1);
        }
        if (e.key === "." || e.key === ">") {
          switchWeapon(2, 1);
        }
        
        // Direct Number Hotkeys for P1 (1-9, and 0 for Slot 10)
        if (/^[0-9]$/.test(e.key)) {
          let selectedSlot = parseInt(e.key, 10);
          if (selectedSlot === 0) selectedSlot = 10;
          
          const state = stateRef.current;
          const p1 = state.p1;
          if (p1 && p1.hp > 0 && p1.weaponsOwned[selectedSlot] && p1.weaponTier !== selectedSlot) {
            p1.weaponTier = selectedSlot;
            p1.ammo = p1.ammos[selectedSlot];
            sfx.playPowerup();
            addFloatingText(WEAPONS[p1.weaponTier as keyof typeof WEAPONS].name.toUpperCase(), p1.x + p1.w / 2, p1.y - 15, "#fbbf24");
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * 900;
      stateRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * 670;
    };

    const handleMouseDown = () => {
      stateRef.current.keys["mousedown"] = true;
    };

    const handleMouseUp = () => {
      stateRef.current.keys["mousedown"] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [gameState, isCoop]);

  // AABB Collision helper
  const rectIntersect = (
    r1: { x: number; y: number; w: number; h: number },
    r2: { x: number; y: number; w: number; h: number }
  ) => {
    return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
  };

  // Sliding collision resolution for players and zombies
  const moveWithCollision = (
    entity: { x: number; y: number; w: number; h: number },
    dx: number,
    dy: number
  ) => {
    // 1. Move horizontally
    entity.x += dx;
    if (entity.x < 0) entity.x = 0;
    if (entity.x + entity.w > 900) entity.x = 900 - entity.w;
    for (const obs of OBSTACLES) {
      if (rectIntersect(entity, obs)) {
        if (dx > 0) entity.x = obs.x - entity.w;
        else if (dx < 0) entity.x = obs.x + obs.w;
      }
    }

    // 2. Move vertically
    entity.y += dy;
    if (entity.y < 0) entity.y = 0;
    if (entity.y + entity.h > 670) entity.y = 670 - entity.h;
    for (const obs of OBSTACLES) {
      if (rectIntersect(entity, obs)) {
        if (dy > 0) entity.y = obs.y - entity.h;
        else if (dy < 0) entity.y = obs.y + obs.h;
      }
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    stateRef.current.floatingTexts.push({
      id: stateRef.current.nextTextId++,
      text,
      x,
      y,
      color,
      alpha: 1,
      life: 50,
    });
  };

  const triggerExplosion = (exX: number, exY: number, ownerId?: number) => {
    sfx.playExplosion();
    stateRef.current.explosions.push({
      x: exX,
      y: exY,
      radius: 10,
      maxRadius: 100,
      currentFrame: 0,
      totalFrames: 15,
    });

    // Spawn rich orange sparks
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      stateRef.current.particles.push({
        x: exX,
        y: exY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#ef4444" : "#eab308",
        size: 3 + Math.random() * 5,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
      });
    }

    // Deal damage to zombies in radial area
    stateRef.current.zombies.forEach((zombie) => {
      const dist = Math.hypot(zombie.x + zombie.w / 2 - exX, zombie.y + zombie.h / 2 - exY);
      if (dist <= 110) {
        // Rocket launcher deals high flat AoE damage
        zombie.hp -= 120;
        if (ownerId) zombie.lastHitByPlayerId = ownerId;
        // Float damage indicator
        addFloatingText("-120", zombie.x + zombie.w / 2, zombie.y - 10, "#ef4444");
        // Spatter blood
        for (let j = 0; j < 5; j++) {
          const bloodAngle = Math.random() * Math.PI * 2;
          const bloodSpeed = 1 + Math.random() * 3;
          stateRef.current.particles.push({
            x: zombie.x + zombie.w / 2,
            y: zombie.y + zombie.h / 2,
            vx: Math.cos(bloodAngle) * bloodSpeed,
            vy: Math.sin(bloodAngle) * bloodSpeed,
            color: "#991b1b",
            size: 2 + Math.random() * 3,
            alpha: 1,
            decay: 0.015 + Math.random() * 0.015,
          });
        }
      }
    });
  };

  const triggerGrenadeExplosion = (exX: number, exY: number, ownerId?: number) => {
    sfx.playExplosion();
    stateRef.current.explosions.push({
      x: exX,
      y: exY,
      radius: 10,
      maxRadius: 120,
      currentFrame: 0,
      totalFrames: 18,
    });

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 4.5;
      stateRef.current.particles.push({
        x: exX,
        y: exY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 2 === 0 ? "#10b981" : "#eab308",
        size: 2.5 + Math.random() * 4,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
      });
    }

    stateRef.current.zombies.forEach((zombie) => {
      const dist = Math.hypot(zombie.x + zombie.w / 2 - exX, zombie.y + zombie.h / 2 - exY);
      if (dist <= 130) {
        zombie.hp -= 130;
        if (ownerId) zombie.lastHitByPlayerId = ownerId;
        addFloatingText("-130", zombie.x + zombie.w / 2, zombie.y - 10, "#fbbf24");
        for (let j = 0; j < 5; j++) {
          const bloodAngle = Math.random() * Math.PI * 2;
          const bloodSpeed = 1 + Math.random() * 3;
          stateRef.current.particles.push({
            x: zombie.x + zombie.w / 2,
            y: zombie.y + zombie.h / 2,
            vx: Math.cos(bloodAngle) * bloodSpeed,
            vy: Math.sin(bloodAngle) * bloodSpeed,
            color: "#991b1b",
            size: 2 + Math.random() * 3,
            alpha: 1,
            decay: 0.015 + Math.random() * 0.015,
          });
        }
      }
    });
  };

  const triggerBossCannonExplosion = (exX: number, exY: number) => {
    sfx.playExplosion();
    stateRef.current.explosions.push({
      x: exX,
      y: exY,
      radius: 10,
      maxRadius: 105,
      currentFrame: 0,
      totalFrames: 18,
    });

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 4.5;
      stateRef.current.particles.push({
        x: exX,
        y: exY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: i % 2 === 0 ? "#ef4444" : "#f97316",
        size: 3 + Math.random() * 4,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
      });
    }

    stateRef.current.zombies.forEach((zombie) => {
      const dist = Math.hypot(zombie.x + zombie.w / 2 - exX, zombie.y + zombie.h / 2 - exY);
      if (dist <= 110) {
        zombie.hp -= 90;
        addFloatingText("-90", zombie.x + zombie.w / 2, zombie.y - 10, "#ea580c");
        for (let j = 0; j < 4; j++) {
          const bloodAngle = Math.random() * Math.PI * 2;
          const bloodSpeed = 1 + Math.random() * 3;
          stateRef.current.particles.push({
            x: zombie.x + zombie.w / 2,
            y: zombie.y + zombie.h / 2,
            vx: Math.cos(bloodAngle) * bloodSpeed,
            vy: Math.sin(bloodAngle) * bloodSpeed,
            color: "#991b1b",
            size: 2 + Math.random() * 3,
            alpha: 1,
            decay: 0.015 + Math.random() * 0.015,
          });
        }
      }
    });

    const state = stateRef.current;
    const { p1, p2 } = state;
    const playersToDamage = [];
    if (p1 && p1.hp > 0) playersToDamage.push(p1);
    if (p2 && p2.hp > 0) playersToDamage.push(p2);
    playersToDamage.forEach((player) => {
      const dist = Math.hypot(player.x + player.w / 2 - exX, player.y + player.h / 2 - exY);
      if (dist <= 110) {
        player.hp -= 35;
        player.damageFlash = 8;
        addFloatingText("-35", player.x + player.w / 2, player.y - 12, "#ef4444");
      }
    });
  };

  const spawnZombie = () => {
    const wave = stateRef.current.wave;
    const isDevil = wave >= 3 && Math.random() < 0.12 && stateRef.current.nextZombieId % 6 === 0;

    // Pick random border side from restricted directions (0: top, 1: right, 2: bottom, 3: left)
    const directions = stateRef.current.spawnDirections || [0, 1, 2, 3];
    const side = directions[Math.floor(Math.random() * directions.length)];
    let x = 0, y = 0;
    if (side === 0) {
      x = Math.random() * 900;
      y = -30;
    } else if (side === 1) {
      x = 930;
      y = Math.random() * 670;
    } else if (side === 2) {
      x = Math.random() * 900;
      y = 700;
    } else {
      x = -30;
      y = Math.random() * 670;
    }

    // Scale stats based on wave progression (decreased by 50% per user instructions)
    const hpMultiplier = 1 + (wave - 1) * 0.15;
    const speedBonus = Math.min((wave - 1) * 0.1, 1.2);

    if (isDevil) {
      stateRef.current.zombies.push({
        id: stateRef.current.nextZombieId++,
        x,
        y,
        w: 35,
         h: 35,
        hp: 240 * hpMultiplier,
        maxHp: 240 * hpMultiplier,
        speed: (0.7 + speedBonus * 0.5) * 0.5,
        type: "devil",
        shootTimer: 150, // fires every 2.5s
        color: "#dc2626",
      });
    } else {
      stateRef.current.zombies.push({
        id: stateRef.current.nextZombieId++,
        x,
        y,
        w: 20,
        h: 20,
        hp: 40 * hpMultiplier,
        maxHp: 40 * hpMultiplier,
        speed: (1.0 + speedBonus) * 0.5,
        type: "standard",
        shootTimer: 0,
        color: "#22c55e",
      });
    }
  };

  const spawnBossZombie = (type: "miniboss" | "megaboss", side: number) => {
    const wave = stateRef.current.wave;
    const hpMultiplier = 1 + (wave - 1) * 0.15;
    const speedBonus = Math.min((wave - 1) * 0.1, 1.2);

    let x = 0, y = 0;
    if (side === 0) {
      x = Math.random() * 900;
      y = -40;
    } else if (side === 1) {
      x = 940;
      y = Math.random() * 670;
    } else if (side === 2) {
      x = Math.random() * 900;
      y = 710;
    } else {
      x = -40;
      y = Math.random() * 670;
    }

    if (type === "miniboss") {
      stateRef.current.zombies.push({
        id: stateRef.current.nextZombieId++,
        x,
        y,
        w: 28,
        h: 28,
        hp: 180 * hpMultiplier,
        maxHp: 180 * hpMultiplier,
        speed: (1.6 + speedBonus) * 0.5,
        type: "miniboss",
        shootTimer: 0,
        color: "#f97316", // Orange mini-boss
      });
    } else if (type === "megaboss") {
      stateRef.current.zombies.push({
        id: stateRef.current.nextZombieId++,
        x,
        y,
        w: 46,
        h: 46,
        hp: 600 * hpMultiplier,
        maxHp: 600 * hpMultiplier,
        speed: 0.55,
        type: "megaboss",
        shootTimer: 180, // shoots cannon every 3s
        color: "#ef4444", // Giant Red mega-boss
      });
    }
  };

  const selectTwoDirections = (): number[] => {
    const all = [0, 1, 2, 3];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return [all[0], all[1]];
  };

  const triggerSpecialBossSpawns = (wave: number) => {
    // Re-verify we select two directions for this round
    const directions = selectTwoDirections();
    stateRef.current.spawnDirections = directions;

    if (wave % 5 === 0) {
      for (let i = 0; i < 3; i++) {
        spawnBossZombie("miniboss", directions[i % directions.length]);
      }
      addFloatingText("WARNING: ORANGE MINI-BOSSES SPAWNED!", 450, 200, "#f97316");
    }

    if (wave % 10 === 0) {
      spawnBossZombie("megaboss", directions[0]);
      addFloatingText("ALERT: RED MEGA-BOSS INBOUND!", 450, 160, "#ef4444");
    }
  };

  const spawnHealthPack = () => {
    // Spawn health pack near center hazard zone
    const hx = 425 + (Math.random() - 0.5) * 80;
    const hy = 310 + (Math.random() - 0.5) * 80;
    stateRef.current.healthPacks.push({
      x: hx,
      y: hy,
      w: 16,
      h: 16,
      pulse: 0,
    });
    addFloatingText("+MED KIT PLACED!", hx, hy - 10, "#22c55e");
  };

  const startNextWave = () => {
    const nextWave = stateRef.current.wave + 1;
    stateRef.current.wave = nextWave;
    stateRef.current.waveState = "banner";
    stateRef.current.waveTimer = 180; // 3 seconds banner
    stateRef.current.zombiesToSpawn = 5 + nextWave * 5;
    stateRef.current.spawnTimer = 0;
    setWaveNum(nextWave);
    
    // Clear out residual projectiles
    stateRef.current.bullets = [];
    stateRef.current.fireballs = [];
    stateRef.current.grenades = [];
    stateRef.current.bossCannonballs = [];
    
    // Pick directions early
    stateRef.current.spawnDirections = selectTwoDirections();
  };

  const startGame = (coopMode: boolean) => {
    sfx.init();
    setIsCoop(coopMode);
    setGameState("playing");

    // Initialize players (speed decreased by 30%: 3.5 * 0.7 = 2.45)
    const p1Obj: Player = {
      id: 1,
      x: 420,
      y: 320,
      w: 20,
      h: 20,
      hp: 100,
      maxHp: 100,
      speed: 2.45,
      score: 0,
      weaponTier: 1,
      ammo: 0,
      cooldown: 0,
      angle: 0,
      lastDx: 1,
      lastDy: 0,
      damageFlash: 0,
      muzzleFlash: 0,
      weaponsOwned: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
      ammos: { 1: Infinity, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    };

    let p2Obj: Player | null = null;
    if (coopMode) {
      p2Obj = {
        id: 2,
        x: 460,
        y: 320,
        w: 20,
        h: 20,
        hp: 100,
        maxHp: 100,
        speed: 2.45,
        score: 0,
        weaponTier: 1,
        ammo: 0,
        cooldown: 0,
        angle: 0,
        lastDx: -1,
        lastDy: 0,
        damageFlash: 0,
        muzzleFlash: 0,
        weaponsOwned: { 1: true, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
        ammos: { 1: Infinity, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      };
    }

    stateRef.current = {
      p1: p1Obj,
      p2: p2Obj,
      zombies: [],
      bullets: [],
      fireballs: [],
      particles: [],
      splatters: [],
      powerups: [],
      explosions: [],
      floatingTexts: [],
      grenades: [],
      airstrikes: [],
      healthPacks: [],
      bossCannonballs: [],
      spawnDirections: [0, 1, 2, 3],
      
      wave: 0,
      waveState: "banner",
      waveTimer: 180,
      zombiesToSpawn: 0,
      spawnTimer: 0,
      nextZombieId: 0,
      nextTextId: 0,

      mouseX: 450,
      mouseY: 335,
      keys: {},
    };

    startNextWave();
  };

  // Main Canvas Render & Game Core Mechanics Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const state = stateRef.current;
      const { p1, p2, keys } = state;

      if ((!p1 || p1.hp <= 0) && (!p2 || p2.hp <= 0)) {
        setGameState("gameover");
        sfx.playDeath();
        return;
      }

      // --- 1. PLAYER LOGIC & CONTROLS ---
      // Player 1 (Yellow, WASD, Mouse Aim, Mouse/Space Fire)
      if (p1 && p1.hp > 0) {
        let dx = 0;
        let dy = 0;
        if (keys["w"] || keys["W"]) dy -= p1.speed;
        if (keys["s"] || keys["S"]) dy += p1.speed;
        if (keys["a"] || keys["A"]) dx -= p1.speed;
        if (keys["d"] || keys["D"]) dx += p1.speed;

        // Diagonal normalization
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }
        moveWithCollision(p1, dx, dy);

        // Angle calculated from Mouse Position
        const p1CenterX = p1.x + p1.w / 2;
        const p1CenterY = p1.y + p1.h / 2;
        p1.angle = Math.atan2(state.mouseY - p1CenterY, state.mouseX - p1CenterX);

        if (p1.cooldown > 0) p1.cooldown--;

        // Trigger shooting
        if ((keys["mousedown"] || keys[" "]) && p1.cooldown === 0) {
          shootWeapon(p1);
        }
        if (p1.damageFlash > 0) p1.damageFlash--;
        if (p1.muzzleFlash > 0) p1.muzzleFlash--;
      }

      // Player 2 (Blue, Arrow Keys, Auto-Aim Last Vector, Enter Fire)
      if (p2 && p2.hp > 0) {
        let dx = 0;
        let dy = 0;
        if (keys["ArrowUp"]) dy -= p2.speed;
        if (keys["ArrowDown"]) dy += p2.speed;
        if (keys["ArrowLeft"]) dx -= p2.speed;
        if (keys["ArrowRight"]) dx += p2.speed;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }
        moveWithCollision(p2, dx, dy);

        // Update direction vector and angle if moving
        if (dx !== 0 || dy !== 0) {
          p2.lastDx = dx;
          p2.lastDy = dy;
          p2.angle = Math.atan2(dy, dx);
        }

        if (p2.cooldown > 0) p2.cooldown--;

        if (keys["Enter"] && p2.cooldown === 0) {
          shootWeapon(p2);
        }
        if (p2.damageFlash > 0) p2.damageFlash--;
        if (p2.muzzleFlash > 0) p2.muzzleFlash--;
      }

      // --- 2. WEAPON DISPATCHER ---
      function shootWeapon(player: Player) {
        const specs = WEAPONS[player.weaponTier as keyof typeof WEAPONS];
        player.cooldown = specs.cooldown;
        player.muzzleFlash = 4;

        // Play matching retro sounds
        if (player.weaponTier === 1) sfx.playPistol();
        else if (player.weaponTier === 2) sfx.playUzi();
        else if (player.weaponTier === 3) sfx.playShotgun();
        else if (player.weaponTier === 4) sfx.playRocket();
        else if (player.weaponTier === 5) sfx.playPistol(); // laser pew
        else if (player.weaponTier === 6) sfx.playRocket(); // heavy cannon
        else if (player.weaponTier === 7) sfx.playPistol(); // grenade lob
        else if (player.weaponTier === 8) sfx.playPowerup(); // airstrike beacon
        else if (player.weaponTier === 9) sfx.playUzi(); // flamethrower rapid sound
        else if (player.weaponTier === 10) sfx.playPistol(); // cryo pew

        const pCenterX = player.x + player.w / 2;
        const pCenterY = player.y + player.h / 2;

        if (player.weaponTier === 3) {
          // Shotgun Spread (3 bullets in a 30-degree cone)
          const spreads = [-0.26, 0, 0.26];
          spreads.forEach((spreadAngle) => {
            const finalAngle = player.angle + spreadAngle;
            state.bullets.push({
              x: pCenterX,
              y: pCenterY,
              vx: Math.cos(finalAngle) * specs.speed,
              vy: Math.sin(finalAngle) * specs.speed,
              w: 5,
              h: 5,
              damage: specs.damage,
              isRocket: false,
              ownerId: player.id,
            });
          });
        } else if (player.weaponTier === 9) {
          // Flamethrower
          const spreadAngle = (Math.random() * 0.3 - 0.15); // small flame spread
          const finalAngle = player.angle + spreadAngle;
          state.bullets.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(finalAngle) * specs.speed,
            vy: Math.sin(finalAngle) * specs.speed,
            w: 14,
            h: 14,
            damage: specs.damage,
            isRocket: false,
            isFlame: true,
            ownerId: player.id,
          });
          // Aesthetic flame particles
          if (Math.random() < 0.65) {
            state.particles.push({
              x: pCenterX + Math.cos(player.angle) * 12,
              y: pCenterY + Math.sin(player.angle) * 12,
              vx: Math.cos(finalAngle) * (specs.speed * 0.5) + (Math.random() * 1.5 - 0.75),
              vy: Math.sin(finalAngle) * (specs.speed * 0.5) + (Math.random() * 1.5 - 0.75),
              color: Math.random() < 0.65 ? "#f97316" : "#ef4444",
              size: 4 + Math.random() * 5,
              alpha: 0.9,
              decay: 0.05 + Math.random() * 0.03,
            });
          }
        } else if (player.weaponTier === 10) {
          // Cryo Beam
          state.bullets.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(player.angle) * specs.speed,
            vy: Math.sin(player.angle) * specs.speed,
            w: 9,
            h: 9,
            damage: specs.damage,
            isRocket: false,
            isCryo: true,
            ownerId: player.id,
          });
        } else if (player.weaponTier === 5) {
          // Laser Rifle - piercing projectile
          state.bullets.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(player.angle) * specs.speed,
            vy: Math.sin(player.angle) * specs.speed,
            w: 8,
            h: 8,
            damage: specs.damage,
            isRocket: false,
            isLaser: true,
            hitZombieIds: [],
            ownerId: player.id,
          });
        } else if (player.weaponTier === 6) {
          // Heavy Cannon - massive piercing metal ball
          state.bullets.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(player.angle) * specs.speed,
            vy: Math.sin(player.angle) * specs.speed,
            w: 18,
            h: 18,
            damage: specs.damage,
            isRocket: false,
            isCannon: true,
            hitZombieIds: [],
            ownerId: player.id,
          });
        } else if (player.weaponTier === 7) {
          // Bouncy Grenade
          state.grenades.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(player.angle) * specs.speed,
            vy: Math.sin(player.angle) * specs.speed,
            w: 12,
            h: 12,
            fuse: 70, // 1.15 seconds
            damage: specs.damage,
            ownerId: player.id,
          });
        } else if (player.weaponTier === 8) {
          // Air Strike Beacon
          const targetDist = 180;
          const targetX = Math.max(20, Math.min(880, pCenterX + Math.cos(player.angle) * targetDist));
          const targetY = Math.max(20, Math.min(650, pCenterY + Math.sin(player.angle) * targetDist));
          
          state.airstrikes.push({
            id: state.nextTextId++,
            targetX,
            targetY,
            timer: 85,
            bombed: false,
            ownerId: player.id,
          });
          
          // Spawn indicators
          for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            state.particles.push({
              x: targetX,
              y: targetY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: "#ef4444",
              size: 2,
              alpha: 1,
              decay: 0.03,
            });
          }
          addFloatingText("BEACON DEPLOYED", targetX, targetY - 10, "#ef4444");
        } else {
          // Pistol, Uzi, or Rocket Launcher
          state.bullets.push({
            x: pCenterX,
            y: pCenterY,
            vx: Math.cos(player.angle) * specs.speed,
            vy: Math.sin(player.angle) * specs.speed,
            w: player.weaponTier === 4 ? 10 : 5,
            h: player.weaponTier === 4 ? 10 : 5,
            damage: specs.damage,
            isRocket: player.weaponTier === 4,
            ownerId: player.id,
          });
        }

        // Handle Ammo consumption and state sync
        if (player.weaponTier > 1) {
          player.ammos[player.weaponTier]--;
          player.ammo = player.ammos[player.weaponTier];
          if (player.ammo <= 0) {
            player.weaponsOwned[player.weaponTier] = false; // remove from owned
            player.weaponTier = 1; // revert back to Pistol
            player.ammo = Infinity;
            addFloatingText("PISTOL", player.x + player.w / 2, player.y - 10, "#94a3b8");
          }
        }
      }

      // --- 3. WAVE PROGRESSION LOGIC ---
      if (state.waveState === "banner") {
        state.waveTimer--;
        if (state.waveTimer <= 0) {
          state.waveState = "active";
          triggerSpecialBossSpawns(state.wave);
        }
      } else {
        // Spawn countdown
        if (state.zombiesToSpawn > 0) {
          state.spawnTimer++;
          // Spawning cadence
          if (state.spawnTimer >= Math.max(35 - state.wave * 2, 12)) {
            spawnZombie();
            state.zombiesToSpawn--;
            state.spawnTimer = 0;
          }
        } else if (state.zombies.length === 0) {
          // Clear wave and reward players with beautiful score increments
          if (p1 && p1.hp > 0) {
            p1.score += state.wave * 150;
            addFloatingText(`+${state.wave * 150} WAVE BONUS`, p1.x + p1.w / 2, p1.y - 25, "#eab308");
          }
          if (p2 && p2.hp > 0) {
            p2.score += state.wave * 150;
            addFloatingText(`+${state.wave * 150} WAVE BONUS`, p2.x + p2.w / 2, p2.y - 25, "#eab308");
          }
          
          // Spawn health pack at end of each wave
          spawnHealthPack();
          
          startNextWave();
        }
      }

      // --- 4. ZOMBIE COLLISION & BEHAVIOR AI ---
      // Distribute and repel zombies slightly (Horde avoidance behavior)
      for (let i = 0; i < state.zombies.length; i++) {
        for (let j = i + 1; j < state.zombies.length; j++) {
          const z1 = state.zombies[i];
          const z2 = state.zombies[j];
          const dx = z2.x - z1.x;
          const dy = z2.y - z1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = (z1.w + z2.w) / 2 + 1;
          if (dist < minDist) {
            const overlap = minDist - dist;
            const forceX = (dx / (dist || 1)) * overlap * 0.25;
            const forceY = (dy / (dist || 1)) * overlap * 0.25;
            moveWithCollision(z1, -forceX, -forceY);
            moveWithCollision(z2, forceX, forceY);
          }
        }
      }

      state.zombies.forEach((zombie) => {
        // Find nearest active target player
        const targets: Player[] = [];
        if (p1 && p1.hp > 0) targets.push(p1);
        if (p2 && p2.hp > 0) targets.push(p2);

        let closestTarget: Player | null = null;
        let minDist = Infinity;
        targets.forEach((target) => {
          const dist = Math.hypot(target.x - zombie.x, target.y - zombie.y);
          if (dist < minDist) {
            minDist = dist;
            closestTarget = target;
          }
        });

        if (closestTarget) {
          const dx = (closestTarget as Player).x - zombie.x;
          const dy = (closestTarget as Player).y - zombie.y;
          const dist = Math.hypot(dx, dy);

          // Cryo Slowdown calculations
          let currentSpeed = zombie.speed;
          if (zombie.slowTimer && zombie.slowTimer > 0) {
            zombie.slowTimer--;
            currentSpeed *= 0.4; // 60% slow down!
            if (Math.random() < 0.15) {
              state.particles.push({
                x: zombie.x + Math.random() * zombie.w,
                y: zombie.y + Math.random() * zombie.h,
                vx: (Math.random() * 2 - 1) * 0.4,
                vy: -0.3 - Math.random() * 0.4,
                color: "#22d3ee",
                size: 1.5 + Math.random() * 1.5,
                alpha: 0.8,
                decay: 0.02,
              });
            }
          }

          if (zombie.type === "devil") {
            zombie.shootTimer--;
            // Devil charging stance
            if (zombie.shootTimer > 45) {
              // Move towards closest player
              if (dist > 0) {
                moveWithCollision(zombie, (dx / dist) * currentSpeed, (dy / dist) * currentSpeed);
              }
            } else {
              // Charge charging particles
              if (Math.random() < 0.4) {
                state.particles.push({
                  x: zombie.x + zombie.w / 2 + (Math.random() * 20 - 10),
                  y: zombie.y + zombie.h / 2 + (Math.random() * 20 - 10),
                  vx: 0,
                  vy: -0.5 - Math.random() * 1,
                  color: "#f97316",
                  size: 2 + Math.random() * 3,
                  alpha: 1,
                  decay: 0.03,
                });
              }
              if (zombie.shootTimer <= 0) {
                // Shoot devil fireball
                if (dist > 0) {
                  sfx.playHit();
                  state.fireballs.push({
                    x: zombie.x + zombie.w / 2,
                    y: zombie.y + zombie.h / 2,
                    vx: (dx / dist) * 8.0,
                    vy: (dy / dist) * 8.0,
                    w: 10,
                    h: 10,
                    damage: 30,
                  });
                }
                zombie.shootTimer = 150; // reset
              }
            }
          } else if (zombie.type === "megaboss") {
            zombie.shootTimer--;
            if (dist > 0) {
              moveWithCollision(zombie, (dx / dist) * currentSpeed, (dy / dist) * currentSpeed);
            }
            if (zombie.shootTimer <= 0) {
              if (dist > 0) {
                sfx.playHit();
                state.bossCannonballs.push({
                  x: zombie.x + zombie.w / 2,
                  y: zombie.y + zombie.h / 2,
                  vx: (dx / dist) * 4.5,
                  vy: (dy / dist) * 4.5,
                  w: 18,
                  h: 18,
                  damage: 45,
                });
                addFloatingText("BOOM!", zombie.x + zombie.w / 2, zombie.y - 15, "#ef4444");
              }
              zombie.shootTimer = 180; // reload
            }
          } else {
            // Standard or miniboss Zombie moves directly
            if (dist > 0) {
              moveWithCollision(zombie, (dx / dist) * currentSpeed, (dy / dist) * currentSpeed);
            }
          }

          // Contact damage to players
          if (rectIntersect(zombie, closestTarget)) {
            const victim = closestTarget as Player;
            victim.hp -= 0.5; // continuous contact damage
            victim.damageFlash = 8;
            if (victim.hp <= 0) {
              sfx.playDeath();
              addFloatingText("PLAYER DIED", victim.x + victim.w / 2, victim.y - 10, "#dc2626");
            }
          }
        }
      });

      // --- 5. BULLETS & FIREBALLS PROJECTILES ---
      // Update bullets
      for (let i = state.bullets.length - 1; i >= 0; i--) {
        const b = state.bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        let bulletRemoved = false;

        // Boundary and obstacle collision
        if (b.x < 0 || b.x > 900 || b.y < 0 || b.y > 670) {
          state.bullets.splice(i, 1);
          continue;
        }

        // Crate obstacle collision
        for (const obs of OBSTACLES) {
          if (rectIntersect({ x: b.x - b.w/2, y: b.y - b.h/2, w: b.w, h: b.h }, obs)) {
            if (b.isRocket) {
              triggerExplosion(b.x, b.y, b.ownerId);
            } else {
              // Simple spark particles
              for (let k = 0; k < 3; k++) {
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() * 2 - 1) * 2,
                  vy: (Math.random() * 2 - 1) * 2,
                  color: "#d4d4d8",
                  size: 2,
                  alpha: 1,
                  decay: 0.04,
                });
              }
            }
            state.bullets.splice(i, 1);
            bulletRemoved = true;
            break;
          }
        }
        if (bulletRemoved) continue;

        // Zombie damage collision
        for (let j = state.zombies.length - 1; j >= 0; j--) {
          const z = state.zombies[j];
          if (rectIntersect({ x: b.x - b.w/2, y: b.y - b.h/2, w: b.w, h: b.h }, z)) {
            // Check piercing lists
            if (b.isLaser || b.isCannon || b.isFlame) {
              if (!b.hitZombieIds) b.hitZombieIds = [];
              if (b.hitZombieIds.includes(z.id)) {
                continue; // already hit this zombie, pass through
              }
              b.hitZombieIds.push(z.id);
            }

            if (b.isRocket) {
              triggerExplosion(b.x, b.y, b.ownerId);
            } else {
              sfx.playHit();
              z.hp -= b.damage;
              z.lastHitByPlayerId = b.ownerId;

              // Apply Cryo slowdown if cryo bullet
              if (b.isCryo) {
                z.slowTimer = 150; // 2.5 seconds
                // Ice shards
                for (let k = 0; k < 5; k++) {
                  state.particles.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() * 2 - 1) * 2,
                    vy: (Math.random() * 2 - 1) * 2,
                    color: "#22d3ee",
                    size: 1.5 + Math.random() * 2,
                    alpha: 1,
                    decay: 0.03,
                  });
                }
              }

              // Apply Fire impact sparks if flamethrower
              if (b.isFlame) {
                for (let k = 0; k < 3; k++) {
                  state.particles.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() * 2 - 1) * 1.5,
                    vy: (Math.random() * 2 - 1) * 1.5,
                    color: "#f97316",
                    size: 2 + Math.random() * 2,
                    alpha: 0.9,
                    decay: 0.04,
                  });
                }
              }
              
              // Spawn blood impact particles
              for (let k = 0; k < 6; k++) {
                const angle = Math.atan2(b.vy, b.vx) + (Math.random() * 1.2 - 0.6);
                const speed = 1.5 + Math.random() * 3.5;
                state.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: "#991b1b",
                  size: 2 + Math.random() * 2.5,
                  alpha: 1,
                  decay: 0.015 + Math.random() * 0.02,
                });
              }

              // Floated single damage texts
              addFloatingText(`-${b.damage}`, z.x + z.w / 2, z.y - 10, b.isCryo ? "#22d3ee" : b.isFlame ? "#f97316" : "#fbbf24");
            }

            // Clean up zombie if dead
            if (z.hp <= 0) {
              // Add permanently printed splatter
              state.splatters.push({
                x: z.x + z.w / 2,
                y: z.y + z.h / 2,
                radius: z.type === "megaboss" ? 36 + Math.random() * 12 : z.type === "miniboss" ? 22 + Math.random() * 8 : z.type === "devil" ? 20 + Math.random() * 8 : 12 + Math.random() * 6,
                alpha: 0.5,
              });

              // Keep splatters capped to 250 to prevent memory leak
              if (state.splatters.length > 250) {
                state.splatters.shift();
              }

              // Award score
              const points = z.type === "megaboss" ? 1000 : z.type === "miniboss" ? 250 : z.type === "devil" ? 100 : 10;
              const owner = b.ownerId === 1 ? p1 : p2;
              if (owner) owner.score += points;

              // Green Ammo Box drop (18% chance)
              if (Math.random() < 0.18) {
                state.powerups.push({
                  x: z.x + z.w / 2 - 6,
                  y: z.y + z.h / 2 - 6,
                  w: 12,
                  h: 12,
                  pulse: 0,
                });
              }

              state.zombies.splice(j, 1);
            }

            if (b.isLaser) {
              // laser does NOT get destroyed here, keeps flying!
            } else if (b.isCannon) {
              // cannon ball can pierce up to 4 targets before being destroyed
              if (b.hitZombieIds && b.hitZombieIds.length >= 4) {
                state.bullets.splice(i, 1);
                bulletRemoved = true;
                break;
              }
            } else if (b.isFlame) {
              // flame can pierce up to 2 targets
              if (b.hitZombieIds && b.hitZombieIds.length >= 2) {
                state.bullets.splice(i, 1);
                bulletRemoved = true;
                break;
              }
            } else {
              state.bullets.splice(i, 1);
              bulletRemoved = true;
              break;
            }
          }
        }
      }

      // Update Devil Fireballs (bypass obstacles as specified)
      for (let i = state.fireballs.length - 1; i >= 0; i--) {
        const f = state.fireballs[i];
        f.x += f.vx;
        f.y += f.vy;

        if (f.x < 0 || f.x > 900 || f.y < 0 || f.y > 670) {
          state.fireballs.splice(i, 1);
          continue;
        }

        let fireballHit = false;
        const playersToCollide = [];
        if (p1 && p1.hp > 0) playersToCollide.push(p1);
        if (p2 && p2.hp > 0) playersToCollide.push(p2);

        for (const player of playersToCollide) {
          if (rectIntersect({ x: f.x - f.w/2, y: f.y - f.h/2, w: f.w, h: f.h }, player)) {
            player.hp -= f.damage;
            player.damageFlash = 8;
            sfx.playHit();
            addFloatingText(`-${f.damage}`, player.x + player.w / 2, player.y - 12, "#ef4444");
            
            // Fire sparks particles
            for (let k = 0; k < 8; k++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1 + Math.random() * 3;
              state.particles.push({
                x: f.x,
                y: f.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: "#f97316",
                size: 2.5 + Math.random() * 2,
                alpha: 1,
                decay: 0.02,
              });
            }

            state.fireballs.splice(i, 1);
            fireballHit = true;
            break;
          }
        }
        if (fireballHit) continue;
      }

      // Update Grenades
      for (let i = state.grenades.length - 1; i >= 0; i--) {
        const g = state.grenades[i];
        g.x += g.vx;
        g.y += g.vy;
        
        g.vx *= 0.95;
        g.vy *= 0.95;
        
        g.fuse--;

        let exploded = false;

        // Boundary bounce
        if (g.x < 10) { g.x = 10; g.vx = -g.vx * 0.7; }
        if (g.x > 890) { g.x = 890; g.vx = -g.vx * 0.7; }
        if (g.y < 10) { g.y = 10; g.vy = -g.vy * 0.7; }
        if (g.y > 660) { g.y = 660; g.vy = -g.vy * 0.7; }

        // Obstacle bounce
        for (const obs of OBSTACLES) {
          if (rectIntersect({ x: g.x - g.w/2, y: g.y - g.h/2, w: g.w, h: g.h }, obs)) {
            const centerDiffX = g.x - (obs.x + obs.w / 2);
            const centerDiffY = g.y - (obs.y + obs.h / 2);
            if (Math.abs(centerDiffX) / obs.w > Math.abs(centerDiffY) / obs.h) {
              g.vx = -g.vx * 0.75;
              g.x += g.vx * 2;
            } else {
              g.vy = -g.vy * 0.75;
              g.y += g.vy * 2;
            }
          }
        }

        for (const z of state.zombies) {
          if (rectIntersect({ x: g.x - g.w/2, y: g.y - g.h/2, w: g.w, h: g.h }, z)) {
            exploded = true;
            break;
          }
        }

        if (g.fuse <= 0) {
          exploded = true;
        }

        if (exploded) {
          triggerGrenadeExplosion(g.x, g.y, g.ownerId);
          state.grenades.splice(i, 1);
        }
      }

      // Update Air Strikes
      for (let i = state.airstrikes.length - 1; i >= 0; i--) {
        const ast = state.airstrikes[i];
        
        if (ast.timer > 0) {
          ast.timer--;
          if (ast.timer % 15 === 0) {
            for (let k = 0; k < 6; k++) {
              const angle = Math.random() * Math.PI * 2;
              state.particles.push({
                x: ast.targetX,
                y: ast.targetY,
                vx: Math.cos(angle) * 1.5,
                vy: Math.sin(angle) * 1.5,
                color: "#ef4444",
                size: 2,
                alpha: 1,
                decay: 0.04,
              });
            }
          }
        } else {
          if (ast.bombFrameCounter === undefined) ast.bombFrameCounter = 0;
          if (ast.bombIndex === undefined) ast.bombIndex = 0;

          ast.bombFrameCounter++;

          if (ast.bombFrameCounter % 6 === 0) {
            const j = ast.bombIndex;
            const offset = (j - 2) * 65;
            const bombX = ast.targetX + offset;
            const bombY = ast.targetY + (Math.random() * 30 - 15);

            if (bombX > 0 && bombX < 900 && bombY > 0 && bombY < 670) {
              sfx.playExplosion();
              state.explosions.push({
                x: bombX,
                y: bombY,
                radius: 12,
                maxRadius: 130,
                currentFrame: 0,
                totalFrames: 20,
              });

              for (let k = 0; k < 18; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 5;
                state.particles.push({
                  x: bombX,
                  y: bombY,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: k % 2 === 0 ? "#ef4444" : "#f59e0b",
                  size: 3 + Math.random() * 4,
                  alpha: 1,
                  decay: 0.02 + Math.random() * 0.02,
                });
              }

              state.zombies.forEach((zombie) => {
                const dist = Math.hypot(zombie.x + zombie.w/2 - bombX, zombie.y + zombie.h/2 - bombY);
                if (dist <= 135) {
                  zombie.hp -= 200;
                  addFloatingText("-200", zombie.x + zombie.w/2, zombie.y - 12, "#ef4444");
                }
              });
            }

            ast.bombIndex++;
            if (ast.bombIndex >= 5) {
              state.airstrikes.splice(i, 1);
            }
          }
        }
      }

      // Update Boss Cannonballs
      for (let i = state.bossCannonballs.length - 1; i >= 0; i--) {
        const c = state.bossCannonballs[i];
        c.x += c.vx;
        c.y += c.vy;

        let cannonRemoved = false;

        if (c.x < 0 || c.x > 900 || c.y < 0 || c.y > 670) {
          state.bossCannonballs.splice(i, 1);
          continue;
        }

        for (const obs of OBSTACLES) {
          if (rectIntersect({ x: c.x - c.w/2, y: c.y - c.h/2, w: c.w, h: c.h }, obs)) {
            triggerBossCannonExplosion(c.x, c.y);
            state.bossCannonballs.splice(i, 1);
            cannonRemoved = true;
            break;
          }
        }
        if (cannonRemoved) continue;

        const players = [];
        if (p1 && p1.hp > 0) players.push(p1);
        if (p2 && p2.hp > 0) players.push(p2);
        for (const player of players) {
          if (rectIntersect({ x: c.x - c.w/2, y: c.y - c.h/2, w: c.w, h: c.h }, player)) {
            triggerBossCannonExplosion(c.x, c.y);
            state.bossCannonballs.splice(i, 1);
            cannonRemoved = true;
            break;
          }
        }
        if (cannonRemoved) continue;

        for (const zombie of state.zombies) {
          if (zombie.type === "megaboss") continue;
          if (rectIntersect({ x: c.x - c.w/2, y: c.y - c.h/2, w: c.w, h: c.h }, zombie)) {
            triggerBossCannonExplosion(c.x, c.y);
            state.bossCannonballs.splice(i, 1);
            cannonRemoved = true;
            break;
          }
        }
      }

      // Update Health Packs
      for (let i = state.healthPacks.length - 1; i >= 0; i--) {
        const hpPack = state.healthPacks[i];
        hpPack.pulse += 0.08;

        const playersToPickup = [];
        if (p1 && p1.hp > 0) playersToPickup.push(p1);
        if (p2 && p2.hp > 0) playersToPickup.push(p2);

        for (const player of playersToPickup) {
          if (rectIntersect(hpPack, player)) {
            sfx.playPowerup();
            player.hp = Math.min(player.maxHp, player.hp + 40);
            addFloatingText("+40 HP HEAL", player.x + player.w/2, player.y - 15, "#10b981");
            state.healthPacks.splice(i, 1);
            break;
          }
        }
      }

      // --- 6. ROCKET EXPLOSION AND PARTICLES ---
      // Update Shockwaves
      for (let i = state.explosions.length - 1; i >= 0; i--) {
        const exp = state.explosions[i];
        exp.currentFrame++;
        exp.radius = exp.maxRadius * (exp.currentFrame / exp.totalFrames);
        if (exp.currentFrame >= exp.totalFrames) {
          state.explosions.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
        }
      }

      // Update Floating Texts
      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 0.6;
        ft.life--;
        ft.alpha = Math.max(ft.life / 50, 0);
        if (ft.life <= 0) {
          state.floatingTexts.splice(i, 1);
        }
      }

      // --- 7. AMMO ITEM DROP PICKUPS ---
      for (let i = state.powerups.length - 1; i >= 0; i--) {
        const box = state.powerups[i];
        box.pulse += 0.08;

        const playersToPickup = [];
        if (p1 && p1.hp > 0) playersToPickup.push(p1);
        if (p2 && p2.hp > 0) playersToPickup.push(p2);

        for (const player of playersToPickup) {
          if (rectIntersect(box, player)) {
            sfx.playPowerup();

            const weaponRoll = Math.floor(Math.random() * 9) + 2; // Roll random tier from 2 to 10
            const weaponSpecs = WEAPONS[weaponRoll as keyof typeof WEAPONS];
            const nameUpper = weaponSpecs.name.toUpperCase();
            
            let refill = 0;
            let maxLimit = 0;
            if (weaponRoll === 2) { refill = 100; maxLimit = 300; }
            else if (weaponRoll === 3) { refill = 24; maxLimit = 72; }
            else if (weaponRoll === 4) { refill = 8; maxLimit = 24; }
            else if (weaponRoll === 5) { refill = 80; maxLimit = 240; }
            else if (weaponRoll === 6) { refill = 12; maxLimit = 36; }
            else if (weaponRoll === 7) { refill = 10; maxLimit = 30; }
            else if (weaponRoll === 8) { refill = 3; maxLimit = 9; }
            else if (weaponRoll === 9) { refill = 150; maxLimit = 450; }
            else if (weaponRoll === 10) { refill = 30; maxLimit = 90; }

            if (!player.weaponsOwned[weaponRoll]) {
              player.weaponsOwned[weaponRoll] = true;
              player.ammos[weaponRoll] = refill;
            } else {
              player.ammos[weaponRoll] = Math.min(maxLimit, player.ammos[weaponRoll] + refill);
            }

            // Equip this weapon
            player.weaponTier = weaponRoll;
            player.ammo = player.ammos[weaponRoll];

            addFloatingText(`+${nameUpper} (${player.ammo})`, player.x + player.w / 2, player.y - 15, "#10b981");
            state.powerups.splice(i, 1);
            break;
          }
        }
      }

      // Unified Zombie Death & Cleanup Safety Check (resolves any possible health bar inconsistencies)
      for (let j = state.zombies.length - 1; j >= 0; j--) {
        const z = state.zombies[j];
        if (z.hp <= 0) {
          // Add permanently printed splatter
          state.splatters.push({
            x: z.x + z.w / 2,
            y: z.y + z.h / 2,
            radius: z.type === "megaboss" ? 36 + Math.random() * 12 : z.type === "miniboss" ? 22 + Math.random() * 8 : z.type === "devil" ? 20 + Math.random() * 8 : 12 + Math.random() * 6,
            alpha: 0.5,
          });

          // Keep splatters capped to 250 to prevent memory leak
          if (state.splatters.length > 250) {
            state.splatters.shift();
          }

          // Award score to the last damager if not already done
          if (z.lastHitByPlayerId) {
            const points = z.type === "megaboss" ? 1000 : z.type === "miniboss" ? 250 : z.type === "devil" ? 100 : 10;
            const player = z.lastHitByPlayerId === 1 ? state.p1 : state.p2;
            if (player) {
              player.score += points;
            }
          }

          // Green Ammo Box drop (18% chance)
          if (Math.random() < 0.18) {
            state.powerups.push({
              x: z.x + z.w / 2 - 6,
              y: z.y + z.h / 2 - 6,
              w: 12,
              h: 12,
              pulse: 0,
            });
          }

          // Health Pack drop (10% chance)
          if (Math.random() < 0.10) {
            state.healthPacks.push({
              x: z.x + z.w / 2 - 8,
              y: z.y + z.h / 2 - 8,
              w: 16,
              h: 16,
              pulse: 0,
            });
          }

          state.zombies.splice(j, 1);
        }
      }

      // Sync data to state hooks
      if (p1) {
        setP1Stats({
          score: Math.floor(p1.score),
          hp: Math.max(Math.ceil(p1.hp), 0),
          weapon: WEAPONS[p1.weaponTier as keyof typeof WEAPONS].name,
          ammo: p1.ammo,
          weaponsOwned: { ...p1.weaponsOwned },
          ammos: { ...p1.ammos },
        });
      }
      if (p2) {
        setP2Stats({
          score: Math.floor(p2.score),
          hp: Math.max(Math.ceil(p2.hp), 0),
          weapon: WEAPONS[p2.weaponTier as keyof typeof WEAPONS].name,
          ammo: p2.ammo,
          active: true,
          weaponsOwned: { ...p2.weaponsOwned },
          ammos: { ...p2.ammos },
        });
      }

      // --- 8. RENDERING THE STAGE ---
      ctx.clearRect(0, 0, 900, 670);

      // Floor grid tiles
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(0, 0, 900, 670);

      // 1. Scene Optimization: Center Industrial Hazard Zone with Warning Stripes
      ctx.save();
      ctx.strokeStyle = "rgba(234, 179, 8, 0.12)"; // Faint yellow lines
      ctx.lineWidth = 4;
      ctx.strokeRect(410, 295, 80, 80);
      // Warning caution stripes
      ctx.fillStyle = "rgba(234, 179, 8, 0.05)";
      for (let i = 0; i < 140; i += 16) {
        ctx.beginPath();
        ctx.moveTo(380 + i, 295);
        ctx.lineTo(380 + i + 10, 295);
        ctx.lineTo(380 + i - 10, 375);
        ctx.lineTo(380 + i - 20, 375);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2. Scene Optimization: Metal floor ventilation grates for industrial aesthetic
      const drawFloorGrate = (gx: number, gy: number) => {
        ctx.save();
        ctx.fillStyle = "#110e0c";
        ctx.fillRect(gx, gy, 40, 40);
        ctx.strokeStyle = "#27221f";
        ctx.lineWidth = 2;
        ctx.strokeRect(gx, gy, 40, 40);
        // Vertical slot bars inside the grate
        ctx.strokeStyle = "#1a1613";
        ctx.lineWidth = 1.5;
        for (let o = 6; o < 40; o += 7) {
          ctx.beginPath();
          ctx.moveTo(gx + o, gy + 4);
          ctx.lineTo(gx + o, gy + 36);
          ctx.stroke();
        }
        ctx.restore();
      };
      drawFloorGrate(120, 210);
      drawFloorGrate(740, 210);
      drawFloorGrate(120, 420);
      drawFloorGrate(740, 420);
      drawFloorGrate(430, 80);
      drawFloorGrate(430, 550);

      // Floor grid lines (ambient overlay)
      ctx.strokeStyle = "#2e2a24";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < 900; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 670);
        ctx.stroke();
      }
      for (let y = 0; y < 670; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(900, y);
        ctx.stroke();
      }

      // Permanent faint blood splatters underneath everything
      state.splatters.forEach((splatter) => {
        ctx.fillStyle = `rgba(153, 27, 27, ${splatter.alpha})`;
        ctx.beginPath();
        ctx.arc(splatter.x, splatter.y, splatter.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Scene Optimization: Dynamic Player Flashlights (Casting light onto the floor)
      const drawFlashlight = (p: Player) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.angle);
        
        // Golden flashlight cone gradient
        const lightCone = ctx.createRadialGradient(0, 0, 10, 150, 0, 180);
        lightCone.addColorStop(0, "rgba(253, 224, 71, 0.16)");
        lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.05)");
        lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");
        
        ctx.fillStyle = lightCone;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(220, -70);
        ctx.lineTo(220, 70);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      if (p1 && p1.hp > 0) drawFlashlight(p1);
      if (p2 && p2.hp > 0) drawFlashlight(p2);

      // 4. Scene Optimization: Dark Edge Vignette Shadow for dramatic bunker mood
      const vignette = ctx.createRadialGradient(450, 335, 320, 450, 335, 600);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, 900, 670);

      // Render Static Obstacles / Crates (Optimized 3D Steel Crates)
      OBSTACLES.forEach((obs) => {
        // Drop shadow for 3D depth
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(obs.x + 8, obs.y + 8, obs.w, obs.h);

        // Main steel block (slate-gray base)
        ctx.fillStyle = "#374151";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);

        // Light bevel highlight
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(obs.x + 2, obs.y + 2, obs.w - 4, obs.h - 4);

        // Dark inner core frame
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(obs.x + 5, obs.y + 5, obs.w - 10, obs.h - 10);

        // Crates diagonal metal reinforcement structures
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(obs.x + 6, obs.y + 6);
        ctx.lineTo(obs.x + obs.w - 6, obs.y + obs.h - 6);
        ctx.moveTo(obs.x + obs.w - 6, obs.y + 6);
        ctx.lineTo(obs.x + 6, obs.y + obs.h - 6);
        ctx.stroke();

        // Corner rivets
        ctx.fillStyle = "#9ca3af";
        const rivets = [
          { rx: obs.x + 9, ry: obs.y + 9 },
          { rx: obs.x + obs.w - 9, ry: obs.y + 9 },
          { rx: obs.x + 9, ry: obs.y + obs.h - 9 },
          { rx: obs.x + obs.w - 9, ry: obs.y + obs.h - 9 },
        ];
        rivets.forEach((riv) => {
          ctx.beginPath();
          ctx.arc(riv.rx, riv.ry, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Render Pulsing Ammo Box Powerups
      state.powerups.forEach((box) => {
        const pulseScale = 1 + Math.sin(box.pulse) * 0.15;
        const w = box.w * pulseScale;
        const h = box.h * pulseScale;

        // Glowing shadow
        ctx.fillStyle = "rgba(16, 185, 129, 0.4)";
        ctx.fillRect(box.x - (w - box.w)/2 - 3, box.y - (h - box.h)/2 - 3, w + 6, h + 6);

        // Core Ammo box
        ctx.fillStyle = "#10b981";
        ctx.fillRect(box.x - (w - box.w)/2, box.y - (h - box.h)/2, w, h);

        // Inner cross
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(box.x - (w - box.w)/2 + w/2 - 1, box.y - (h - box.h)/2 + 2, 2, h - 4);
        ctx.fillRect(box.x - (w - box.w)/2 + 2, box.y - (h - box.h)/2 + h/2 - 1, w - 4, 2);
      });

      // Render Zombies & Red Devil Bosses
      state.zombies.forEach((zombie) => {
        ctx.save();
        ctx.fillStyle = zombie.color;
        ctx.fillRect(zombie.x, zombie.y, zombie.w, zombie.h);

        // Glow outlines and special designs for Bosses
        if (zombie.type === "devil") {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(zombie.x - 2, zombie.y - 2, zombie.w + 4, zombie.h + 4);

          // Horns
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.moveTo(zombie.x, zombie.y);
          ctx.lineTo(zombie.x - 4, zombie.y - 7);
          ctx.lineTo(zombie.x + 6, zombie.y);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(zombie.x + zombie.w, zombie.y);
          ctx.lineTo(zombie.x + zombie.w + 4, zombie.y - 7);
          ctx.lineTo(zombie.x + zombie.w - 6, zombie.y);
          ctx.fill();

          // Angry yellow eyes
          ctx.fillStyle = "#eab308";
          ctx.fillRect(zombie.x + 6, zombie.y + 10, 4, 4);
          ctx.fillRect(zombie.x + zombie.w - 10, zombie.y + 10, 4, 4);

          // Devil Fireball Shoot Progress Bar above head
          const chargeRatio = Math.max((150 - zombie.shootTimer) / 105, 0);
          if (chargeRatio > 0 && chargeRatio < 1) {
            const barW = zombie.w;
            ctx.fillStyle = "#1e1b4b";
            ctx.fillRect(zombie.x, zombie.y - 10, barW, 4.5);
            ctx.fillStyle = "#f97316";
            ctx.fillRect(zombie.x, zombie.y - 10, barW * chargeRatio, 4.5);
          }
        } else if (zombie.type === "miniboss") {
          // Orange miniboss outline
          ctx.strokeStyle = "rgba(249, 115, 22, 0.85)";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(zombie.x - 2, zombie.y - 2, zombie.w + 4, zombie.h + 4);

          // Spikes on shoulders
          ctx.fillStyle = "#ea580c";
          ctx.beginPath();
          ctx.moveTo(zombie.x, zombie.y + 6);
          ctx.lineTo(zombie.x - 4, zombie.y + 2);
          ctx.lineTo(zombie.x, zombie.y + 12);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(zombie.x + zombie.w, zombie.y + 6);
          ctx.lineTo(zombie.x + zombie.w + 4, zombie.y + 2);
          ctx.lineTo(zombie.x + zombie.w, zombie.y + 12);
          ctx.fill();

          // Glowing orange eyes
          ctx.fillStyle = "#ffedd5";
          ctx.fillRect(zombie.x + 4, zombie.y + 8, 3.5, 3.5);
          ctx.fillRect(zombie.x + zombie.w - 7.5, zombie.y + 8, 3.5, 3.5);
        } else if (zombie.type === "megaboss") {
          // Giant Red Megaboss
          ctx.strokeStyle = "rgba(185, 28, 28, 0.95)";
          ctx.lineWidth = 3.5;
          ctx.strokeRect(zombie.x - 3, zombie.y - 3, zombie.w + 6, zombie.h + 6);

          // Spikes and armored plates
          ctx.fillStyle = "#7f1d1d";
          ctx.beginPath();
          ctx.moveTo(zombie.x, zombie.y + 10);
          ctx.lineTo(zombie.x - 7, zombie.y + 4);
          ctx.lineTo(zombie.x, zombie.y + 20);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(zombie.x + zombie.w, zombie.y + 10);
          ctx.lineTo(zombie.x + zombie.w + 7, zombie.y + 4);
          ctx.lineTo(zombie.x + zombie.w, zombie.y + 20);
          ctx.fill();

          // Massive yellow angry boss eyes
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(zombie.x + 8, zombie.y + 14, 6, 6);
          ctx.fillRect(zombie.x + zombie.w - 14, zombie.y + 14, 6, 6);

          // Big fangs
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(zombie.x + 15, zombie.y + 28);
          ctx.lineTo(zombie.x + 18, zombie.y + 34);
          ctx.lineTo(zombie.x + 21, zombie.y + 28);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(zombie.x + zombie.w - 15, zombie.y + 28);
          ctx.lineTo(zombie.x + zombie.w - 18, zombie.y + 34);
          ctx.lineTo(zombie.x + zombie.w - 21, zombie.y + 28);
          ctx.fill();

          // Cannon reload progress bar above megaboss head
          const chargeRatio = Math.max((180 - zombie.shootTimer) / 120, 0); // charges in last 120 frames
          if (chargeRatio > 0 && chargeRatio < 1) {
            const barW = zombie.w;
            ctx.fillStyle = "#311042";
            ctx.fillRect(zombie.x, zombie.y - 12, barW, 5.5);
            ctx.fillStyle = "#e11d48";
            ctx.fillRect(zombie.x, zombie.y - 12, barW * chargeRatio, 5.5);
          }
        } else {
          // Standard angry eyes
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(zombie.x + 3, zombie.y + 5, 3, 3);
          ctx.fillRect(zombie.x + zombie.w - 6, zombie.y + 5, 3, 3);
        }

        // Small green HP Bar if damaged
        if (zombie.hp < zombie.maxHp) {
          const hpRatio = zombie.hp / zombie.maxHp;
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(zombie.x, zombie.y - 4, zombie.w, 3);
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(zombie.x, zombie.y - 4, zombie.w * hpRatio, 3);
        }
        ctx.restore();
      });

      // Render Players (Optimized Visuals & Outlines)
      const drawPlayer = (p: Player, primaryColor: string) => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

        // 1. Draw smooth drop shadow on the floor (ignores rotation for stable light source)
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.beginPath();
        ctx.ellipse(3, 8, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rotate for direction facing
        ctx.rotate(p.angle);

        // 2. Dynamic weapon recoil calculation
        const recoil = p.cooldown > 0 ? Math.min(p.cooldown * 0.8, 6) : 0;

        // 3. Draw high-detail custom weapons
        if (p.weaponTier === 2) {
          // Uzi (Machine Gun)
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0 - recoil, -3.5, 17, 5); // main barrel
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(10 - recoil, 1, 3, 8);  // ammo magazine clip
          ctx.fillStyle = "#64748b";
          ctx.fillRect(14 - recoil, -3, 3, 2);  // metallic muzzle tip
        } else if (p.weaponTier === 3) {
          // Double-Barrel Shotgun
          ctx.fillStyle = "#78350f"; // wooden forend stock
          ctx.fillRect(-2 - recoil, -4, 8, 8);
          ctx.fillStyle = "#334155"; // top barrel
          ctx.fillRect(4 - recoil, -5, 14, 3.5);
          ctx.fillRect(4 - recoil, -1.5, 14, 3.5); // bottom barrel
        } else if (p.weaponTier === 4) {
          // Green Tactical Rocket Launcher Tube
          ctx.fillStyle = "#14532d"; // Dark green chamber
          ctx.fillRect(-4 - recoil, -6, 26, 12);
          // RPG Warhead Tip sticking out
          ctx.fillStyle = "#eab308"; // Golden yellow explosive head
          ctx.beginPath();
          ctx.moveTo(22 - recoil, 0);
          ctx.lineTo(16 - recoil, -5);
          ctx.lineTo(16 - recoil, 5);
          ctx.closePath();
          ctx.fill();
          // Iron exhaust expansion at the back
          ctx.fillStyle = "#374151";
          ctx.fillRect(-8 - recoil, -7, 4, 14);
        } else if (p.weaponTier === 5) {
          // Laser Rifle
          ctx.fillStyle = "#0f172a"; // slate chassis
          ctx.fillRect(-2 - recoil, -4, 20, 8);
          ctx.fillStyle = "#06b6d4"; // glowing neon cyan barrel
          ctx.fillRect(10 - recoil, -2, 10, 4);
          ctx.fillStyle = "#22d3ee"; // battery cell
          ctx.fillRect(2 - recoil, -5, 5, 2);
        } else if (p.weaponTier === 6) {
          // Heavy Cannon
          ctx.fillStyle = "#1e293b"; // heavy dark iron
          ctx.fillRect(-2 - recoil, -5, 22, 10);
          ctx.fillStyle = "#475569"; // reinforcing bands
          ctx.fillRect(4 - recoil, -6, 4, 12);
          ctx.fillRect(14 - recoil, -6, 4, 12);
        } else if (p.weaponTier === 7) {
          // Bouncy Grenade
          ctx.fillStyle = "#16a34a"; // green pineapple pineapple-style lobbing pin
          ctx.fillRect(2 - recoil, -4, 6, 8);
          ctx.fillStyle = "#4b5563"; // pin pull ring
          ctx.beginPath();
          ctx.arc(5 - recoil, -6, 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.weaponTier === 8) {
          // Air Strike Pointer
          ctx.fillStyle = "#0f172a"; // tactical sleek design
          ctx.fillRect(0 - recoil, -3, 14, 5);
          ctx.fillStyle = "#ef4444"; // red laser tip
          ctx.fillRect(12 - recoil, -2.5, 3, 3);
        } else {
          // Pistol
          ctx.fillStyle = "#475569"; // Slate gray body
          ctx.fillRect(2 - recoil, -3, 11, 4);
          ctx.fillStyle = "#64748b"; // metallic slide guide
          ctx.fillRect(2 - recoil, -3, 6, 2);
        }

        // 4. Draw detailed hands gripping the weapon
        ctx.fillStyle = primaryColor;
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 1;
        // Left hand holding gun fore-end
        ctx.beginPath();
        ctx.arc(6 - recoil, -7, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Right hand holding trigger handle
        ctx.beginPath();
        ctx.arc(3 - recoil, 7, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 5. Draw Player main body (with rounded corners and black border outline)
        ctx.fillStyle = p.damageFlash > 0 && Math.floor(Date.now() / 50) % 2 === 0 ? "#ef4444" : primaryColor;
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-p.w / 2, -p.h / 2, p.w, p.h, 4);
        ctx.fill();
        ctx.stroke();

        // 6. Draw tactical helmets/apparel on head
        if (p.id === 1) {
          // Player 1: Commando Bandana
          ctx.fillStyle = "#ef4444"; // Red bandana
          ctx.fillRect(-10, -10, 20, 3.5);
          // Bandana tails fluttering in the wind
          ctx.beginPath();
          ctx.moveTo(-10, -8);
          ctx.lineTo(-15, -6);
          ctx.lineTo(-13, -11);
          ctx.closePath();
          ctx.fill();
        } else {
          // Player 2: Tactical SWAT Helmet & Blue Glossy Visor
          ctx.fillStyle = "#0f172a"; // Deep black helmet
          ctx.fillRect(-10, -10, 20, 5);
          ctx.fillStyle = "#3b82f6"; // Blue glowing tactical visor
          ctx.fillRect(-7, -5, 14, 2.5);
        }

        // 7. Dual expressive tactical eyes
        ctx.fillStyle = "#010409";
        ctx.fillRect(2, -5.5, 3.5, 2.5);
        ctx.fillRect(2, 3, 3.5, 2.5);

        // 8. Draw dynamic explosive muzzle flash when shooting
        if (p.muzzleFlash > 0) {
          ctx.save();
          let barrelLen = 11;
          if (p.weaponTier === 2) barrelLen = 17;
          else if (p.weaponTier === 3) barrelLen = 18;
          else if (p.weaponTier === 4) barrelLen = 22;
          else if (p.weaponTier === 5) barrelLen = 20;
          else if (p.weaponTier === 6) barrelLen = 22;
          else if (p.weaponTier === 7) barrelLen = 8;
          else if (p.weaponTier === 8) barrelLen = 14;

          ctx.translate(barrelLen - recoil, 0);

          // Outer orange flare burst
          ctx.fillStyle = "#f97316";
          ctx.beginPath();
          ctx.arc(0, 0, 8 + Math.random() * 5, 0, Math.PI * 2);
          ctx.fill();

          // Inner white-hot plasma core
          ctx.fillStyle = "#fffbeb";
          ctx.beginPath();
          ctx.arc(0, 0, 4 + Math.random() * 3, 0, Math.PI * 2);
          ctx.fill();

          // Light flash lines
          ctx.strokeStyle = "#fb923c";
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 4; i++) {
            const sparkAngle = (i * Math.PI) / 2 + (Math.random() - 0.5) * 0.35;
            const sparkLen = 12 + Math.random() * 8;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(sparkAngle) * sparkLen, Math.sin(sparkAngle) * sparkLen);
            ctx.stroke();
          }
          ctx.restore();
        }

        ctx.restore();
      };

      if (p1 && p1.hp > 0) drawPlayer(p1, "#fbbf24"); // yellow
      if (p2 && p2.hp > 0) drawPlayer(p2, "#3b82f6"); // blue

      // Flashing warning lamps in four corners (Bunker Alert Scene)
      const drawCornerLamp = (lx: number, ly: number) => {
        ctx.save();
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(lx, ly, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const glow = 0.5 + Math.sin(Date.now() / 150) * 0.5;
        ctx.fillStyle = `rgba(249, 115, 22, ${0.4 + glow * 0.6})`;
        ctx.beginPath();
        ctx.arc(lx, ly, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(249, 115, 22, ${glow * 0.3})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(lx, ly, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };
      drawCornerLamp(15, 15);
      drawCornerLamp(885, 15);
      drawCornerLamp(15, 655);
      drawCornerLamp(885, 655);

      // Render Active Spawning Lanes Arrows Indicators
      if (state.zombies.length > 0 && state.spawnDirections && state.spawnDirections.length > 0) {
        ctx.save();
        ctx.fillStyle = "rgba(239, 68, 68, 0.12)";
        ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
        ctx.lineWidth = 2;
        
        const blink = Math.floor(Date.now() / 200) % 2 === 0;

        state.spawnDirections.forEach((dir) => {
          if (dir === "top") {
            ctx.fillRect(0, 0, 900, 15);
            if (blink) {
              ctx.fillStyle = "#ef4444";
              ctx.font = "bold 9px monospace";
              ctx.textAlign = "center";
              ctx.fillText("▲ ENEMY INGRESS ACTIVE ▲", 450, 11);
            }
          } else if (dir === "bottom") {
            ctx.fillRect(0, 655, 900, 15);
            if (blink) {
              ctx.fillStyle = "#ef4444";
              ctx.font = "bold 9px monospace";
              ctx.textAlign = "center";
              ctx.fillText("▼ ENEMY INGRESS ACTIVE ▼", 450, 664);
            }
          } else if (dir === "left") {
            ctx.fillRect(0, 0, 15, 670);
            if (blink) {
              ctx.save();
              ctx.translate(11, 335);
              ctx.rotate(-Math.PI / 2);
              ctx.fillStyle = "#ef4444";
              ctx.font = "bold 9px monospace";
              ctx.textAlign = "center";
              ctx.fillText("▲ ENEMY INGRESS ACTIVE ▲", 0, 0);
              ctx.restore();
            }
          } else if (dir === "right") {
            ctx.fillRect(885, 0, 15, 670);
            if (blink) {
              ctx.save();
              ctx.translate(889, 335);
              ctx.rotate(Math.PI / 2);
              ctx.fillStyle = "#ef4444";
              ctx.font = "bold 9px monospace";
              ctx.textAlign = "center";
              ctx.fillText("▲ ENEMY INGRESS ACTIVE ▲", 0, 0);
              ctx.restore();
            }
          }
        });
        ctx.restore();
      }

      // Render standard bullets, lasers, and heavy cannonballs
      state.bullets.forEach((b) => {
        if (b.isLaser) {
          ctx.save();
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 1.5, b.y - b.vy * 1.5);
          ctx.stroke();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 0.8, b.y - b.vy * 0.8);
          ctx.stroke();
          ctx.restore();
        } else if (b.isCannon) {
          ctx.save();
          ctx.fillStyle = "#374151";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#111827";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = "#ea580c";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.w / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (b.isRocket) {
          ctx.fillStyle = "#a1a1aa";
          ctx.fillRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(b.x - b.w/2 - 4, b.y - 1, 3, 2);
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Grenades
      state.grenades.forEach((g) => {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.arc(g.x + 2, g.y + 4, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#16a34a";
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const flash = Math.floor(g.fuse / 6) % 2 === 0;
        ctx.fillStyle = flash ? "#ef4444" : "#ea580c";
        ctx.beginPath();
        ctx.arc(g.x, g.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Air Strikes targets
      state.airstrikes.forEach((ast) => {
        ctx.save();
        const alpha = 0.35 + Math.sin(Date.now() / 80) * 0.15;
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.arc(ast.targetX, ast.targetY, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(ast.targetX - 50, ast.targetY);
        ctx.lineTo(ast.targetX + 50, ast.targetY);
        ctx.moveTo(ast.targetX, ast.targetY - 50);
        ctx.lineTo(ast.targetX, ast.targetY + 50);
        ctx.stroke();

        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3.5;
        const angle = (Date.now() / 250) % (Math.PI * 2);
        ctx.beginPath();
        ctx.arc(ast.targetX, ast.targetY, 40, angle, angle + Math.PI / 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ast.targetX, ast.targetY, 40, angle + Math.PI, angle + 5 * Math.PI / 4);
        ctx.stroke();

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(ast.targetX, ast.targetY, 4, 0, Math.PI * 2);
        ctx.fill();

        if (ast.timer > 0) {
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          const sec = (ast.timer / 60).toFixed(1);
          ctx.fillText(`AIR_STRIKE: ${sec}S`, ast.targetX, ast.targetY - 56);
        }
        ctx.restore();
      });

      // Render Boss Cannonballs
      state.bossCannonballs.forEach((c) => {
        ctx.save();
        ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
        ctx.beginPath();
        ctx.arc(c.x - c.vx * 1.2, c.y - c.vy * 1.2, c.w * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#ffedd5";
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.w / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Health Packs
      state.healthPacks.forEach((hpPack) => {
        ctx.save();
        const pulse = 1 + Math.sin(hpPack.pulse) * 0.12;
        const w = hpPack.w * pulse;
        const h = hpPack.h * pulse;

        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillRect(hpPack.x - (w - hpPack.w)/2 - 4, hpPack.y - (h - hpPack.h)/2 - 4, w + 8, h + 8);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(hpPack.x - (w - hpPack.w)/2, hpPack.y - (h - hpPack.h)/2, w, h);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(hpPack.x - (w - hpPack.w)/2, hpPack.y - (h - hpPack.h)/2, w, h);

        ctx.fillStyle = "#ef4444";
        const cx = hpPack.x + hpPack.w / 2;
        const cy = hpPack.y + hpPack.h / 2;
        ctx.fillRect(cx - 2, cy - h/2 + 4, 4, h - 8);
        ctx.fillRect(cx - w/2 + 4, cy - 2, w - 8, 4);

        ctx.fillStyle = "#4b5563";
        ctx.fillRect(hpPack.x + hpPack.w/2 - 4, hpPack.y - (h - hpPack.h)/2 - 3, 8, 3);
        ctx.restore();
      });

      // Render Devil Fireballs
      state.fireballs.forEach((f) => {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.w / 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = "#ffedd5";
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.w / 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.restore();
      });

      // Render Rocket Explosions shockwaves
      state.explosions.forEach((exp) => {
        ctx.save();
        const ratio = exp.currentFrame / exp.totalFrames;
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - ratio})`;
        ctx.lineWidth = 4 * (1 - ratio);
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(249, 115, 22, ${0.4 * (1 - ratio)})`;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Floating Combat Text indicators
      state.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // Render Full-Width Wave Banner text overlay
      if (state.waveState === "banner") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 240, 900, 150);

        ctx.font = "800 48px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.fillText(`WAVE ${state.wave}`, 450, 310);

        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#d4d4d8";
        ctx.fillText("ZOMBIES ARE APPROACHING... FIGHT!", 450, 350);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4 selection:bg-red-600 selection:text-white">
      {/* Top Main Panel Header */}
      <div className="w-full max-w-[900px] mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-700 text-white p-2 rounded border border-red-500 shadow-md flex items-center justify-center">
            <Skull className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-red-500 font-mono uppercase">
              Zombie Crisis
            </h1>
            <p className="text-xs text-slate-400">
              A 2D top-down co-op shooter tribute to Boxhead: 2Play Rooms
            </p>
          </div>
        </div>

        {/* Audio / Info Control panel */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              soundEnabled
                ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 hover:bg-emerald-900/50"
                : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
            }`}
            title={soundEnabled ? "Mute SFX" : "Unmute SFX"}
            id="btn-sound-toggle"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Game Stage Wrapper */}
      <div className="relative border-4 border-slate-800 rounded-xl overflow-hidden bg-zinc-900 shadow-2xl">
        {/* State 1: Start Main Selection Menu */}
        {gameState === "menu" && (
          <div
            className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-20 p-6"
            id="start-menu"
          >
            <div className="text-center max-w-lg">
              <span className="text-xs bg-red-950/80 text-red-400 border border-red-900 font-mono px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                v1.2 Stable Arcade Build
              </span>
              <h1 className="text-6xl font-black tracking-tighter text-red-600 font-mono drop-shadow-[0_4px_12px_rgba(239,68,68,0.2)] mb-4">
                ZOMBIE CRISIS
              </h1>
              <p className="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
                Survive endless waves of pixelated zombies. Grab powerups, upgrade your weapons, and blast boss devils to shreds!
              </p>

              {/* Game Mode Pickers */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => startGame(false)}
                  className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-black px-6 py-4 rounded-xl border border-yellow-400 transition-all flex flex-col items-center gap-2 cursor-pointer shadow-[0_4px_10px_rgba(251,191,36,0.2)]"
                  id="btn-1p"
                >
                  <Gamepad2 className="w-6 h-6" />
                  <span className="text-base uppercase tracking-wider">1 Player</span>
                  <span className="text-[10px] font-normal text-amber-950">Keyboard + Mouse</span>
                </button>

                <button
                  onClick={() => startGame(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-4 rounded-xl border border-blue-400 transition-all flex flex-col items-center gap-2 cursor-pointer shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                  id="btn-2p"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-base uppercase tracking-wider">2P Co-op</span>
                  <span className="text-[10px] font-normal text-blue-100">Same Keyboard</span>
                </button>
              </div>

              {/* Detailed Keyboard Layout Controls */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 className="text-yellow-400 font-bold mb-2 uppercase flex items-center gap-1 font-mono">
                    <span className="inline-block w-2.5 h-2.5 bg-yellow-400 rounded-sm"></span> Player 1
                  </h3>
                  <ul className="space-y-1.5 text-slate-300 font-mono">
                    <li><b className="text-slate-100">Move:</b> W, A, S, D</li>
                    <li><b className="text-slate-100">Aim:</b> Mouse Pointer</li>
                    <li><b className="text-slate-100">Shoot:</b> Left Click / Space</li>
                  </ul>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <h3 className="text-blue-400 font-bold mb-2 uppercase flex items-center gap-1 font-mono">
                    <span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-sm"></span> Player 2
                  </h3>
                  <ul className="space-y-1.5 text-slate-300 font-mono">
                    <li><b className="text-slate-100">Move:</b> Arrow Keys</li>
                    <li><b className="text-slate-100">Aim:</b> Last Move Direction</li>
                    <li><b className="text-slate-100">Shoot:</b> Enter Key</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Game Over Dashboard Screen */}
        {gameState === "gameover" && (
          <div
            className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center z-20 p-6 animate-fade-in"
            id="gameover-menu"
          >
            <div className="text-center max-w-md bg-slate-950 border-2 border-red-800 p-8 rounded-2xl shadow-2xl">
              <Skull className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-5xl font-black text-red-500 font-mono uppercase mb-1">
                Game Over
              </h2>
              <p className="text-slate-400 text-sm mb-6">Both players have perished in the horde</p>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 space-y-3 text-left">
                <div className="flex justify-between items-center text-sm font-mono border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Survival Wave reached:</span>
                  <span className="text-red-400 font-black text-lg">{waveNum}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-yellow-400 font-bold">Player 1 Score:</span>
                  <span className="font-bold">{p1Stats.score}</span>
                </div>
                {isCoop && (
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-blue-400 font-bold">Player 2 Score:</span>
                    <span className="font-bold">{p2Stats.score}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => startGame(isCoop)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-6 rounded-xl border border-red-500 transition-all cursor-pointer shadow-lg hover:shadow-red-900/50 flex items-center justify-center gap-2 uppercase tracking-wide"
                  id="btn-restart"
                >
                  <RotateCcw className="w-5 h-5" />
                  Restart Arena
                </button>
                <p className="text-[10px] text-slate-500 font-mono">Or press &quot;R&quot; key to quick restart</p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic HUD Overlay Bar at top of Screen */}
        {gameState === "playing" && (
          <div className="absolute top-0 left-0 right-0 h-16 bg-slate-950/90 border-b border-slate-800 backdrop-blur px-4 flex items-center justify-between select-none z-10 font-mono text-xs">
            {/* Wave HUD element */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Horde State</span>
              <span className="text-red-500 font-black text-lg">WAVE {waveNum}</span>
            </div>

            {/* Player 1 HUD */}
            {p1Stats.hp > 0 ? (
              <div className="flex items-center gap-3 bg-yellow-950/20 border border-yellow-500/20 p-2 rounded-lg">
                <div className="w-2.5 h-10 bg-yellow-400 rounded-sm"></div>
                <div className="flex flex-col w-36">
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-yellow-400">PLAYER 1</span>
                    <span className="text-slate-300">{p1Stats.score}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-100"
                      style={{ width: `${p1Stats.hp}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 leading-none">
                    <span>{p1Stats.hp} HP</span>
                    <span className="text-yellow-300 flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 inline" /> {p1Stats.weapon} {p1Stats.weapon !== "Pistol" && `(${p1Stats.ammo})`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/60 p-2 rounded-lg text-[10px] text-red-400 w-44 font-bold uppercase">
                <Skull className="w-4 h-4 text-red-500" /> P1 DECEASED
              </div>
            )}

            {/* Player 2 HUD */}
            {isCoop && (
              p2Stats.hp > 0 ? (
                <div className="flex items-center gap-3 bg-blue-950/20 border border-blue-500/20 p-2 rounded-lg">
                  <div className="w-2.5 h-10 bg-blue-500 rounded-sm"></div>
                  <div className="flex flex-col w-36">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-blue-400">PLAYER 2</span>
                      <span className="text-slate-300">{p2Stats.score}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full bg-blue-500 transition-all duration-100"
                        style={{ width: `${p2Stats.hp}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 leading-none">
                      <span>{p2Stats.hp} HP</span>
                      <span className="text-blue-300 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5 inline" /> {p2Stats.weapon} {p2Stats.weapon !== "Pistol" && `(${p2Stats.ammo})`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/60 p-2 rounded-lg text-[10px] text-red-400 w-44 font-bold uppercase">
                  <Skull className="w-4 h-4 text-red-500" /> P2 DECEASED
                </div>
              )
            )}
          </div>
        )}

        {/* Core Game Loop Canvas */}
        <canvas
          ref={canvasRef}
          width={900}
          height={670}
          className="block max-w-full aspect-[900/670] object-contain cursor-crosshair bg-stone-900"
          id="game-canvas"
        />

        {/* Dynamic Weapons Dock HUD at Bottom of Screen */}
        {gameState === "playing" && (
          <div className="bg-slate-950 border-t border-slate-800 p-3.5 select-none font-mono text-xs flex flex-col gap-3">
            {/* Player 1 Hotbar */}
            {p1Stats.hp > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    Player 1 Armory <span className="text-slate-500 font-normal text-[10px] normal-case ml-1">(Press Q/E or digits 1-9, 0 to select)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{p1Stats.weapon} Equipped</span>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
                  {Object.entries(WEAPONS).map(([tierStr, spec]) => {
                    const tier = parseInt(tierStr, 10);
                    const isOwned = p1Stats.weaponsOwned[tier];
                    const isActive = p1Stats.weapon === spec.name;
                    const ammoVal = p1Stats.ammos[tier];
                    const maxAmmo = spec.maxAmmo;
                    
                    return (
                      <div
                        key={`p1-w-${tier}`}
                        className={`p-1.5 rounded-lg border text-center flex flex-col justify-between transition-all duration-150 ${
                          isActive
                            ? "bg-amber-950/40 border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.25)] scale-[1.03] z-10"
                            : isOwned
                            ? "bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800"
                            : "bg-slate-950/40 border-slate-950 text-slate-600 opacity-40"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[8px] font-bold text-slate-500">
                          <span>SLOT {tier === 10 ? 0 : tier}</span>
                          {!isOwned && <span>🔒</span>}
                        </div>
                        <div className="font-bold text-[10px] truncate leading-tight my-0.5">{spec.name}</div>
                        <div className={`text-[9px] font-black ${isActive ? "text-amber-400" : isOwned ? "text-slate-400" : "text-slate-700"}`}>
                          {tier === 1 ? "∞" : isOwned ? `${ammoVal}/${maxAmmo}` : `0/${maxAmmo}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Player 2 Hotbar */}
            {isCoop && p2Stats.hp > 0 && (
              <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Player 2 Armory <span className="text-slate-500 font-normal text-[10px] normal-case ml-1">(Press &quot;,&quot; / &quot;.&quot; to cycle)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{p2Stats.weapon} Equipped</span>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
                  {Object.entries(WEAPONS).map(([tierStr, spec]) => {
                    const tier = parseInt(tierStr, 10);
                    const isOwned = p2Stats.weaponsOwned[tier];
                    const isActive = p2Stats.weapon === spec.name;
                    const ammoVal = p2Stats.ammos[tier];
                    const maxAmmo = spec.maxAmmo;
                    
                    return (
                      <div
                        key={`p2-w-${tier}`}
                        className={`p-1.5 rounded-lg border text-center flex flex-col justify-between transition-all duration-150 ${
                          isActive
                            ? "bg-blue-950/40 border-blue-400 text-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.25)] scale-[1.03] z-10"
                            : isOwned
                            ? "bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800"
                            : "bg-slate-950/40 border-slate-950 text-slate-600 opacity-40"
                        }`}
                      >
                        <div className="flex justify-between items-center text-[8px] font-bold text-slate-500">
                          <span>SLOT {tier === 10 ? 0 : tier}</span>
                          {!isOwned && <span>🔒</span>}
                        </div>
                        <div className="font-bold text-[10px] truncate leading-tight my-0.5">{spec.name}</div>
                        <div className={`text-[9px] font-black ${isActive ? "text-blue-400" : isOwned ? "text-slate-400" : "text-slate-700"}`}>
                          {tier === 1 ? "∞" : isOwned ? `${ammoVal}/${maxAmmo}` : `0/${maxAmmo}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* General Controls Reference Footer */}
      <div className="mt-4 text-center text-xs text-slate-500 max-w-[900px] flex items-center gap-1.5 justify-center leading-relaxed">
        <Shield className="w-4 h-4 text-slate-400" />
        <span>
          Avoid contact damage from green zombies. Red Boss Devils appear in <b>Wave 3+</b>, shooting fast red fireballs that pass through crates! Collect ammo boxes to unlock high-tier firearms.
        </span>
      </div>
    </div>
  );
}
