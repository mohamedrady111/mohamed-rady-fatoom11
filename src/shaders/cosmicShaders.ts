const GLSL_NOISE_HELPERS = /* glsl */ `
vec3 hueToRgb(float h) {
  float r = abs(h * 6.0 - 3.0) - 1.0;
  float g = 2.0 - abs(h * 6.0 - 2.0);
  float b = 2.0 - abs(h * 6.0 - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3D(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash31(i + vec3(0, 0, 0)), hash31(i + vec3(1, 0, 0)), f.x),
      mix(hash31(i + vec3(0, 1, 0)), hash31(i + vec3(1, 1, 0)), f.x),
      f.y
    ),
    mix(
      mix(hash31(i + vec3(0, 0, 1)), hash31(i + vec3(1, 0, 1)), f.x),
      mix(hash31(i + vec3(0, 1, 1)), hash31(i + vec3(1, 1, 1)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm3D(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise3D(p);
    p = p * 2.02 + vec3(1.7, 5.2, 3.3);
    a *= 0.5;
  }
  return v;
}
`;

export const NEBULA_SKY_VERTEX = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const NEBULA_SKY_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uDeepColor;
uniform vec3 uVoidColor;
uniform vec3 uNebulaColor;
uniform float uRainbowMix;
uniform float uIntensity;

${GLSL_NOISE_HELPERS}

void main() {
  vec3 dir = normalize(vDir);
  float mist = fbm3D(dir * 2.1 + vec3(uTime * 0.008, -uTime * 0.006, 0.0));
  float wisps = fbm3D(dir * 3.8 - vec3(uTime * 0.01, uTime * 0.007, 0.0));

  // Gentle diagonal Milky Way band instead of heavy clutter
  float tiltCoord = dir.y * 0.85 + dir.x * 0.38;
  float band = exp(-pow(tiltCoord * 2.3 + (mist - 0.5) * 0.55, 2.0));

  // Synchronized harmonious cosmic hue when Rainbow mode is active
  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = mix(hueToRgb(syncHue), vec3(0.95), 0.15);
  vec3 rbNebula = mix(hueToRgb(fract(syncHue + 0.12)), vec3(0.1), 0.25);
  vec3 rbDeep = rbPrimary * 0.24;

  vec3 primaryCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 nebulaCol = mix(uNebulaColor, rbNebula, uRainbowMix);
  vec3 deepCol = mix(uDeepColor, rbDeep, uRainbowMix);

  vec3 col = uVoidColor;
  col += deepCol * (0.25 + 0.55 * mist) * (0.45 + 0.55 * band) * uIntensity;
  col += nebulaCol * pow(mist, 1.8) * band * 0.34 * uIntensity;
  col += primaryCol * pow(wisps, 2.8) * band * 0.22 * uIntensity;
  col += uSecondaryColor * pow(max(0.0, mist * wisps), 3.2) * band * 0.18 * uIntensity;

  gl_FragColor = vec4(col, 1.0);
}
`;

export const HORIZON_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

export const HORIZON_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform float uRainbowMix;

${GLSL_NOISE_HELPERS}

void main() {
  float ndv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
  float rim = pow(1.0 - ndv, 4.4);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.09)), vec3(1.0), 0.35);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);
  vec3 rimCol = mix(pCol, sCol, rim);

  vec3 col = rimCol * rim * 1.45;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const LENSING_HALO_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv * 2.0 - 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const LENSING_HALO_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uCoreColor;
uniform float uRainbowMix;
uniform float uIntensity;

${GLSL_NOISE_HELPERS}

void main() {
  float r = length(vUv);
  if (r > 1.0) discard;

  float angle = atan(vUv.y, vUv.x);
  float photonRing = exp(-pow((r - 0.34) * 20.0, 2.0));
  float outerAura = exp(-max(0.0, r - 0.31) * 5.2) * smoothstep(0.28, 0.34, r);
  float shimmer = 0.90 + 0.10 * sin(angle * 4.0 - uTime * 1.8);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbCore = mix(hueToRgb(fract(syncHue + 0.07)), vec3(1.0), 0.65);

  vec3 cPrimary = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 cCore = mix(uCoreColor, rbCore, uRainbowMix);

  vec3 col = cCore * photonRing * 1.08 * shimmer + cPrimary * outerAura * 0.56 * uIntensity;
  float alpha = clamp((photonRing * 0.88 + outerAura * 0.55) * smoothstep(1.0, 0.65, r), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

export const ACCRETION_DISK_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv * 2.0 - 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ACCRETION_DISK_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uDeepColor;
uniform vec3 uNebulaColor;
uniform vec3 uCoreColor;
uniform float uRainbowMix;
uniform float uIntensity;

${GLSL_NOISE_HELPERS}

void main() {
  float r = length(vUv);
  if (r < 0.23 || r > 1.0) discard;

  float theta = atan(vUv.y, vUv.x);
  float swirl = theta + 9.0 / (r + 0.18) - uTime * 1.15;
  float n = fbm3D(vec3(cos(swirl) * 1.8, sin(swirl) * 1.8, r * 5.2 - uTime * 0.38));
  float bands = 0.6 + 0.4 * sin(r * 22.0 - uTime * 1.9 + n * 3.2);

  float radialMask = smoothstep(0.23, 0.31, r) * smoothstep(1.0, 0.44, r);
  float innerHeat = exp(-(r - 0.24) * 6.8);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.09)), vec3(1.0), 0.35);
  vec3 rbNebula = hueToRgb(fract(syncHue + 0.14)) * 0.72;
  vec3 rbDeep = rbPrimary * 0.32;
  vec3 rbCore = mix(rbSecondary, vec3(1.0), 0.75);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);
  vec3 nCol = mix(uNebulaColor, rbNebula, uRainbowMix);
  vec3 dCol = mix(uDeepColor, rbDeep, uRainbowMix);
  vec3 cCol = mix(uCoreColor, rbCore, uRainbowMix);

  vec3 col = mix(dCol, nCol, smoothstep(0.2, 0.7, n));
  col = mix(col, pCol, smoothstep(0.42, 0.85, bands * n));
  col = mix(col, sCol, smoothstep(0.72, 0.98, bands));
  col = mix(col, cCol, clamp(innerHeat * 1.05, 0.0, 1.0));

  float alpha = radialMask * (0.3 + 0.6 * n * bands) * uIntensity;
  gl_FragColor = vec4(col * (0.82 + innerHeat * 0.75) * uIntensity, clamp(alpha, 0.0, 0.9));
}
`;

