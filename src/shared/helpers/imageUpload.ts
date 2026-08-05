import { MAX_IMAGE_SIZE_BYTES } from '../constants/editor'

const ALLOWED_IMAGE_TYPES = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
])

export async function imageUploadHandler(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Formato não permitido. Use PNG, JPEG, WebP ou GIF.')
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('A imagem deve ter no máximo 2 MB nesta POC.')
  }

  return await readFileAsDataUrl(file)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Não foi possível ler a imagem.'))
      }
    })
    reader.addEventListener('error', () => {
      reject(new Error('Não foi possível ler a imagem.'))
    })
    reader.readAsDataURL(file)
  })
}
