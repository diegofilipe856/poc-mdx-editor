import { describe, expect, it } from 'vitest'
import { createHtmlDocument } from './documentExport'

describe('createHtmlDocument', () => {
  it('converte Markdown em um documento HTML', () => {
    const html = createHtmlDocument('# Título\n\n[site](https://example.com)')

    expect(html).toContain('<h1>Título</h1>')
    expect(html).toContain('<a href="https://example.com">site</a>')
  })

  it('preserva HTML informado no Markdown na POC', () => {
    expect(createHtmlDocument('<img src="data:image/png;base64,abc" alt="Logo" />')).toContain(
      '<img src="data:image/png;base64,abc" alt="Logo" />',
    )
  })
})
