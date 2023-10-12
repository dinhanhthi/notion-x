import cn from 'classnames'
import { Block, CalloutBlock, PageBlock } from 'notion-types'
import { getBlockIcon, getBlockTitle } from 'notion-utils'
import * as React from 'react'

import { DefaultPageIcon } from '../icons/default-page-icon'
import { useNotionContext } from '../lib/context'
import { cs, isUrl } from '../lib/utils'
import { LazyImage } from './lazy-image'

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  )
}

export const PageIconImpl: React.FC<{
  block: Block
  className?: string
  wrapperClassName?: string
  inline?: boolean
  hideDefaultIcon?: boolean
  defaultIcon?: string
}> = ({
  block,
  className,
  wrapperClassName,
  inline = true,
  hideDefaultIcon = false,
  defaultIcon
}) => {
  const { mapImageUrl, recordMap, darkMode } = useNotionContext()
  let isImage = false
  let content: any = null

  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim() || defaultIcon
    const title = getBlockTitle(block, recordMap)

    if (icon && isUrl(icon)) {
      const url = mapImageUrl(icon, block)
      isImage = true

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(className, 'notion-page-icon')}
        />
      )
    } else if (icon && icon.startsWith('/icons/')) {
      const url = 'https://www.notion.so' + icon + '?mode=' + (darkMode ? 'dark' : 'light')

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(className, 'notion-page-icon')}
        />
      )
    } else if (!icon) {
      if (!hideDefaultIcon) {
        isImage = true
        content = (
          <DefaultPageIcon
            className={cs(className, 'notion-page-icon')}
            alt={title ? title : 'page icon'}
          />
        )
      }
    } else {
      isImage = false
      content = (
        <span className={cs(className, 'notion-page-icon icon-emoji')} role="img" aria-label={icon}>
          {icon}
        </span>
      )
    }
  }

  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        {
          'notion-page-icon-inline': inline,
          'notion-page-icon-hero': !inline,
          'notion-page-icon-image': isImage,
          'notion-page-icon-span': !isImage
        },
        wrapperClassName
      )}
    >
      {content}
    </div>
  )
}

export const PageIcon = React.memo(PageIconImpl)
