import { describe, expect, it } from 'vitest'
import { createHtmlDocument } from './documentExport'

describe('createHtmlDocument', () => {
  it('converte Markdown em um documento HTML', () => {
    const html = createHtmlDocument('# Título\n\n[site](https://example.com)')

    expect(html).toContain('<h1>Título</h1>')
    expect(html).toContain('<a href="https://example.com">site</a>')
  })

  it('escapa HTML informado no Markdown', () => {
    expect(createHtmlDocument('<script>alert(1)</script>')).not.toContain('<script>')
  })
})
