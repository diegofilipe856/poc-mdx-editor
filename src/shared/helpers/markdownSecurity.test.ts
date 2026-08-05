import { describe, expect, it } from 'vitest'
import { validateMarkdown } from './markdownSecurity'

describe('validateMarkdown', () => {
  it('aceita Markdown comum e imagem HTTPS', () => {
    expect(validateMarkdown('# Título\n\n![GIF](https://cdn.example.com/demo.gif)')).toEqual({ ok: true })
  })

  it.each([
    '<iframe src="https://example.com"></iframe>',
    '<script>alert(1)</script>',
    '![imagem](javascript:alert(1))',
    '[clique](javascript:alert(1))',
  ])('bloqueia conteúdo não autorizado: %s', (markdown) => {
    expect(validateMarkdown(markdown).ok).toBe(false)
  })
})