export const NEBULA_CLOUD_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv * 2.0 - 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const NEBULA_CLOUD_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uDeepColor;
uniform vec3 uNebulaColor;
uniform float uRainbowMix;
uniform float uSeed;
uniform float uOpacity;

${GLSL_NOISE_HELPERS}

void main() {
  float r = length(vUv);
  if (r > 1.0) discard;

  float n = fbm3D(vec3(vUv * 1.8, uSeed + uTime * 0.025));
  float falloff = exp(-r * r * 3.4) * smoothstep(1.0, 0.35, r);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbNebula = hueToRgb(fract(syncHue + 0.11));
  vec3 rbDeep = rbPrimary * 0.28;

  vec3 dCol = mix(uDeepColor, rbDeep, uRainbowMix);
  vec3 nCol = mix(uNebulaColor, rbNebula, uRainbowMix);
  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);

  vec3 col = mix(dCol, nCol, smoothstep(0.25, 0.72, n));
  col = mix(col, mix(pCol, uSecondaryColor, 0.35), smoothstep(0.65, 0.95, n) * 0.55);

  float alpha = falloff * smoothstep(0.18, 0.85, n) * uOpacity;
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
}
`;

export const COSMIC_POINTS_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aMix;
varying float vPhase;
varying float vMix;
uniform float uTime;
uniform float uPixelRatio;

void main() {
  vPhase = aPhase;
  vMix = aMix;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  float twinkle = 0.82 + 0.18 * sin(uTime * 1.8 + aPhase * 22.0);
  gl_PointSize = clamp(aSize * twinkle * uPixelRatio * (86.0 / max(1.0, -mvPos.z)), 1.0, 22.0);
  gl_Position = projectionMatrix * mvPos;
}
`;

