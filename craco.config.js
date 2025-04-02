module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        {
          module: /firebase\/.*\/dist\/esm\/index\.esm\.js/,
          message: /Failed to parse source map/,
        },
      ],
    },
  },
}; 