import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

function manualVendorChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;

  if (id.includes("@tiptap")) return "editor";
  if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) return "ui-vendor";
  if (id.includes("@tanstack")) return "tanstack";
  if (id.includes("@supabase")) return "supabase";
  if (id.includes("@ai-sdk") || id.includes("node_modules/ai/")) return "ai-chat";
  if (id.includes("recharts")) return "charts";
  if (id.includes("react") || id.includes("react-dom")) return "react-vendor";

  return "vendor";
}

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(),
    viteReact(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: manualVendorChunk,
      },
    },
  },
});
