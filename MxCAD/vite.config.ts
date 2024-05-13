import path from 'path'
import { defineConfig } from 'vite'
import jsx from "@vitejs/plugin-vue-jsx"
import vue from "@vitejs/plugin-vue"
export default ({ mode }) => {
  return defineConfig({
    optimizeDeps: {
      exclude: ['vue', 'mxcad', 'mxdraw']
    },
    build: {
      sourcemap:true,
      target: "es2015",
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'test',
        formats: ["iife"],
      },
      cssCodeSplit: true,
      rollupOptions: {
        external: ["vue", "mxcad", "mxdraw", "vue-i18n", 'pinia', 'vuetify', 'axios'],
        output: {
          globals: {
            vue: 'Vue',
            mxcad: "mxcad",
            mxdraw: "Mx",
            "vue-i18n": "VueI18n",
            "pinia": "pinia",
            "vuetify": "vuetify",
            "axios": "axios"
          },
          entryFileNames: 'test.js',
          chunkFileNames: 'test.js',
          assetFileNames: 'test.[ext]',

        },
      },

      outDir: "../dist/plugins",
      minify: mode !== "debug",
    },
    define: {
      __VUE_PROD_DEVTOOLS__: mode !== "debug",
    },
    plugins: [vue(), jsx()]
  })
}
