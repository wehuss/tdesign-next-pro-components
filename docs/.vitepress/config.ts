import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'TDesign Pro Components',
  description: 'Enhanced components based on TDesign Vue Next',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
      {
        text: 'GitHub',
        link: 'https://github.com/your-org/tdesign-pro-components',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/components/' },
            // { text: 'Pro Table', link: '/components/pro-table' },
            // { text: 'Pro Form', link: '/components/pro-form' },
            // { text: 'Pro Select', link: '/components/pro-select' }
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/your-org/tdesign-pro-components',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 TDesign Pro Components Team',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
})
