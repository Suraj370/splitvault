import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom", // Ensure jsdom is set
    setupFiles: ["./vitest.setup.js"],
    globals: true,
    css: false,
    reporters: ["html"],
    outputFile: "./test/test-report.html",
  },
});
