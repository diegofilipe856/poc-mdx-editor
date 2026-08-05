import remarkParse from 'remark-parse'
import { unified } from 'unified'

interface MarkdownNode {
  type: string
  url?: string
  children?: MarkdownNode[]
}

export type MarkdownValidationResult =
  | { ok: true }
  | { ok: false; error: string }

export function validateMarkdown(markdown: string): MarkdownValidationResult {
  let root: MarkdownNode

  try {
    root = unified().use(remarkParse).parse(markdown)
  } catch {
    return { ok: false, error: 'O Markdown possui sintaxe inválida.' }
  }

  return validateNode(root)
}

function validateNode(node: MarkdownNode): MarkdownValidationResult {
  if (node.type === 'html') {
    return { ok: false, error: 'HTML arbitrário não é permitido.' }
  }

  if (node.type === 'image' && node.url && !isSafeImageSource(node.url)) {
    return { ok: false, error: 'A imagem possui uma origem não permitida.' }
  }

  if ((node.type === 'link' || node.type === 'definition') && node.url && !isSafeLink(node.url)) {
    return { ok: false, error: 'O documento contém um link inseguro.' }
  }

  for (const child of node.children ?? []) {
    const childResult = validateNode(child)
    if (!childResult.ok) {
      return childResult
    }
  }

  return { ok: true }
}

function isSafeImageSource(source: string): boolean {
  if (/^data:image\/(?:gif|jpeg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(source)) {
    return true
  }

  return isRelativeUrl(source) || hasAllowedProtocol(source, ['https:'])
}

function isSafeLink(url: string): boolean {
  return (
    url.startsWith('#') ||
    isRelativeUrl(url) ||
    hasAllowedProtocol(url, ['https:', 'mailto:', 'tel:'])
  )
}

function hasAllowedProtocol(url: string, protocols: readonly string[]): boolean {
  try {
    return protocols.includes(new URL(url).protocol)
  } catch {
    return false
  }
}

function isRelativeUrl(url: string): boolean {
  return /^(?:\.\.?\/|\/)(?!\/)/.test(url) && !url.includes('\\')
}
