import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import { useMemo, type RefObject } from 'react'
import { imageUploadHandler } from '../../shared/helpers/imageUpload'
import './markdown-editor.css'

interface MarkdownEditorProps {
  editorRef: RefObject<MDXEditorMethods | null>
  initialMarkdown: string
  onChange: (markdown: string, initialNormalize: boolean) => void
}

export function MarkdownEditor({
  editorRef,
  initialMarkdown,
  onChange,
}: MarkdownEditorProps) {
  const plugins = useMemo(() => {
    return [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      tablePlugin(),
      imagePlugin({ imageUploadHandler, disableImageResize: true }),
      diffSourcePlugin({ viewMode: 'rich-text' }),
      markdownShortcutPlugin(),
      toolbarPlugin({
        toolbarClassName: 'editor-toolbar',
        toolbarContents: () => (
          <DiffSourceToggleWrapper options={['rich-text', 'source']}>
            <UndoRedo />
            <Separator />
            <BlockTypeSelect />
            <BoldItalicUnderlineToggles />
            <CodeToggle />
            <Separator />
            <CreateLink />
            <InsertImage />
            <InsertTable />
            <InsertThematicBreak />
            <ListsToggle />
          </DiffSourceToggleWrapper>
        ),
      }),
    ]
  }, [])

  return (
    <div className="editor-shell">
      <MDXEditor
        className="mdx-editor"
        contentEditableClassName="mdx-content"
        markdown={initialMarkdown}
        onChange={onChange}
        plugins={plugins}
        ref={editorRef}
      />
    </div>
  )
}
