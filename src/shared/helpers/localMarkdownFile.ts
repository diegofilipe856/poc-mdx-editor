import { MAX_MARKDOWN_FILE_SIZE_BYTES } from '../constants/editor'

const MARKDOWN_FILE_EXTENSION_PATTERN = /\.(?:md|markdown)$/i

export function validateMarkdownFile(
  file: Pick<File, 'name' | 'size'>,
): void {
  if (!MARKDOWN_FILE_EXTENSION_PATTERN.test(file.name)) {
    throw new Error('Selecione um arquivo com extensão .md ou .markdown.')
  }

  if (file.size > MAX_MARKDOWN_FILE_SIZE_BYTES) {
    throw new Error('O arquivo Markdown deve ter no máximo 8 MB.')
  }
}

export async function readLocalMarkdownFile(file: File): Promise<string> {
  validateMarkdownFile(file)

  let markdown: string
  try {
    const bytes = await file.arrayBuffer()
    markdown = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new Error('O arquivo precisa estar codificado em UTF-8.')
  }

  if (markdown.includes('\0')) {
    throw new Error('O arquivo contém dados binários e não pode ser aberto.')
  }

  return markdown.replace(/^\uFEFF/, '')
}
