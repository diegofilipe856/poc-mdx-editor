export const EDITOR_STORAGE_KEY = 'lccv:mdxeditor-poc:markdown'

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024

export const MAX_MARKDOWN_FILE_SIZE_BYTES = 8 * 1024 * 1024

export const INITIAL_MARKDOWN = `# POC com MDXEditor

Esta prova de conceito permite alternar entre **rich text** e **Markdown**, inserir imagens e persistir o documento no navegador.

## Imagem e GIF por URL

Use o botão de imagem na barra do editor. Um GIF remoto também pode ser inserido com a sintaxe Markdown:

![GIF de exemplo](https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif)

O conteúdo é validado antes da abertura e exportação para bloquear HTML arbitrário e links inseguros.
`
