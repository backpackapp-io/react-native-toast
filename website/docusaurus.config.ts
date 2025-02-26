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
      appId: 'EUH7S3OU5L',

      apiKey: '9e23f541ed9dd307b8bd9c9edc9c95f7',

      indexName: 'backpackapp',
    },
  },
};

export default config;
