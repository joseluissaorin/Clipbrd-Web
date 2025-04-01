// scripts/run-fix-licenses.js
// This allows the script to be run directly with Node.js
require('dotenv').config();
require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: [
    ['module-resolver', {
      root: ['.'],
      alias: {
        '@': '.'
      }
    }]
  ]
});

// Import and run the fix script
require('./fix-licenses.js');