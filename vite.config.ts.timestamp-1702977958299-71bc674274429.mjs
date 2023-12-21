// vite.config.ts
import path from "node:path";
import { defineConfig, loadEnv } from "file:///C:/Users/share/Desktop/SHHZ/P2P/follow-peer-link-market/node_modules/.pnpm/vite@4.5.0/node_modules/vite/dist/node/index.js";
import UnoCSS from "file:///C:/Users/share/Desktop/SHHZ/P2P/follow-peer-link-market/node_modules/.pnpm/unocss@0.57.3_postcss@8.4.31_vite@4.5.0/node_modules/unocss/dist/vite.mjs";
import basicSsl from "file:///C:/Users/share/Desktop/SHHZ/P2P/follow-peer-link-market/node_modules/.pnpm/@vitejs+plugin-basic-ssl@1.0.2_vite@4.5.0/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
import react from "file:///C:/Users/share/Desktop/SHHZ/P2P/follow-peer-link-market/node_modules/.pnpm/@vitejs+plugin-react@4.1.1_vite@4.5.0/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\share\\Desktop\\SHHZ\\P2P\\follow-peer-link-market";
var vite_config_default = ({ mode }) => {
  const root = process.cwd();
  const { VITE_BASE_URL } = loadEnv(mode, root);
  return defineConfig({
    base: "/",
    resolve: {
      alias: {
        "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    plugins: [UnoCSS(), basicSsl(), react()],
    server: {
      https: true,
      host: true,
      proxy: {
        "/api/": {
          target: VITE_BASE_URL,
          changeOrigin: true
        }
      }
    },
    build: {
      assetsDir: "assets"
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzaGFyZVxcXFxEZXNrdG9wXFxcXFNISFpcXFxcUDJQXFxcXGZvbGxvdy1wZWVyLWxpbmstbWFya2V0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzaGFyZVxcXFxEZXNrdG9wXFxcXFNISFpcXFxcUDJQXFxcXGZvbGxvdy1wZWVyLWxpbmstbWFya2V0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9zaGFyZS9EZXNrdG9wL1NISFovUDJQL2ZvbGxvdy1wZWVyLWxpbmstbWFya2V0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcbmltcG9ydCBiYXNpY1NzbCBmcm9tICdAdml0ZWpzL3BsdWdpbi1iYXNpYy1zc2wnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG4vcHJlZmVyLWdsb2JhbC9wcm9jZXNzXHJcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKClcclxuXHJcbiAgY29uc3QgeyBWSVRFX0JBU0VfVVJMIH0gPSBsb2FkRW52KG1vZGUsIHJvb3QpXHJcblxyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgYmFzZTogJy8nLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdALyc6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKX0vYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgcGx1Z2luczogW1Vub0NTUygpLCBiYXNpY1NzbCgpLCByZWFjdCgpXSxcclxuXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaHR0cHM6IHRydWUsXHJcbiAgICAgIGhvc3Q6IHRydWUsXHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgJy9hcGkvJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBWSVRFX0JBU0VfVVJMLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXHJcblxyXG4gICAgfSxcclxuXHJcbiAgfSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFXLE9BQU8sVUFBVTtBQUV0WCxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFlBQVk7QUFDbkIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sV0FBVztBQUxsQixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQTZCO0FBRWxELFFBQU0sT0FBTyxRQUFRLElBQUk7QUFFekIsUUFBTSxFQUFFLGNBQWMsSUFBSSxRQUFRLE1BQU0sSUFBSTtBQUU1QyxTQUFPLGFBQWE7QUFBQSxJQUNsQixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxNQUFNLEdBQUcsS0FBSyxRQUFRLGtDQUFXLEtBQUssQ0FBQztBQUFBLE1BQ3pDO0FBQUEsSUFDRjtBQUFBLElBRUEsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQUEsSUFFdkMsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUViO0FBQUEsRUFFRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
