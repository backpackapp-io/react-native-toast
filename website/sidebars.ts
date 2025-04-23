import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'index',
    'getting-started',
    {
      type: 'category',
      label: 'Components',
      items: ['components/toasts'],
    },
    {
      type: 'category',
      label: 'API',
      items: ['api/toast', 'api/use-toaster'],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/animations',
        'features/accessibility',
        'features/customization',
        'features/toast-handlers',
      ],
    },
  ],
};

export default sidebars;
