import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({ plugins: [react(), tailwindcss(), viteSingleFile()], define: { 'import.meta.env.VITE_HASH_ROUTER': JSON.stringify('1') }, build: { outDir: 'dist-apercu', assetsInlineLimit: 100_000_000, cssCodeSplit: false } });
