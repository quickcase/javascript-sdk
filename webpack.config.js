import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    entry: './src/index.js',
    mode: 'production',
    output: {
      filename: 'main.js',
      path: resolve(__dirname, 'dist'),
      library: {
        name: 'QuickCaseSDK',
        type: 'umd',
      },
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env']
              ]
            }
          }
        }
      ],
    },
  },
  {
    entry: './src/index.js',
    mode: 'production',
    experiments: {
      outputModule: true,
    },
    output: {
      filename: 'main.mjs',
      path: resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
    },
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env']
              ]
            }
          }
        }
      ],
    },
  },
];
