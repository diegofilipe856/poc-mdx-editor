import {
  lazy,
  Suspense,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
} from 'react'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import { INITIAL_MARKDOWN } from './shared/constants/editor'
import { readLocalMarkdownFile } from './shared/helpers/localMarkdownFile'
import {
  createHtmlDocument,
  downloadTextFile,
  markdownToHtml,
} from './shared/helpers/documentExport'
import { loadMarkdown } from './shared/helpers/markdownStorage'
import { validateMarkdown } from './shared/helpers/markdownSecurity'
import './styles/app.css'

const MarkdownEditor = lazy(() =>
  import('./components/MarkdownEditor/MarkdownEditor').then((module) => ({
    default: module.MarkdownEditor,
  })),
)

export function App() {
  const editorRef = useRef<MDXEditorMethods>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasUnsavedChangesRef = useRef(false)
  const [initialMarkdown] = useState(() => {
    try {
      const savedMarkdown = loadMarkdown()
      if (!savedMarkdown) {
        return INITIAL_MARKDOWN
      }

      return validateMarkdown(savedMarkdown).ok
        ? savedMarkdown
        : INITIAL_MARKDOWN
    } catch {
      return INITIAL_MARKDOWN
    }
  })
  const [status, setStatus] = useState('Documento pronto para edição.')
  const [readingHtml, setReadingHtml] = useState<string | null>(null)

  useEffect(() => {
    if (!readingHtml) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReadingHtml(null)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [readingHtml])

  const handleChange = useCallback((_markdown: string, initialNormalize: boolean) => {
    if (!initialNormalize) {
      hasUnsavedChangesRef.current = true
      setStatus('Há alterações ainda não salvas.')
    }
  }, [])

  const handleSaveLocal = () => {
    const markdown = editorRef.current?.getMarkdown() ?? ''
    const validation = validateMarkdown(markdown)

    if (!validation.ok) {
      setStatus(`Download bloqueado: ${validation.error}`)
      return
    }

    downloadTextFile(markdown, 'documento.md', 'text/markdown')
    setStatus('Arquivo Markdown baixado localmente.')
  }

  const handleExportHtml = () => {
    const markdown = editorRef.current?.getMarkdown() ?? ''
    const validation = validateMarkdown(markdown)

    if (!validation.ok) {
      setStatus(`Exportação bloqueada: ${validation.error}`)
      return
    }

    try {
      downloadTextFile(createHtmlDocument(markdown), 'documento.html', 'text/html')
      setStatus('Documento exportado como HTML.')
    } catch {
      setStatus('Não foi possível gerar o HTML deste documento.')
    }
  }

  const handleOpenReadingModal = () => {
    const markdown = editorRef.current?.getMarkdown() ?? ''
    const validation = validateMarkdown(markdown)

    if (!validation.ok) {
      setStatus(`Visualização bloqueada: ${validation.error}`)
      return
    }

    setReadingHtml(markdownToHtml(markdown))
  }

  const handleOpenFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]

    if (!file) {
      return
    }

    if (
      hasUnsavedChangesRef.current &&
      !window.confirm('Abrir outro arquivo e descartar as alterações não salvas?')
    ) {
      input.value = ''
      return
    }

    try {
      const markdown = await readLocalMarkdownFile(file)
      const validation = validateMarkdown(markdown)

      if (!validation.ok) {
        setStatus(`Abertura bloqueada: ${validation.error}`)
        return
      }

      if (!editorRef.current) {
        setStatus('Aguarde o editor terminar de carregar e tente novamente.')
        return
      }

      editorRef.current.setMarkdown(markdown)
      hasUnsavedChangesRef.current = false
      setStatus(`Arquivo local aberto: ${file.name}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível abrir o arquivo.'
      setStatus(`Abertura bloqueada: ${message}`)
    } finally {
      input.value = ''
    }
  }

  return (
    <main className="app-container">
      <header className="hero">
        <div>
          <p className="eyebrow">React + TypeScript + MDXEditor</p>
          <h1>POC de conteúdo rico e Markdown</h1>
          <p className="hero__description">
            Edição visual, fonte Markdown, imagens, persistência local e exportação de arquivos.
          </p>
        </div>
        <div className="security-badge">Modo POC: HTML permitido</div>
      </header>

      <section aria-label="Editor de conteúdo">
        <div className="document-actions">
          <div aria-live="polite" className="status-message">{status}</div>
          <div className="button-group">
            <input
              accept=".md,.markdown,text/markdown,text/plain"
              hidden
              onChange={(event) => void handleOpenFile(event)}
              ref={fileInputRef}
              type="file"
            />
            <button
              className="button button--ghost"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Abrir arquivo
            </button>
            <button className="button button--secondary" onClick={handleSaveLocal} type="button">
              Baixar Markdown
            </button>
            <button className="button button--primary" onClick={handleExportHtml} type="button">
              Exportar HTML
            </button>
            <button className="button button--reading" onClick={handleOpenReadingModal} type="button">
              Modal
            </button>
          </div>
        </div>

        <Suspense fallback={<div className="editor-loading">Carregando editor...</div>}>
          <MarkdownEditor
            editorRef={editorRef}
            initialMarkdown={initialMarkdown}
            onChange={handleChange}
          />
        </Suspense>
      </section>

      <aside className="poc-note">
        <strong>Sobre o upload:</strong> nesta POC, PNG, JPEG, WebP e GIF de até 2 MB são
        convertidos para data URL para permitir persistência sem backend. Em produção,
        substitua o handler por uma API autenticada que retorne uma URL HTTPS.
      </aside>

      {readingHtml && (
        <div
          aria-label="Pré-visualização do documento"
          className="reading-modal__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReadingHtml(null)
          }}
          role="presentation"
        >
          <section aria-labelledby="reading-modal-title" aria-modal="true" className="reading-modal" role="dialog">
            <header className="reading-modal__header">
              <h2 id="reading-modal-title">Visualização do documento</h2>
              <button
                aria-label="Fechar visualização"
                className="reading-modal__close"
                onClick={() => setReadingHtml(null)}
                type="button"
              >
                ×
              </button>
            </header>
            <article className="reading-modal__content" dangerouslySetInnerHTML={{ __html: readingHtml }} />
          </section>
        </div>
      )}
    </main>
  )
}
