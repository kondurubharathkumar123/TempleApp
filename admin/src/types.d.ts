interface ImportMetaEnv { readonly VITE_API_BASE_URL?: string }
interface ImportMeta { readonly env: ImportMetaEnv }
declare module '*.css';
declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): { render(children: unknown): void };
}