export const COSMIC_POINTS_FRAGMENT = /* glsl */ `
precision highp float;
varying float vPhase;
varying float vMix;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uCoreColor;
uniform vec3 uStarTint;
uniform float uRainbowMix;
uniform float uBaseAlpha;

${GLSL_NOISE_HELPERS}

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = length(p);
  if (d > 1.0) discard;

  float core = exp(-d * d * 6.0);

  // Synchronized cosmic harmony (no random per-star rainbow confetti!)
  float syncHue = fract(uTime * 0.045 + vMix * 0.08);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.1)), vec3(1.0), 0.45);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);

  // Crisp luminous starlight tinted gently to fit the space palette
  vec3 accentCol = mix(pCol, sCol, smoothstep(0.15, 0.9, vMix));
  vec3 starCol = mix(uStarTint, accentCol, 0.38 + 0.45 * smoothstep(0.65, 1.0, vPhase));
  vec3 col = mix(starCol, uCoreColor, core * 0.55);

  gl_FragColor = vec4(col, core * uBaseAlpha);
}
`;

export const HERO_STARS_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aMix;
varying float vPhase;
varying float vMix;
varying float vTwinkle;
uniform float uTime;
uniform float uPixelRatio;

void main() {
  vPhase = aPhase;
  vMix = aMix;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vTwinkle = 0.72 + 0.28 * sin(uTime * 1.55 + aPhase * 31.415);
  gl_PointSize = clamp(aSize * (0.85 + 0.22 * vTwinkle) * uPixelRatio * (105.0 / max(1.0, -mvPos.z)), 8.0, 46.0);
  gl_Position = projectionMatrix * mvPos;
}
`;

export const HERO_STARS_FRAGMENT = /* glsl */ `
precision highp float;
varying float vPhase;
varying float vMix;
varying float vTwinkle;
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uCoreColor;
uniform vec3 uStarTint;
uniform float uRainbowMix;
uniform float uIntensity;

${GLSL_NOISE_HELPERS}

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;

  // Delicate 4-point diffraction cross rays + crisp star core
  float angle = vPhase * 1.57;
  float cs = cos(angle);
  float sn = sin(angle);
  vec2 rp = vec2(p.x * cs - p.y * sn, p.x * sn + p.y * cs);

  float rayH = exp(-abs(rp.y) * 14.0) * exp(-abs(rp.x) * 3.1);
  float rayV = exp(-abs(rp.x) * 14.0) * exp(-abs(rp.y) * 3.1);
  float core = exp(-r * r * 14.0);
  float halo = exp(-r * r * 3.8) * 0.42;

  float shape = core + (rayH + rayV) * 0.72 + halo;

  float syncHue = fract(uTime * 0.045 + vMix * 0.07);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.1)), vec3(1.0), 0.45);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);
  vec3 accent = mix(pCol, sCol, vMix);
  vec3 col = mix(uStarTint, accent, 0.48);
  col = mix(col, uCoreColor, clamp(core * 0.9, 0.0, 1.0));

  float alpha = clamp(shape * vTwinkle * (0.75 + 0.25 * uIntensity), 0.0, 1.0);
  gl_FragColor = vec4(col * (0.9 + core * 0.45), alpha);
}
`;

export const METEOR_STREAK_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const METEOR_STREAK_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProgress;
uniform float uStrength;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uCoreColor;
uniform float uRainbowMix;

${GLSL_NOISE_HELPERS}

void main() {
  // vUv.x = 0 (tail end) -> 1 (meteor head)
  // vUv.y = 0..1 across ribbon thickness
  float crossDist = abs(vUv.y - 0.5) * 2.0;

  // Head is sharper/brighter, tail flares gently and fades smoothly
  float widthProfile = mix(0.22, 0.85, pow(vUv.x, 1.6));
  float coreTube = exp(-pow(crossDist / max(0.08, widthProfile * 0.55), 2.0));
  float outerGlow = exp(-pow(crossDist / max(0.15, widthProfile), 2.0)) * 0.55;

  float longitudinal = smoothstep(0.0, 0.82, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
  float headHotspot = exp(-pow((vUv.x - 0.92) * 14.0, 2.0)) * exp(-crossDist * crossDist * 5.0);

  // Subtle plasma flicker along the tail
  float shimmer = 0.86 + 0.14 * sin(vUv.x * 22.0 - uTime * 28.0);
  float fadeLife = sin(clamp(uProgress, 0.0, 1.0) * 3.14159265);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.09)), vec3(1.0), 0.4);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);

  vec3 tailCol = mix(pCol, sCol, smoothstep(0.15, 0.85, vUv.x));
  vec3 col = mix(tailCol, uCoreColor, clamp(coreTube * vUv.x * 0.72 + headHotspot * 1.15, 0.0, 1.0));

  float alpha = (coreTube * longitudinal + outerGlow * longitudinal + headHotspot) * shimmer * fadeLife * uStrength;
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(col * 1.35, clamp(alpha, 0.0, 1.0));
}
`;

