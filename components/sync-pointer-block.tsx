import { Block as BlockType, SyncPointerBlock as SyncPointerBlockType } from 'notion-types'
import * as React from 'react'

import { NotionBlockRenderer } from '../renderer'

export const SyncPointerBlock: React.FC<{
  blockObj: BlockType
  levelObj: number
}> = ({ blockObj, levelObj }) => {
  if (!blockObj) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing sync pointer block', (blockObj as any).id)
    }

    return null
  }

  const syncPointerBlock = blockObj as SyncPointerBlockType
  const referencePointerId = syncPointerBlock?.format?.transclusion_reference_pointer?.id

  if (!referencePointerId) {
    return null
  }

  return (
    <NotionBlockRenderer key={referencePointerId} level={levelObj} blockId={referencePointerId} />
  )
}
