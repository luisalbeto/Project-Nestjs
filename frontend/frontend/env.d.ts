/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string; // Define aquí todas las variables que usas
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  