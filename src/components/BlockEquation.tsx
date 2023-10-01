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
}) {
  const { block, math, inline = false, className, ...rest } = props
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
          : 'block text-center overflow-auto m2it-scrollbar m2it-scrollbar-small',
        className
      )}
    >
      <Katex math={math2Use} settings={katexSettings} block={!inline} {...rest} />
    </span>
  )
}
