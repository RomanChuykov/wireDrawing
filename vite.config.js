import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'My React PWA',
        short_name: 'ReactPWA',
        start_url: '/wireDrawing/', // ⚠️ важливо!
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',

        icons: [
          {
            src: '/wireDrawing/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/wireDrawing/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})