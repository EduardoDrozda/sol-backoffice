const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      '@api': join(__dirname, 'src/api'),
      '@infrastructure': join(__dirname, 'src/infrastructure'),
      '@application': join(__dirname, 'src/application'),
      '@domain': join(__dirname, 'src/domain'),
      '@common': join(__dirname, 'src/common'),
    },
  },
  externals: {
    'express': 'commonjs express',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    })
  ],
};
