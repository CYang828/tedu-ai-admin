import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// element-plus 按需导入，并使用自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()], 
  }),],
  resolve: {
    alias: {
      '@': resolve('./src')
    }
  },
  base: './', // 打包路径
  server:{
    open:false,
    port:3000,
    proxy:{
      "/apis":{
        target:"http://192.168.191.66:10999",
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/apis/,'')
      }
    }
  }
})
