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
      swcOptions: {
        jsc: {
          target: 'es2017',
          parser: {
            syntax: 'typescript',
            decorators: true,
            dynamicImport: true
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true
          },
          keepClassNames: true,
          externalHelpers: true,
          loose: true
        },
        module: {
          type: 'es6'
        },
        sourceMaps: true,
        exclude: [
          '**/node_modules/@prisma/client/**',
          '**/node_modules/.prisma/**'
        ]
      }
    })
  ],
};
