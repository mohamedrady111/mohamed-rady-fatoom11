import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, combined, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function renderCosmicIcon(size, maskablePadding = 0) {
  const buf = Buffer.alloc(size * size * 4);
  const scale = (1 - maskablePadding * 2) * (size / 512);
  const offset = size * maskablePadding;

  const beads = [
    [256, 106, 22],
    [341, 132, 20],
    [398, 202, 20],
    [406, 286, 20],
    [359, 358, 20],
    [282, 398, 20],
    [198, 390, 20],
    [130, 342, 20],
    [106, 256, 20],
    [132, 171, 20],
    [190, 118, 20],
  ];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size - 0.5) * 2;
      const ny = (y / size - 0.42) * 2;
      const distBg = Math.min(1, Math.hypot(nx, ny));
      let r = Math.round(77 * (1 - distBg) + 3 * distBg);
      let g = Math.round(10 * (1 - distBg) + 7 * distBg);
      let b = Math.round(55 * (1 - distBg) + 18 * distBg);

      const sx = (x - offset) / scale;
      const sy = (y - offset) / scale;

      const ringD = Math.abs(Math.hypot(sx - 256, sy - 256) - 150);
      if (ringD < 3.5) {
        const alpha = (1 - ringD / 3.5) * 0.45;
        r = Math.round(r * (1 - alpha) + 255 * alpha);
        g = Math.round(g * (1 - alpha) + 31 * alpha);
        b = Math.round(b * (1 - alpha) + 122 * alpha);
      }

      for (let i = 0; i < beads.length; i++) {
        const [bx, by, br] = beads[i];
        const d = Math.hypot(sx - bx, sy - by);
        if (d <= br) {
          const t = d / br;
          r = 255;
          g = Math.round(214 * (1 - t) + 31 * t);
          b = Math.round(234 * (1 - t) + 122 * t);
          break;
        }
      }

      const dOuter = Math.hypot(sx - 246, sy - 256);
      const dInner = Math.hypot(sx - 270, sy - 256);
      if (dOuter <= 60 && dInner >= 50) {
        r = 255;
        g = 214;
        b = 234;
      }

      const idx = (y * size + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    }
  }

  return encodePNG(size, size, buf);
}

const outDir = path.resolve('public');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), renderCosmicIcon(192, 0));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), renderCosmicIcon(512, 0));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), renderCosmicIcon(512, 0.14));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), renderCosmicIcon(180, 0.04));
console.log('Generated PWA PNG icons in public/');
