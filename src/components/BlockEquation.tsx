import Katex from '@matejmazur/react-katex'
import { EquationBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import * as React from 'react'

import { useNotionContext } from '../lib/context'
import { cs } from '../lib/utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export default function BlockEquation(props: {
  block: EquationBlock
  math?: string
  inline?: boolean
  className?: string
  updatedBlock?: React.JSX.Element
  blurBlockClassName?: string
}) {
  const { block, math, inline = false, className } = props
  const { recordMap } = useNotionContext()
  const math2Use = math || getBlockTitle(block, recordMap)
  if (!math2Use) return null

  return (
    <span
      tabIndex={0}
      className={cs(
        'notion-equation',
        inline
          ? 'notion-equation-inline'
          : 'block text-center overflow-x-auto m2it-scrollbar m2it-scrollbar-small relative',
        className,
        props.blurBlockClassName
      )}
    >
      {!!props.updatedBlock && !inline && props.updatedBlock}
      <Katex math={math2Use} settings={katexSettings} block={!inline} className={className} />
    </span>
  )
}
