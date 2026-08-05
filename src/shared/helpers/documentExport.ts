import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export function markdownToHtml(markdown: string): string {
  return String(
    unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).processSync(markdown),
  )
}

export function createHtmlDocument(markdown: string): string {
  const body = markdownToHtml(markdown)
  return `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Documento Markdown</title>\n<style>body{font-family:system-ui,sans-serif;line-height:1.6;max-width:900px;margin:2rem auto;padding:0 1rem;color:#173047}img{max-width:100%;height:auto}</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`
}

export function downloadTextFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
