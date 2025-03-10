import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'React Native Toast',
  tagline: 'Powerful toasts for React-Native',
  favicon: 'img/favicon.ico',

  url: 'https://nickdebaise.github.io',
  baseUrl: '/packages/react-native-toast/',
  projectName: 'react-native-toast',
  organizationName: 'backpackapp',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/backpackapp-io/react-native-toast/website',
        },
        theme: {
          customCss: './static/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'React Native Toast',
      logo: {
        alt: 'React Native Toast Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Get Started',
          to: '/',
        },
        {
          href: 'https://github.com/backpackapp-io/react-native-toast',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Backpack App. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      appId: 'JS3PODTEKQ',
      apiKey: 'a9b9bd8771557c6030f93d2cdad963fa',
      indexName: 'nickdebaiseio',
      contextualSearch: true,
      searchPagePath: 'search',
      externalUrlRegex:
        'https://nickdebaise.github.io/packages/react-native-toast/.*',
    },
  },
};

export default config;
