# POC React + TypeScript + MDXEditor

Editor visual e direto de Markdown com upload de imagens, abertura local e exportação de
documentos.

## Executar

Requer Node.js 22.12 ou superior.

```bash
npm install
npm run dev
```

## Recursos

- Alternância entre rich text e fonte Markdown.
- Abertura local de arquivos `.md` e `.markdown` em UTF-8, com até 8 MB.
- Imagens e GIFs por URL pelo botão de imagem.
- Upload de PNG, JPEG, WebP e GIF de até 2 MB.
- Download do Markdown e exportação do documento como HTML.
- Bloqueio de HTML arbitrário e links/imagens com origens inseguras.

## Segurança

O conteúdo é validado com AST antes de abrir, baixar ou exportar. Não há renderização com
`dangerouslySetInnerHTML` nem suporte a HTML arbitrário no documento.

O upload usa data URL apenas para tornar a POC autônoma. Em produção, envie o arquivo a uma API
autenticada, valide MIME/conteúdo/tamanho no backend e retorne uma URL HTTPS.

## Validação

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit
```
