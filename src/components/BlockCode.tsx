'use client'

import cn from 'classnames'
import { CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

import FiCheck from '../icons/FiCheck'
import RxCopy from '../icons/RxCopy'
import { useNotionContext } from '../lib/context'
import Mermaid from './Mermaid'
import { Text } from './text'

type BlockCodeProps = {
  block: CodeBlock
  className?: string
  defaultLanguage?: string
}

export default function BlockCode(props: BlockCodeProps) {
  const { block, className, defaultLanguage } = props

  const { recordMap, blockOptions } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const language = (
    block.properties?.language?.[0]?.[0] ||
    defaultLanguage ||
    'typescript'
  ).toLowerCase()
  const caption = block.properties.caption

  const [copied, setCopied] = useState(false)
  const onSuccess = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const copiedLabel = blockOptions?.blockCodeCopiedText || 'Copied'
  const copyLabel = blockOptions?.blockCodeCopyText || 'Copy'

  const copyBtn = (
    <button>
      {!copied && <RxCopy className="text-lg text-slate-400 hover:text-slate-700" />}
      {copied && <FiCheck className="text-lg text-green-600" />}
    </button>
  ) as any

  const copyBtnWrapper = (
    <CopyToClipboard text={content} onCopy={onSuccess}>
      {copyBtn}
    </CopyToClipboard>
  )

  const syntaxWraper = (
    <SyntaxHighlighter
      language={formatCodeLang(language)}
      style={prism}
      className={cn(
        '!my-0 syntax-highlighter-pre m2it-scrollbar m2it-scrollbar-small border !bg-slate-50',
        'max-h-[400px]'
      )}
      showLineNumbers={true}
    >
      {content}
    </SyntaxHighlighter>
  )

  return (
    <div className={cn(className, 'group flex flex-col gap-2')}>
      <div
        className={`language-${formatCodeLang(language)} syntax-highlighter relative text-[14px]`}
      >
        {syntaxWraper}
        <div
          className={cn(
            'tooltip-auto !absolute right-2 top-2 duration-100 hover:cursor-pointer group-hover:opacity-100',
            {
              'opacity-0': !copied
            }
          )}
          data-title={copied ? copiedLabel : copyLabel}
        >
          {copyBtnWrapper}
        </div>
      </div>

      {caption && (
        <div className="italic opacity-60 text-sm">
          <Text value={caption} block={block} />
        </div>
      )}

      {language === 'mermaid' && <Mermaid chart={content} />}
    </div>
  )
}

/**
 * Convert the code language notation of the Notion api to the code language notation of react-syntax-highlighter.
 * https://developers.notion.com/reference/block#code-blocks
 * https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/
 */
const formatCodeLang = (lang: string) => {
  switch (lang) {
    case 'plain text':
      return 'plaintext'
    case 'objective-c':
      return 'objectivec'
    default:
      return lang
  }
}
