import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  ACCRETION_DISK_FRAGMENT,
  ACCRETION_DISK_VERTEX,
  ASTEROID_ROCK_FRAGMENT,
  ASTEROID_ROCK_VERTEX,
  COSMIC_POINTS_FRAGMENT,
  COSMIC_POINTS_VERTEX,
  HERO_STARS_FRAGMENT,
  HERO_STARS_VERTEX,
  HORIZON_FRAGMENT,
  HORIZON_VERTEX,
  LENSING_HALO_FRAGMENT,
  LENSING_HALO_VERTEX,
  METEOR_STREAK_FRAGMENT,
  METEOR_STREAK_VERTEX,
  NEBULA_CLOUD_FRAGMENT,
  NEBULA_CLOUD_VERTEX,
  NEBULA_SKY_FRAGMENT,
  NEBULA_SKY_VERTEX,
} from '../shaders/cosmicShaders';
import { CAMERA_PRESETS, type CameraFocusId, type CosmicTheme } from '../types/cosmic';

const _meteorPos = new THREE.Vector3();
const _meteorDir = new THREE.Vector3();
const _meteorToCam = new THREE.Vector3();
const _meteorSide = new THREE.Vector3();
const _meteorMat4 = new THREE.Matrix4();
const _beltDummy = new THREE.Object3D();

function buildCraggyAsteroidGeometry(seed: number, detail = 2): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, detail);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const nx = x / len;
    const ny = y / len;
    const nz = z / len;

    // Multi-frequency deterministic ridge + crater displacement
    const wave1 = Math.sin(nx * 3.1 + seed) * Math.cos(ny * 2.7 - seed * 0.7) * Math.sin(nz * 3.4 + seed * 1.3);
    const wave2 = Math.cos(nx * 6.3 - nz * 5.1 + seed * 2.1) * 0.45;
    const crater = Math.max(0, Math.sin(nx * 4.5 + ny * 4.2 + seed * 1.7)) * 0.3;
    const squashX = 1.0 + 0.18 * Math.sin(seed * 3.1);
    const squashY = 0.78 + 0.18 * Math.cos(seed * 2.4);
    const scale = 1.0 + wave1 * 0.24 + wave2 * 0.12 - crater * 0.16;

    pos.setXYZ(i, nx * scale * squashX, ny * scale * squashY, nz * scale);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

interface CosmicSceneProps {
  theme: CosmicTheme;
  cameraFocus: CameraFocusId;
  cameraTrigger: number;
  autoRotate: boolean;
  motionSpeed: number;
  glowIntensity: number;
  onUserInteract?: () => void;
}

interface ColorUniformMaterial {
  uniforms: Record<string, THREE.IUniform>;
}

function createStarTexturePoints(
  positions: Float32Array,
  sizes: Float32Array,
  phases: Float32Array,
  mixes: Float32Array,
  uniforms: {
    uTime: THREE.IUniform<number>;
    uPixelRatio: THREE.IUniform<number>;
    uPrimaryColor: THREE.IUniform<THREE.Color>;
    uSecondaryColor: THREE.IUniform<THREE.Color>;
    uCoreColor: THREE.IUniform<THREE.Color>;
    uStarTint: THREE.IUniform<THREE.Color>;
    uRainbowMix: THREE.IUniform<number>;
    uBaseAlpha: THREE.IUniform<number>;
  }
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aMix', new THREE.BufferAttribute(mixes, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: COSMIC_POINTS_VERTEX,
    fragmentShader: COSMIC_POINTS_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { points: new THREE.Points(geometry, material), geometry, material };
}