export const ASTEROID_ROCK_VERTEX = /* glsl */ `
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec3 vLocalPos;

void main() {
  vLocalPos = position;
  #ifdef USE_INSTANCING
    mat4 mvMat = modelViewMatrix * instanceMatrix;
    vNormalView = normalize(mat3(mvMat) * normal);
    vec4 mvPos = mvMat * vec4(position, 1.0);
  #else
    vNormalView = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  #endif
  vViewPos = -mvPos.xyz;
  gl_Position = projectionMatrix * mvPos;
}
`;

export const ASTEROID_ROCK_FRAGMENT = /* glsl */ `
precision highp float;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec3 vLocalPos;

uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform vec3 uDeepColor;
uniform vec3 uCoreColor;
uniform float uRainbowMix;
uniform float uHotMix;

${GLSL_NOISE_HELPERS}

void main() {
  vec3 n = normalize(vNormalView);
  vec3 v = normalize(vViewPos);

  // Dual cosmic lighting: bright black-hole key light + soft opposite nebula rim fill
  vec3 keyDir = normalize(vec3(0.45, 0.65, 0.62));
  vec3 fillDir = normalize(vec3(-0.7, -0.3, 0.35));

  float diffKey = max(dot(n, keyDir), 0.0);
  float diffFill = max(dot(n, fillDir), 0.0);
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 3.0);

  // Subtle mineral crater texture variation
  float rockGrain = fbm3D(vLocalPos * 4.5);
  vec3 baseStone = mix(vec3(0.08, 0.09, 0.13), vec3(0.24, 0.25, 0.32), rockGrain);

  float syncHue = fract(uTime * 0.045);
  vec3 rbPrimary = hueToRgb(syncHue);
  vec3 rbSecondary = mix(hueToRgb(fract(syncHue + 0.1)), vec3(1.0), 0.35);

  vec3 pCol = mix(uPrimaryColor, rbPrimary, uRainbowMix);
  vec3 sCol = mix(uSecondaryColor, rbSecondary, uRainbowMix);

  vec3 col = baseStone * (0.28 + diffKey * 0.85);
  col += mix(uDeepColor, pCol, 0.42) * diffFill * 0.38;
  col += mix(pCol, sCol, 0.55) * fresnel * (0.62 + uHotMix * 0.65);

  // Optional glowing magma / ionized leading seam on hero meteoroids
  float emberMask = smoothstep(0.66, 0.88, rockGrain) * uHotMix;
  col += mix(pCol, uCoreColor, 0.45) * emberMask * 0.9;

  gl_FragColor = vec4(col, 1.0);
}
`;

