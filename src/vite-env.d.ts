/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_AIRTABLE_PAT: string
  readonly VITE_AIRTABLE_BASE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