function buildSpiralGalaxy(
  starCount: number,
  radius: number,
  arms: number,
  spin: number,
  sharedUniforms: {
    uTime: THREE.IUniform<number>;
    uPixelRatio: THREE.IUniform<number>;
    uPrimaryColor: THREE.IUniform<THREE.Color>;
    uSecondaryColor: THREE.IUniform<THREE.Color>;
    uCoreColor: THREE.IUniform<THREE.Color>;
    uStarTint: THREE.IUniform<THREE.Color>;
    uRainbowMix: THREE.IUniform<number>;
    uBaseAlpha: THREE.IUniform<number>;
  }
) {
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const phases = new Float32Array(starCount);
  const mixes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const r = Math.pow(Math.random(), 1.4) * radius;
    const armIndex = i % arms;
    const baseAngle = (armIndex / arms) * Math.PI * 2;
    const spinAngle = r * spin;
    const scatter = (1.0 - r / (radius * 1.12)) * 0.55 + 0.18;

    const rx = (Math.random() - 0.5) * scatter * 1.15 * (0.35 + r * 0.12);
    const ry = (Math.random() - 0.5) * 0.45 * Math.exp(-r / (radius * 0.55));
    const rz = (Math.random() - 0.5) * scatter * 1.15 * (0.35 + r * 0.12);

    positions[i * 3] = Math.cos(baseAngle + spinAngle) * r + rx;
    positions[i * 3 + 1] = ry;
    positions[i * 3 + 2] = Math.sin(baseAngle + spinAngle) * r + rz;

    sizes[i] = 1.4 + Math.random() * 2.2 + (r < radius * 0.2 ? 1.1 : 0);
    phases[i] = Math.random();
    mixes[i] = Math.min(1, r / radius);
  }

  return createStarTexturePoints(positions, sizes, phases, mixes, sharedUniforms);
}

