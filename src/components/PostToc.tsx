'use client'

import cn from 'classnames'
import { TableOfContentsEntry } from 'notion-utils'
import { useState } from 'react'
import React from 'react'

import IoIosArrowDown from '../icons/IoIosArrowDown'
import { generateAnchor } from '../lib/helpers'
import { useHeadsObserver } from '../lib/hooks'

type PostTocProps = {
  showToc?: boolean // The property coming from the header of Notion page
  tocs: Array<TableOfContentsEntry>
  inPost?: boolean // This component is used in 2 places: post-body and [postSlug]
  minNumHeadingsToShowToc?: number
  labelTocTitle?: string
  labelTocClassName?: string
}

/**
 * IMPORTANT: Add class "scroll-mt-[70px]" to the heading elements!
 */

export default function PostToc(props: PostTocProps) {
  const [showContent, setShowContent] = useState(true)
  // const headingBlocks = props.contentBlocks.filter(
  //   block => block.type === 'heading_2' || block.type === 'heading_3'
  // )

  const showToc = props.showToc && props.tocs.length >= (props.minNumHeadingsToShowToc || 4)

  const { activeId } = useHeadsObserver()

  if (!showToc) return null

  return (
    <nav
      className={cn(
        'h-fit w-full flex gap-2 flex-col px-4 py-3 bg-slate-50 rounded-xl m2it-box-shadow',
        {
          '2xl:hidden': props.inPost, // hide on large screens
          'max-h-full p-3': !props.inPost,
          'border-[0.5px]': !props.inPost,
          'max-h-[350px] mt-8 mb-10': props.inPost,
          border: props.inPost
        }
      )}
      aria-label="Table of contents"
    >
      <button
        className={cn(
          'flex items-center justify-between text-md font-semibold text-slate-700 pb-0'
        )}
        onClick={() => setShowContent(!showContent)}
      >
        <div className={props.labelTocClassName}>{props.labelTocTitle || 'In this post'}</div>
        <div>
          <IoIosArrowDown
            className={cn('text-2xl ease-in-out transition-all duration-[400ms]', {
              'rotate-0': showContent,
              'rotate-[-90deg]': !showContent
            })}
          />
        </div>
      </button>
      {showContent && (
        <div
          className={cn('pt-3 pl-1 overflow-auto m2it-scrollbar m2it-scrollbar-small border-t', {
            'columns-1 md:columns-2': props.inPost
          })}
        >
          {props.tocs.map(toc => {
            const anchor = generateAnchor(toc.id, toc.text)
            const isH2 = toc.indentLevel === 0
            const isH3 = toc.indentLevel === 1
            return (
              <a
                key={toc.id}
                href={`#${anchor}`}
                className={cn('flex items-baseline gap-2 hover:m2it-link text-sm py-1', {
                  'pl-4 border-l': isH3,
                  '-ml-1': isH2,
                  'm2it-link': activeId === anchor && !props.inPost,
                  '!text-slate-700': activeId !== anchor || props.inPost
                })}
              >
                {isH2 && <span className="text-[0.7rem] text-slate-400">◆</span>}
                {isH3 && <span className="text-[0.6rem] text-slate-400">○</span>}
                <span className="block">{toc.text}</span>
              </a>
            )
          })}
        </div>
      )}
    </nav>
  )
}
