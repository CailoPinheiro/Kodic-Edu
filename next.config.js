const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  webpack: (config) => {
    config.resolve.alias['@/backend'] = path.resolve(__dirname, 'backend');
    config.resolve.alias['@/frontend'] = path.resolve(__dirname, 'frontend');
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  }
};

module.exports = nextConfig;
