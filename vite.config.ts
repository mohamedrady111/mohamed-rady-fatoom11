import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function directDownloadPlugin(): Plugin {
  return {
    name: 'direct-download-headers',
    configureServer(server) {
      const files: Record<string, { file: string; mime: string; downloadName: string }> = {
        '/tasbih-fatoum.apk': {
          file: path.resolve(__dirname, 'public', 'tasbih-fatoum.apk'),
          mime: 'application/vnd.android.package-archive',
          downloadName: 'tasbih-fatoum.apk',
        },
        '/tasbih-fatoum.html': {
          file: path.resolve(__dirname, 'public', 'tasbih-fatoum.html'),
          mime: 'text/html; charset=utf-8',
          downloadName: 'tasbih-fatoum.html',
        },
      };

      Object.entries(files).forEach(([route, cfg]) => {
        server.middlewares.use(route, (req, res, next) => {
          if (!fs.existsSync(cfg.file)) return next();
          const stat = fs.statSync(cfg.file);
          res.setHeader('Content-Type', cfg.mime);
          res.setHeader('Content-Disposition', `attachment; filename="${cfg.downloadName}"`);
          res.setHeader('Content-Length', String(stat.size));
          res.setHeader('Cache-Control', 'no-cache');
          if (req.method === 'HEAD') {
            res.statusCode = 200;
            res.end();
            return;
          }
          fs.createReadStream(cfg.file).pipe(res);
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      directDownloadPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: {
          id: '/',
          name: 'من محمد راضي لـ فطوم — السبحة الكونية',
          short_name: 'السبحة',
          description:
            'السبحة الإلكترونية الأسطورية مع فضاء كوني ثلاثي الأبعاد ونظام ألوان نيون وقوز قزح RGB.',
          theme_color: '#030712',
          background_color: '#030712',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          lang: 'ar',
          dir: 'rtl',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          globIgnores: ['**/*.apk', '**/tasbih-fatoum.html', '**/assets/aistudio/**'],
          navigateFallbackDenylist: [/\.apk$/i, /^\/tasbih-fatoum\.apk/i, /^\/tasbih-fatoum\.html/i],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
