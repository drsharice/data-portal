import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⬅️ change "data-portal" to *your* repo name
export default defineConfig({
  plugins: [react()],
  base: "/data-portal/",
});
