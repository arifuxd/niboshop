'use client'

import * as React from 'react'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { prepareProductDescription } from '@/lib/product-description'

type ProductDescriptionEditorProps = {
  name: string
  defaultValue?: string
  invalid?: boolean
}

export function ProductDescriptionEditor({ name, defaultValue = '', invalid = false }: ProductDescriptionEditorProps) {
  const initialContent = React.useMemo(() => prepareProductDescription(defaultValue), [defaultValue])
  const [html, setHtml] = React.useState(initialContent)
  const handleChange = React.useCallback((html: string) => {
    setHtml(html)
  }, [])

  React.useEffect(() => setHtml(initialContent), [initialContent])

  return (
    <div data-invalid={invalid || undefined}>
      <input type="hidden" name={name} value={html} readOnly />
      <SimpleEditor
        initialContent={initialContent}
        onChange={handleChange}
        compact
        editorId={name}
        ariaLabel="Product description"
        invalid={invalid}
      />
    </div>
  )
}