export const CosmicScene: React.FC<CosmicSceneProps> = ({
  theme,
  cameraFocus,
  cameraTrigger,
  autoRotate,
  motionSpeed,
  glowIntensity,
  onUserInteract,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const themeRef = useRef(theme);
  const autoRotateRef = useRef(autoRotate);
  const motionSpeedRef = useRef(motionSpeed);
  const glowIntensityRef = useRef(glowIntensity);
  const onUserInteractRef = useRef(onUserInteract);

  const cameraGoalRef = useRef<{
    active: boolean;
    position: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    position: new THREE.Vector3(0, 7.5, 25),
    target: new THREE.Vector3(0, 0.2, 0),
  });

  const targetColorsRef = useRef({
    primary: new THREE.Color(theme.primary),
    secondary: new THREE.Color(theme.secondary),
    deep: new THREE.Color(theme.deep),
    core: new THREE.Color(theme.core),
    voidCol: new THREE.Color(theme.voidColor),
    nebula: new THREE.Color(theme.nebulaTint),
    starTint: new THREE.Color(theme.starTint),
    rainbowMix: theme.isRainbow ? 1 : 0,
  });

  useEffect(() => {
    themeRef.current = theme;
    targetColorsRef.current.primary.set(theme.primary);
    targetColorsRef.current.secondary.set(theme.secondary);
    targetColorsRef.current.deep.set(theme.deep);
    targetColorsRef.current.core.set(theme.core);
    targetColorsRef.current.voidCol.set(theme.voidColor);
    targetColorsRef.current.nebula.set(theme.nebulaTint);
    targetColorsRef.current.starTint.set(theme.starTint);
    targetColorsRef.current.rainbowMix = theme.isRainbow ? 1 : 0;
  }, [theme]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    motionSpeedRef.current = motionSpeed;
  }, [motionSpeed]);

  useEffect(() => {
    glowIntensityRef.current = glowIntensity;
  }, [glowIntensity]);

  useEffect(() => {
    onUserInteractRef.current = onUserInteract;
  }, [onUserInteract]);

  useEffect(() => {
    const preset = CAMERA_PRESETS.find((p) => p.id === cameraFocus) ?? CAMERA_PRESETS[0];
    cameraGoalRef.current = {
      active: true,
      position: new THREE.Vector3(...preset.position),
      target: new THREE.Vector3(...preset.target),
    };
  }, [cameraFocus, cameraTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(themeRef.current.voidColor);
    scene.background = bgColor;

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 450);
    camera.position.set(0, 7.5, 25);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    let isSoftwareGl = false;
    try {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        const rendererStr = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
        isSoftwareGl = /swiftshader|llvmpipe|softpipe|mesa/i.test(rendererStr);
      }
    } catch {
      isSoftwareGl = false;
    }

    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 68;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.8;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 0.35;
    controls.target.set(0, 0.2, 0);

    const handleControlStart = () => {
      cameraGoalRef.current.active = false;
      onUserInteractRef.current?.();
    };
    controls.addEventListener('start', handleControlStart);

    // Live color uniforms lerped smoothly together
    const currentPrimary = new THREE.Color(themeRef.current.primary);
    const currentSecondary = new THREE.Color(themeRef.current.secondary);
    const currentDeep = new THREE.Color(themeRef.current.deep);
    const currentCore = new THREE.Color(themeRef.current.core);
    const currentVoid = new THREE.Color(themeRef.current.voidColor);
    const currentNebula = new THREE.Color(themeRef.current.nebulaTint);
    const currentStarTint = new THREE.Color(themeRef.current.starTint);
    let currentRainbowMix = themeRef.current.isRainbow ? 1 : 0;

    const uTime: THREE.IUniform<number> = { value: 0 };
    const uPixelRatio: THREE.IUniform<number> = { value: pixelRatio };
    const uPrimaryColor: THREE.IUniform<THREE.Color> = { value: currentPrimary };
    const uSecondaryColor: THREE.IUniform<THREE.Color> = { value: currentSecondary };
    const uDeepColor: THREE.IUniform<THREE.Color> = { value: currentDeep };
    const uCoreColor: THREE.IUniform<THREE.Color> = { value: currentCore };
    const uVoidColor: THREE.IUniform<THREE.Color> = { value: currentVoid };
    const uNebulaColor: THREE.IUniform<THREE.Color> = { value: currentNebula };
    const uStarTint: THREE.IUniform<THREE.Color> = { value: currentStarTint };
    const uRainbowMix: THREE.IUniform<number> = { value: currentRainbowMix };
    const uIntensity: THREE.IUniform<number> = { value: glowIntensityRef.current };

    const disposables: { dispose: () => void }[] = [];

    // 1. Calm Deep Nebula Sky Dome
    const skyGeo = new THREE.SphereGeometry(180, 42, 28);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: NEBULA_SKY_VERTEX,
      fragmentShader: NEBULA_SKY_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uDeepColor,
        uVoidColor,
        uNebulaColor,
        uRainbowMix,
        uIntensity,
      },
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);
    disposables.push(skyGeo, skyMat);

    // 2. Clean Gargantua-style Black Hole Assembly
    const blackHoleGroup = new THREE.Group();
    scene.add(blackHoleGroup);

    const horizonGeo = new THREE.SphereGeometry(1.95, 56, 56);
    const horizonMat = new THREE.ShaderMaterial({
      vertexShader: HORIZON_VERTEX,
      fragmentShader: HORIZON_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uRainbowMix,
      },
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    blackHoleGroup.add(horizonMesh);
    disposables.push(horizonGeo, horizonMat);

    const haloGeo = new THREE.PlaneGeometry(12.2, 12.2);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: LENSING_HALO_VERTEX,
      fragmentShader: LENSING_HALO_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uCoreColor,
        uRainbowMix,
        uIntensity,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    blackHoleGroup.add(haloMesh);
    disposables.push(haloGeo, haloMat);

    const diskGeo = new THREE.PlaneGeometry(16.2, 16.2);
    const diskMat = new THREE.ShaderMaterial({
      vertexShader: ACCRETION_DISK_VERTEX,
      fragmentShader: ACCRETION_DISK_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uDeepColor,
        uNebulaColor,
        uCoreColor,
        uRainbowMix,
        uIntensity,
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.rotation.x = Math.PI * 0.44;
    diskMesh.rotation.y = 0.22;
    blackHoleGroup.add(diskMesh);
    disposables.push(diskGeo, diskMat);

    // Subtle orbiting accretion motes (reduced & cleaner)
    const accretionCount = isSoftwareGl ? 320 : 750;
    const accPos = new Float32Array(accretionCount * 3);
    const accSize = new Float32Array(accretionCount);
    const accPhase = new Float32Array(accretionCount);
    const accMix = new Float32Array(accretionCount);
    for (let i = 0; i < accretionCount; i++) {
      const r = 2.4 + Math.pow(Math.random(), 1.45) * 5.6;
      const a = Math.random() * Math.PI * 2;
      accPos[i * 3] = Math.cos(a) * r;
      accPos[i * 3 + 1] = (Math.random() - 0.5) * 0.22 * Math.exp(-(r - 2.3) * 0.28);
      accPos[i * 3 + 2] = Math.sin(a) * r;
      accSize[i] = 1.1 + Math.random() * 1.9;
      accPhase[i] = Math.random();
      accMix[i] = Math.min(1, (r - 2.4) / 5.6);
    }
    const accPoints = createStarTexturePoints(accPos, accSize, accPhase, accMix, {
      uTime,
      uPixelRatio,
      uPrimaryColor,
      uSecondaryColor,
      uCoreColor,
      uStarTint,
      uRainbowMix,
      uBaseAlpha: { value: 0.72 },
    });
    accPoints.points.rotation.x = diskMesh.rotation.x - Math.PI / 2;
    accPoints.points.rotation.z = 0.22;
    blackHoleGroup.add(accPoints.points);
    disposables.push(accPoints.geometry, accPoints.material);

    // 3. Two Graceful Spiral Galaxies (cleaner framing, less clutter)
    const galaxyConfigs = [
      {
        pos: [-18, 6.5, -26] as const,
        rot: [0.62, 0.32, -0.32] as const,
        radius: 12,
        arms: 4,
        stars: isSoftwareGl ? 520 : 1350,
      },
      {
        pos: [21, -7.0, -34] as const,
        rot: [-0.48, -0.35, 0.38] as const,
        radius: 10,
        arms: 3,
        stars: isSoftwareGl ? 360 : 900,
      },
    ];

    const galaxyRotators: THREE.Group[] = [];
    const galaxyPointUniforms = {
      uTime,
      uPixelRatio,
      uPrimaryColor,
      uSecondaryColor,
      uCoreColor,
      uStarTint,
      uRainbowMix,
      uBaseAlpha: { value: 0.78 },
    };

    galaxyConfigs.forEach((cfg) => {
      const gGroup = new THREE.Group();
      gGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      gGroup.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);

      const spiral = buildSpiralGalaxy(
        cfg.stars,
        cfg.radius,
        cfg.arms,
        0.52,
        galaxyPointUniforms
      );
      gGroup.add(spiral.points);
      disposables.push(spiral.geometry, spiral.material);

      const coreGeo = new THREE.PlaneGeometry(5.5, 5.5);
      const coreMat = new THREE.ShaderMaterial({
        vertexShader: LENSING_HALO_VERTEX,
        fragmentShader: LENSING_HALO_FRAGMENT,
        uniforms: {
          uTime,
          uPrimaryColor,
          uSecondaryColor,
          uCoreColor,
          uRainbowMix,
          uIntensity,
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.rotation.x = -Math.PI / 2;
      gGroup.add(coreMesh);
      disposables.push(coreGeo, coreMat);

      scene.add(gGroup);
      galaxyRotators.push(gGroup);
    });

    // 4. Three Soft Distant Nebula Clouds (simplified atmospheric depth)
    const nebulaClouds: { mesh: THREE.Mesh; speed: number; baseOpacity: number }[] = [];
    const cloudDefs = [
      { pos: [12, 3.5, -20], scale: 22, seed: 1.7, opacity: 0.34 },
      { pos: [-16, -3.5, -24], scale: 24, seed: 4.3, opacity: 0.36 },
      { pos: [0, 10, -34], scale: 28, seed: 8.1, opacity: 0.28 },
    ];
    const cloudGeo = new THREE.PlaneGeometry(1, 1);
    disposables.push(cloudGeo);

    cloudDefs.forEach((def, idx) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: NEBULA_CLOUD_VERTEX,
        fragmentShader: NEBULA_CLOUD_FRAGMENT,
        uniforms: {
          uTime,
          uPrimaryColor,
          uSecondaryColor,
          uDeepColor,
          uNebulaColor,
          uRainbowMix,
          uSeed: { value: def.seed },
          uOpacity: { value: def.opacity },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(cloudGeo, mat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      mesh.scale.setScalar(def.scale);
      scene.add(mesh);
      disposables.push(mat);
      nebulaClouds.push({
        mesh,
        speed: (idx % 2 === 0 ? 1 : -1) * 0.025,
        baseOpacity: def.opacity,
      });
    });

    // 5. Crisp Calm Deep Space Starfield
    const starCount = isSoftwareGl ? 700 : 1450;
    const starPos = new Float32Array(starCount * 3);
    const starSize = new Float32Array(starCount);
    const starPhase = new Float32Array(starCount);
    const starMix = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = 22 + Math.random() * 115;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
      starSize[i] = 0.9 + Math.pow(Math.random(), 2.6) * 3.1;
      starPhase[i] = Math.random();
      starMix[i] = Math.random();
    }

    const starField = createStarTexturePoints(starPos, starSize, starPhase, starMix, {
      uTime,
      uPixelRatio,
      uPrimaryColor,
      uSecondaryColor,
      uCoreColor,
      uStarTint,
      uRainbowMix,
      uBaseAlpha: { value: 0.85 },
    });
    scene.add(starField.points);
    disposables.push(starField.geometry, starField.material);

    // 6. Bright Hero Diffraction Stars (4-point cross flares)
    const heroStarCount = isSoftwareGl ? 65 : 135;
    const heroPos = new Float32Array(heroStarCount * 3);
    const heroSize = new Float32Array(heroStarCount);
    const heroPhase = new Float32Array(heroStarCount);
    const heroMix = new Float32Array(heroStarCount);
    for (let i = 0; i < heroStarCount; i++) {
      const r = 28 + Math.random() * 98;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      heroPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      heroPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      heroPos[i * 3 + 2] = r * Math.cos(phi);
      heroSize[i] = 4.5 + Math.random() * 6.5;
      heroPhase[i] = Math.random();
      heroMix[i] = Math.random();
    }
    const heroGeo = new THREE.BufferGeometry();
    heroGeo.setAttribute('position', new THREE.BufferAttribute(heroPos, 3));
    heroGeo.setAttribute('aSize', new THREE.BufferAttribute(heroSize, 1));
    heroGeo.setAttribute('aPhase', new THREE.BufferAttribute(heroPhase, 1));
    heroGeo.setAttribute('aMix', new THREE.BufferAttribute(heroMix, 1));
    const heroMat = new THREE.ShaderMaterial({
      vertexShader: HERO_STARS_VERTEX,
      fragmentShader: HERO_STARS_FRAGMENT,
      uniforms: {
        uTime,
        uPixelRatio,
        uPrimaryColor,
        uSecondaryColor,
        uCoreColor,
        uStarTint,
        uRainbowMix,
        uIntensity,
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const heroStars = new THREE.Points(heroGeo, heroMat);
    scene.add(heroStars);
    disposables.push(heroGeo, heroMat);

    // 7. Shooting Stars / Meteors Pool (شهب متساقطة بذيول مضيئة)
    interface MeteorSlot {
      mesh: THREE.Mesh;
      mat: THREE.ShaderMaterial;
      start: THREE.Vector3;
      vel: THREE.Vector3;
      length: number;
      width: number;
      age: number;
      duration: number;
      cooldown: number;
    }
    const meteorCount = isSoftwareGl ? 6 : 10;
    const meteorRibbonGeo = new THREE.PlaneGeometry(1, 1);
    disposables.push(meteorRibbonGeo);
    const meteors: MeteorSlot[] = [];

    const respawnMeteor = (slot: MeteorSlot, initialDelay = false) => {
      const depth = -(18 + Math.random() * 52);
      const sx = (Math.random() - 0.5) * 78;
      const sy = 14 + Math.random() * 28;
      slot.start.set(sx, sy, depth);

      // Diagonal cosmic trajectory across the sky
      const dirX = (sx > 0 ? -1 : 1) * (0.65 + Math.random() * 0.75);
      const dirY = -(0.35 + Math.random() * 0.55);
      const dirZ = (Math.random() - 0.5) * 0.4;
      const speed = 26 + Math.random() * 24;
      slot.vel.set(dirX, dirY, dirZ).normalize().multiplyScalar(speed);

      slot.length = 8.5 + Math.random() * 8.5;
      slot.width = 0.38 + Math.random() * 0.34;
      slot.duration = 0.95 + Math.random() * 0.85;
      slot.age = initialDelay ? -(Math.random() * 4.2) : -(0.7 + Math.random() * 3.8);
      slot.cooldown = 0;
      slot.mat.uniforms.uStrength.value = 0.78 + Math.random() * 0.35;
    };

    for (let i = 0; i < meteorCount; i++) {
      const mMat = new THREE.ShaderMaterial({
        vertexShader: METEOR_STREAK_VERTEX,
        fragmentShader: METEOR_STREAK_FRAGMENT,
        uniforms: {
          uTime,
          uProgress: { value: 0 },
          uStrength: { value: 1 },
          uPrimaryColor,
          uSecondaryColor,
          uCoreColor,
          uRainbowMix,
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const mMesh = new THREE.Mesh(meteorRibbonGeo, mMat);
      mMesh.visible = false;
      scene.add(mMesh);
      disposables.push(mMat);

      const slot: MeteorSlot = {
        mesh: mMesh,
        mat: mMat,
        start: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        length: 11,
        width: 0.45,
        age: 0,
        duration: 1.2,
        cooldown: 0,
      };
      respawnMeteor(slot, true);
      // Have 2 shooting stars visible shortly after opening
      if (i < 2) slot.age = -0.15 * i;
      meteors.push(slot);
    }

    // 8. Craggy 3D Meteoroids & Asteroids Belt (نيازك وصخور فضائية ثلاثية الأبعاد)
    const rockGeometries = [
      buildCraggyAsteroidGeometry(1.3, 2),
      buildCraggyAsteroidGeometry(4.7, 2),
      buildCraggyAsteroidGeometry(8.9, 1),
    ];
    rockGeometries.forEach((g) => disposables.push(g));

    const coolAsteroidMat = new THREE.ShaderMaterial({
      vertexShader: ASTEROID_ROCK_VERTEX,
      fragmentShader: ASTEROID_ROCK_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uDeepColor,
        uCoreColor,
        uRainbowMix,
        uHotMix: { value: 0.08 },
      },
    });
    const hotMeteoroidMat = new THREE.ShaderMaterial({
      vertexShader: ASTEROID_ROCK_VERTEX,
      fragmentShader: ASTEROID_ROCK_FRAGMENT,
      uniforms: {
        uTime,
        uPrimaryColor,
        uSecondaryColor,
        uDeepColor,
        uCoreColor,
        uRainbowMix,
        uHotMix: { value: 0.85 },
      },
    });
    disposables.push(coolAsteroidMat, hotMeteoroidMat);

    interface HeroAsteroid {
      mesh: THREE.Mesh;
      radius: number;
      angle: number;
      orbitSpeed: number;
      tiltX: number;
      tiltZ: number;
      yOffset: number;
      rotSpeed: THREE.Vector3;
    }
    const heroAsteroids: HeroAsteroid[] = [];
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);

    const heroAsteroidCount = isSoftwareGl ? 10 : 18;
    for (let i = 0; i < heroAsteroidCount; i++) {
      const isHot = i % 4 === 0;
      const geo = rockGeometries[i % rockGeometries.length];
      const mesh = new THREE.Mesh(geo, isHot ? hotMeteoroidMat : coolAsteroidMat);
      const scale = isHot ? 0.36 + Math.random() * 0.32 : 0.24 + Math.random() * 0.44;
      mesh.scale.setScalar(scale);
      asteroidGroup.add(mesh);

      heroAsteroids.push({
        mesh,
        radius: 13.5 + (i / heroAsteroidCount) * 26 + Math.random() * 3.5,
        angle: (i / heroAsteroidCount) * Math.PI * 2 + Math.random() * 0.6,
        orbitSpeed: (0.03 + Math.random() * 0.055) * (i % 2 === 0 ? 1 : -0.7),
        tiltX: (Math.random() - 0.5) * 0.72,
        tiltZ: (Math.random() - 0.5) * 0.52,
        yOffset: (Math.random() - 0.5) * 9.5,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 0.85,
          (Math.random() - 0.5) * 0.55
        ),
      });
    }

    // Distant instanced rocky asteroid dust ring (140 tumbling pebbles)
    const beltCount = isSoftwareGl ? 60 : 140;
    const beltInstanced = new THREE.InstancedMesh(rockGeometries[2], coolAsteroidMat, beltCount);

    for (let i = 0; i < beltCount; i++) {
      const r = 19 + Math.random() * 31;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 8.5;
      const scale = 0.07 + Math.random() * 0.16;
      const rx = Math.random() * Math.PI;
      const ry = Math.random() * Math.PI;
      _beltDummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      _beltDummy.rotation.set(rx, ry, 0);
      _beltDummy.scale.setScalar(scale);
      _beltDummy.updateMatrix();
      beltInstanced.setMatrixAt(i, _beltDummy.matrix);
    }
    beltInstanced.instanceMatrix.needsUpdate = true;
    beltInstanced.computeBoundingSphere();
    beltInstanced.frustumCulled = false;
    beltInstanced.rotation.x = 0.24;
    beltInstanced.rotation.z = -0.18;
    scene.add(beltInstanced);
    disposables.push(beltInstanced);

    const intensityMaterials: ColorUniformMaterial[] = [skyMat, haloMat, diskMat, heroMat];

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    let rafId = 0;
    let lastTime = performance.now();
    let elapsedSim = 0;
    let frameThrottleAccumulator = 0;

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isSoftwareGl) {
        frameThrottleAccumulator += dt;
        if (frameThrottleAccumulator < 1 / 24) {
          return;
        }
        frameThrottleAccumulator = 0;
      }

      elapsedSim += dt * motionSpeedRef.current;
      uTime.value = elapsedSim;

      // Smooth color transitions across all space elements simultaneously
      const lerpAlpha = Math.min(1, dt * 4.5);
      currentPrimary.lerp(targetColorsRef.current.primary, lerpAlpha);
      currentSecondary.lerp(targetColorsRef.current.secondary, lerpAlpha);
      currentDeep.lerp(targetColorsRef.current.deep, lerpAlpha);
      currentCore.lerp(targetColorsRef.current.core, lerpAlpha);
      currentVoid.lerp(targetColorsRef.current.voidCol, lerpAlpha);
      currentNebula.lerp(targetColorsRef.current.nebula, lerpAlpha);
      currentStarTint.lerp(targetColorsRef.current.starTint, lerpAlpha);
      bgColor.copy(currentVoid);

      currentRainbowMix += (targetColorsRef.current.rainbowMix - currentRainbowMix) * lerpAlpha;
      uRainbowMix.value = currentRainbowMix;

      const targetIntensity = glowIntensityRef.current;
      uIntensity.value += (targetIntensity - uIntensity.value) * lerpAlpha;
      intensityMaterials.forEach((m) => {
        if (m.uniforms.uIntensity) m.uniforms.uIntensity.value = uIntensity.value;
      });

      // Gentle celestial motion
      accPoints.points.rotation.y += dt * 0.28 * motionSpeedRef.current;
      galaxyRotators.forEach((g, idx) => {
        g.children[0].rotation.y += dt * (0.036 + idx * 0.012) * motionSpeedRef.current;
      });
      starField.points.rotation.y += dt * 0.006 * motionSpeedRef.current;
      heroStars.rotation.y += dt * 0.008 * motionSpeedRef.current;

      // Animate Shooting Stars (Meteors)
      const simDt = dt * motionSpeedRef.current;
      for (let i = 0; i < meteors.length; i++) {
        const slot = meteors[i];
        slot.age += simDt;
        if (slot.age < 0) {
          slot.mesh.visible = false;
          continue;
        }
        if (slot.age >= slot.duration) {
          slot.mesh.visible = false;
          respawnMeteor(slot, false);
          continue;
        }

        const progress = slot.age / slot.duration;
        slot.mesh.visible = true;
        slot.mat.uniforms.uProgress.value = progress;

        // Current meteor center (shifted slightly behind head so ribbon stretches from tail to head)
        _meteorDir.copy(slot.vel).normalize();
        _meteorPos.copy(slot.start).addScaledVector(slot.vel, slot.age);
        _meteorPos.addScaledVector(_meteorDir, -slot.length * 0.5);

        // Build camera-facing ribbon basis aligned with meteor trajectory (zero allocations)
        _meteorToCam.subVectors(camera.position, _meteorPos).normalize();
        _meteorSide.crossVectors(_meteorDir, _meteorToCam);
        if (_meteorSide.lengthSq() < 1e-4) {
          _meteorSide.set(0, 1, 0).cross(_meteorDir);
        }
        _meteorSide.normalize();
        _meteorToCam.crossVectors(_meteorSide, _meteorDir).normalize();

        _meteorMat4.makeBasis(
          _meteorDir.multiplyScalar(slot.length),
          _meteorSide.multiplyScalar(slot.width),
          _meteorToCam
        );
        _meteorMat4.setPosition(_meteorPos);
        slot.mesh.matrixAutoUpdate = false;
        slot.mesh.matrix.copy(_meteorMat4);
      }

      // Animate Hero 3D Meteoroids & Asteroids
      for (let i = 0; i < heroAsteroids.length; i++) {
        const a = heroAsteroids[i];
        a.angle += simDt * a.orbitSpeed;
        const ax = Math.cos(a.angle) * a.radius;
        const az = Math.sin(a.angle) * a.radius;
        const ay =
          a.yOffset +
          Math.sin(a.angle + a.tiltX) * a.radius * 0.18 +
          Math.cos(a.angle * 0.7 + a.tiltZ) * 1.4;
        a.mesh.position.set(ax, ay, az);
        a.mesh.rotation.x += simDt * a.rotSpeed.x;
        a.mesh.rotation.y += simDt * a.rotSpeed.y;
        a.mesh.rotation.z += simDt * a.rotSpeed.z;
      }
      beltInstanced.rotation.y += simDt * 0.015;

      haloMesh.quaternion.copy(camera.quaternion);
      nebulaClouds.forEach((cloud) => {
        cloud.mesh.quaternion.copy(camera.quaternion);
        cloud.mesh.rotation.z += elapsedSim * cloud.speed * 0.04;
        const mat = cloud.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uOpacity.value = cloud.baseOpacity * Math.min(1.25, uIntensity.value);
      });

      if (cameraGoalRef.current.active) {
        camera.position.lerp(cameraGoalRef.current.position, Math.min(1, dt * 2.8));
        controls.target.lerp(cameraGoalRef.current.target, Math.min(1, dt * 3.2));
        if (
          camera.position.distanceTo(cameraGoalRef.current.position) < 0.08 &&
          controls.target.distanceTo(cameraGoalRef.current.target) < 0.08
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.autoRotate = autoRotateRef.current;
      controls.autoRotateSpeed = 0.35 * motionSpeedRef.current;
      controls.update();

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleControlStart);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0"
      aria-label="خلفية الفضاء ثلاثية الأبعاد"
    />
  );
};
