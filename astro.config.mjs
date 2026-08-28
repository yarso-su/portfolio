// @ts-check
import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

import tailwindcss from '@tailwindcss/vite'

// todo: Set "site"

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.PROD ? 'https://yarso.dev' : 'http://localhost:4321',

  adapter: cloudflare({
    sessionKVBindingName: 'RATE_LIMIT'
  }),

  output: 'static',

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
      }),
      DESTINATION_EMAIL: envField.string({
        context: 'server',
        access: 'public',
        optional: false
      })
    }
  }
})
