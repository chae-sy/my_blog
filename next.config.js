module.exports = {
  images: {
    domains: ['www.notion.so', 'lh5.googleusercontent.com', 's3-us-west-2.amazonaws.com'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false, // Disable fs module for the frontend
      dns: false, // Disable dns module for the frontend
      net: false, // Disable net module for the frontend
      tls: false, // Disable tls module for the frontend
    };
    return config;
  },
};
