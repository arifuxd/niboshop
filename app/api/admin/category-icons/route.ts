import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const maxFileSize = 5 * 1024 * 1024

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an icon to upload.' }, { status: 400 })
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > maxFileSize) {
    return NextResponse.json({ error: 'Icons must be JPG, PNG, WebP, or AVIF and no larger than 5 MB.' }, { status: 400 })
  }
  try {
    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const blob = await put(`category-icons/${crypto.randomUUID()}.${extension}`, file, {
      access: 'public', addRandomSuffix: false, contentType: file.type,
    })
    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ error: 'Icon upload failed. Please try again.' }, { status: 500 })
  }
}
