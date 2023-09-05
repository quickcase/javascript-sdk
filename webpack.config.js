import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
};
