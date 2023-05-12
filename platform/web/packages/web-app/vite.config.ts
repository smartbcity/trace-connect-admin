import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
//@ts-ignore
import checker from 'vite-plugin-checker';
// import fs from 'fs'

// const kotlinDir = '../../kotlin';

// function getKotlinPackages() {
//   return new Promise<string[]>((resolve, reject) => {
//     fs.readdir(kotlinDir, { withFileTypes: true }, (err, entries) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       const kotlinPackages = entries
//         .filter(entry => entry.isDirectory())
//         .map(entry => entry.name);

//       resolve(kotlinPackages);
//     });
//   });
// }

// https://vitejs.dev/config/
export default defineConfig(async () => {
  // const kotlinPackages = await getKotlinPackages()
  return {
    plugins: [
      react({
        //exclude stories 
        exclude: [/\.stories\.(t|j)sx?$/],
      }),
      checker({
        typescript: true
      }),
      tsconfigPaths(),
      svgr()
    ],
    optimizeDeps: {
      // include: kotlinPackages,
    },
    build: {
      commonjsOptions: {
        include: [
          /node_modules/,
          /kotlin/,
        ]
      }
    },
    //improve mui bundke size: https://mui.com/material-ui/guides/minimizing-bundle-size/
    babel: {
      babelrc: false,
      configFile: false,
      plugins: [
        // [
        //   'babel-plugin-import',
        //   {
        //     libraryName: '@mui/material',
        //     libraryDirectory: '',
        //     camel2DashComponentName: false,
        //   },
        //   'core',
        // ],
        // [
        //   'babel-plugin-import',
        //   {
        //     libraryName: '@mui/icons-material',
        //     libraryDirectory: '',
        //     camel2DashComponentName: false,
        //   },
        //   'icons',
        // ],
      ]
    }
  }
})
