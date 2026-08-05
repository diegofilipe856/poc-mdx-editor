import { describe, expect, it } from 'vitest'
import { MAX_MARKDOWN_FILE_SIZE_BYTES } from '../constants/editor'
import { readLocalMarkdownFile, validateMarkdownFile } from './localMarkdownFile'

describe('validateMarkdownFile', () => {
  it.each(['documento.md', 'documento.markdown'])(
    'aceita a extensão de Markdown: %s',
    (name) => {
      expect(() => validateMarkdownFile({ name, size: 100 })).not.toThrow()
    },
  )

  it('bloqueia extensões não autorizadas', () => {
    expect(() => validateMarkdownFile({ name: 'documento.html', size: 100 })).toThrow(
      'extensão .md ou .markdown',
    )
  })

  it('bloqueia arquivos maiores que 8 MB', () => {
    expect(() =>
      validateMarkdownFile({
        name: 'documento.md',
        size: MAX_MARKDOWN_FILE_SIZE_BYTES + 1,
      }),
    ).toThrow('no máximo 8 MB')
  })
})

describe('readLocalMarkdownFile', () => {
  it('lê UTF-8 e remove o BOM inicial', async () => {
    const file = new File(['\uFEFF# Documento'], 'documento.md')

    await expect(readLocalMarkdownFile(file)).resolves.toBe('# Documento')
  })

  it('bloqueia conteúdo binário', async () => {
    const file = new File(['texto\0binário'], 'documento.md')

    await expect(readLocalMarkdownFile(file)).rejects.toThrow('dados binários')
  })

  it('bloqueia bytes que não formam UTF-8 válido', async () => {
    const file = new File([new Uint8Array([0xc3, 0x28])], 'documento.md')

    await expect(readLocalMarkdownFile(file)).rejects.toThrow('codificado em UTF-8')
  })
})
