import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const localRouterShim=process.env.USE_ROUTER_SHIM==='1';
export default defineConfig({
  plugins:[react()],
  resolve:localRouterShim?{alias:{'react-router-dom':path.join(root,'src/routerShim.jsx'),'@shop/shared':path.resolve(root,'../../packages/shared/src/index.js')}}:undefined,
  server:{port:5173}
});
