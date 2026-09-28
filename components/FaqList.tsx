'use client'

import { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

type FaqListProps = {
  items: FaqItem[]
}

export function FaqList({ items }: FaqListProps) {
  const [open, setOpen] = useState(0)

  return (
    <ul className="faq-list">
      {items.map((item, index) => {
        const isOpen = open === index
        const id = `faq-${index}`
        return (
          <li key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
            <h3 className="faq-q">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                {item.question}
              </button>
            </h3>
            <div id={id} hidden={!isOpen} className="faq-a">
              <p>{item.answer}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
