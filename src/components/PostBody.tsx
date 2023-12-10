'use client'

import cn from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Block, ExtendedRecordMap, PreviewImage } from 'notion-types'
import * as React from 'react'

import { ToggleOffIcon } from '../icons/ToggleOffIcon'
import { ToggleOnIcon } from '../icons/ToggleOnIcon'
import { BlockOptionsContextType } from '../lib/context'
import { usePostDateStatus } from '../lib/hooks'
import { NotionRenderer } from '../lib/renderer'
import ScrollToTop from './ScrollToTop'
import { SimpleImageProps } from './SimpleImage'

type PostBodyProps = {
  recordMap: ExtendedRecordMap
  className?: string
  blockOptions?: BlockOptionsContextType
  customPreviewImage?: PreviewImage
  useSimpleImage?: boolean
  simpleImageProps?: SimpleImageProps
  showUpdatedIndicator?: boolean
  lastModifiedIdKey?: string // used as NEXT_PUBLIC_ID_LAST_MODIFIED
  createdIdKey?: string // used as NEXT_PUBLIC_ID_CREATED_DATE
  showUpdateButtonClassName?: string
  showUpdateButtonPositionClass?: string
  showBackToTopButton?: boolean
}

const Equation = dynamic(() => import('./BlockEquation'))
const Code = dynamic(() => import('./BlockCode'))

// In case we need more suppored components, check this out:
// https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/main/components/NotionPage.tsx
export default function PostBody(props: PostBodyProps) {
  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Equation
    }),
    []
  )

  let showUpdatedIndicator = props.showUpdatedIndicator

  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value
  const { createdDate, modifiedDate } = getPostProperties(
    block,
    props.lastModifiedIdKey,
    props.createdIdKey
  )
  if (!createdDate || !modifiedDate) {
    showUpdatedIndicator = false
  }

  const status = usePostDateStatus(
    createdDate!,
    modifiedDate!,
    props.blockOptions?.maxDaysWinthin ?? 7
  )

  showUpdatedIndicator = showUpdatedIndicator && status !== 'new'
  const [showOnlyUpdatedBlocks, setShowOnlyUpdatedBlocks] = React.useState(false)

  return (
    <>
      <div className={props.className}>
        <NotionRenderer
          recordMap={props.recordMap}
          fullPage={true}
          darkMode={false}
          components={components}
          showTableOfContents={false}
          minTableOfContentsItems={3}
          disableHeader={true}
          previewImages={true}
          blockOptions={props.blockOptions}
          customPreviewImage={props.customPreviewImage}
          useSimpleImage={props.useSimpleImage}
          showUpdatedIndicator={showUpdatedIndicator}
          simpleImageProps={props.simpleImageProps}
          showOnlyUpdatedBlocks={showOnlyUpdatedBlocks}
          setShowOnlyUpdatedBlocks={setShowOnlyUpdatedBlocks}
        />
      </div>
      {showUpdatedIndicator && status === 'updatedWithin' && (
        <button
          onClick={() => setShowOnlyUpdatedBlocks(!showOnlyUpdatedBlocks)}
          className={cn(
            'fixed hidden md:block bg-slate-200 hover:bg-slate-300 w-12 h-12 rounded-full z-50 hover:cursor-pointer',
            props.showUpdateButtonPositionClass
              ? props.showUpdateButtonPositionClass
              : 'right-10 bottom-24'
          )}
        >
          <div
            className={cn(
              'h-full w-full flex items-center justify-center',
              props.showUpdateButtonClassName
                ? props.showUpdateButtonClassName
                : 'before:!right-[55px] before:!top-[15px] before:!content-[attr(data-title)] before:!left-auto tooltip-auto'
            )}
            data-title={
              !showOnlyUpdatedBlocks ? 'Highlight only updated blocks' : 'Back to default display'
            }
          >
            {!showOnlyUpdatedBlocks && <ToggleOffIcon className="w-7 h-7 text-green-700" />}
            {showOnlyUpdatedBlocks && <ToggleOnIcon className="w-7 h-7 text-green-700" />}
          </div>
        </button>
      )}
      {props.showBackToTopButton && (
        <ScrollToTop
          positionClassName={
            showUpdatedIndicator && status === 'updatedWithin'
              ? 'right-10 bottom-24'
              : 'right-10 bottom-8'
          }
        />
      )}
    </>
  )
}

function getPostProperties(
  post: Block,
  lastModifiedIdKey?: string,
  createdIdKey?: string
): { createdDate?: string; modifiedDate?: string } {
  if (!lastModifiedIdKey || !createdIdKey) {
    return {
      createdDate: undefined,
      modifiedDate: undefined
    }
  }
  const properties = post?.properties
  const modifiedDate =
    properties?.[`${lastModifiedIdKey}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.last_edited_time).toISOString()
  const createdDate =
    properties?.[`${createdIdKey}`]?.[0]?.[1]?.[0]?.[1]?.start_date ??
    new Date(post?.created_time).toISOString()

  return { createdDate, modifiedDate }
}
