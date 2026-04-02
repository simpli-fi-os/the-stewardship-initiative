'use client'

/**
 * Renders markdown article content as React elements.
 * Content is admin-authored (via service role / AI generation),
 * not user-generated. Uses React elements (not innerHTML) for safety.
 */

interface Props {
  content: string
}

interface Block {
  type: 'heading' | 'paragraph' | 'blockquote' | 'list-item' | 'hr'
  level?: number
  text: string
}

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n')
  const blocks: Block[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: trimmed.slice(4) })
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: trimmed.slice(3) })
    } else if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: trimmed.slice(2) })
    } else if (trimmed.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: trimmed.slice(2) })
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.push({ type: 'list-item', text: trimmed.slice(2) })
    } else if (/^\d+\.\s/.test(trimmed)) {
      blocks.push({ type: 'list-item', text: trimmed.replace(/^\d+\.\s/, '') })
    } else if (trimmed === '---') {
      blocks.push({ type: 'hr', text: '' })
    } else {
      blocks.push({ type: 'paragraph', text: trimmed })
    }
  }

  return blocks
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      nodes.push(<strong key={match.index}><em>{match[2]}</em></strong>)
    } else if (match[3]) {
      nodes.push(<strong key={match.index} className="text-eden-orchid">{match[3]}</strong>)
    } else if (match[4]) {
      nodes.push(<em key={match.index}>{match[4]}</em>)
    } else if (match[5] && match[6]) {
      nodes.push(
        <a
          key={match.index}
          href={match[6]}
          className="text-eden-marigold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[5]}
        </a>
      )
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

export default function ArticleBody({ content }: Props) {
  const blocks = parseBlocks(content)

  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let listKey = 0

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey}`} className="list-disc space-y-1 my-4 pl-6">
          {listItems.map((item, i) => (
            <li key={i} className="text-eden-gray leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      listItems = []
      listKey++
    }
  }

  blocks.forEach((block, idx) => {
    if (block.type === 'list-item') {
      listItems.push(block.text)
      return
    }

    flushList()

    switch (block.type) {
      case 'heading':
        if (block.level === 1) {
          elements.push(
            <h2 key={idx} className="font-display text-3xl font-bold text-eden-orchid mt-10 mb-4">
              {renderInline(block.text)}
            </h2>
          )
        } else if (block.level === 2) {
          elements.push(
            <h2 key={idx} className="font-display text-2xl font-bold text-eden-orchid mt-10 mb-4">
              {renderInline(block.text)}
            </h2>
          )
        } else {
          elements.push(
            <h3 key={idx} className="font-display text-xl font-bold text-eden-orchid mt-8 mb-3">
              {renderInline(block.text)}
            </h3>
          )
        }
        break

      case 'blockquote':
        elements.push(
          <blockquote key={idx} className="border-l-4 border-eden-tidal pl-4 my-4 italic text-eden-gray">
            {renderInline(block.text)}
          </blockquote>
        )
        break

      case 'hr':
        elements.push(<hr key={idx} className="border-eden-tidal/20 my-8" />)
        break

      case 'paragraph':
      default:
        elements.push(
          <p key={idx} className="text-eden-gray leading-relaxed mb-4">
            {renderInline(block.text)}
          </p>
        )
        break
    }
  })

  flushList()

  return <article className="article-content">{elements}</article>
}
