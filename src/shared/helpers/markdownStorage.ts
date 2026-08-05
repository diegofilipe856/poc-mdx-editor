import { EDITOR_STORAGE_KEY } from '../constants/editor'

export function loadMarkdown(): string | null {
  return window.localStorage.getItem(EDITOR_STORAGE_KEY)
}

export function saveMarkdown(markdown: string): void {
  window.localStorage.setItem(EDITOR_STORAGE_KEY, markdown)
}

export function removeSavedMarkdown(): void {
  window.localStorage.removeItem(EDITOR_STORAGE_KEY)
}
