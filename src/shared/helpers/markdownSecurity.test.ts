import { describe, expect, it } from 'vitest'
import { validateMarkdown } from './markdownSecurity'

describe('validateMarkdown', () => {
  it('aceita Markdown comum e imagem HTTPS', () => {
    expect(validateMarkdown('# Título\n\n![GIF](https://cdn.example.com/demo.gif)')).toEqual({ ok: true })
  })

  it.each([
    '![imagem](javascript:alert(1))',
    '[clique](javascript:alert(1))',
  ])('bloqueia conteúdo não autorizado: %s', (markdown) => {
    expect(validateMarkdown(markdown).ok).toBe(false)
  })

  it('aceita HTML para uso na POC', () => {
    expect(validateMarkdown('<iframe src="https://example.com"></iframe>').ok).toBe(true)
  })
})
