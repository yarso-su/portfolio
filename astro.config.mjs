// @ts-check
import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD
    ? 'https://yarso.dev'
    : 'https://frontend.yarso.dev',

  output: 'static',

  adapter: cloudflare({
    platformProxy: {
      enabled: false
    },
    imageService: 'compile'
  }),

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['.yarso.dev']
    }
  },

  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false
      })
    }
  },

  devToolbar: {
    enabled: false
  }
})
