/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
      serverActions: true
    }, 
    webpack: (
      config, options
    ) => {
      // Important: return the modified config
      config.module.rules.push({
        test: /\.node/,
        use: 'raw-loader',
      });
      config.resolve.alias.canvas = false
      config.resolve.alias.encoding = false
      return config;
    },
  };
  
  module.exports = nextConfig;