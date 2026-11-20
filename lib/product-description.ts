const safeDescriptionTags = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'hr',
])

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Turns legacy plain text into editor HTML and removes all attributes/tags outside our editor allowlist. */
export function prepareProductDescription(value: string) {
  const hasSupportedMarkup = /<\/?(?:p|br|strong|b|em|i|u|s|ul|ol|li|h[234]|blockquote|hr)\b/i.test(value)
  const html = hasSupportedMarkup
    ? value
    : value.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`).join('')

  return html.replace(/<\s*(\/?)\s*([a-z0-9]+)\b[^>]*>/gi, (match, closing: string, rawTag: string) => {
    const tag = rawTag.toLowerCase()
    if (!safeDescriptionTags.has(tag)) return ''
    return `<${closing}${tag}>`
  })
}
