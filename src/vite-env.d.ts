/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALLOWED_EMBED_DOMAINS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
