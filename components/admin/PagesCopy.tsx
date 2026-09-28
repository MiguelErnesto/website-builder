'use client'

import { useEffect } from 'react'

const REPLACEMENTS: [string, string][] = [
  [
    'No se encontró ningún Páginas. Puede que aún no existan o que no coincidan con los filtros aplicados.',
    'No se encontró ninguna página. Puede que aún no existan o que no coincidan con los filtros aplicados.',
  ],
  ['Crear nuevo Página', 'Crear nueva Página'],
  ['Creando nuevo Página', 'Creando nueva Página'],
]

function rewrite(node: Node) {
  if (node.nodeType === Node.TEXT_NODE && node.textContent) {
    let text = node.textContent
    for (const [from, to] of REPLACEMENTS) {
      if (text.includes(from)) text = text.replaceAll(from, to)
    }
    if (text !== node.textContent) node.textContent = text
    return
  }
  node.childNodes.forEach(rewrite)
}

export function PagesCopy() {
  useEffect(() => {
    const run = () => rewrite(document.body)
    run()
    const observer = new MutationObserver(run)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])
  return null
}
