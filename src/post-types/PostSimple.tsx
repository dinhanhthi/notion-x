'use client'

import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '../components/DateComponent'
import { CommonPostTypeOpts } from '../components/PostsList'
import TooltipX from '../components/tooltip-x'
import BlogIcon from '../icons/BlogIcon'
import BsPinAngleFill from '../icons/BsPinAngleFill'
import HiMiniCheckBadge from '../icons/HiMiniCheckBadge'
import HiOutlineDocumentText from '../icons/HiOutlineDocumentText'
import { Post } from '../interface'
import { usePostDateStatus } from '../lib/hooks'

export type PostSimpleOpts = {
  hideDate?: boolean
  customIcon?: React.ReactNode
  draftLabel?: string
  tooltipDraftLabel?: string
  humanizeDate?: boolean
  wellWrittenLabel?: string
  blogLabel?: string
  showPinned?: boolean
  maxDaysWinthin?: number
} & CommonPostTypeOpts

type PostSimpleProps = {
  post: Post
  options?: PostSimpleOpts
}

export default function PostSimple(props: PostSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)

  return (
    <div className="group hover:bg-slate-50">
      <Link
        className={cn(options?.fontClassName, 'flex items-start gap-3 p-4')}
        href={post.uri || '/'}
      >
        <div className={cn('mt-[3px] text-slate-600 relative')} id={`well-blog-${post.id}`}>
          {!!options?.customIcon && (!options.showPinned || !post.pinned) && options.customIcon}
          {!options?.customIcon && (!options?.showPinned || !post.pinned) && (
            <>
              {!post.blog && <HiOutlineDocumentText className="text-xl" />}
              {post.blog && <BlogIcon className="text-xl text-slate-600" />}
            </>
          )}
          {options?.showPinned && post.pinned && <BsPinAngleFill className="text-xl" />}
          {post.wellWritten && !post.blog && (
            <span className="bg-transparent absolute bottom-[-5px] right-[-5px]">
              <HiMiniCheckBadge className={cn('text-gray-400 text-sm')} />
            </span>
          )}
        </div>
        {(post.wellWritten || post.blog) && (
          <TooltipX id={`#well-blog-${post.id}`}>
            {post.blog
              ? options?.blogLabel ?? 'A blog post' // Must come before wellWritten
              : post.wellWritten
              ? options?.wellWrittenLabel ?? 'Well written, verified by the author'
              : undefined}
          </TooltipX>
        )}

        <div className="flex flex-1 items-start justify-between gap-x-3 gap-y-1.5 flex-col md:flex-row">
          <h3 className="flex-1">
            {/* date status on mobile size */}
            {post.date && (status === 'updatedWithin' || status === 'new') && (
              <span
                className={cn(
                  'inline-flex md:hidden mr-1.5 px-2 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap gap-1 items-center',
                  {
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'bg-amber-200 text-amber-900': status === 'new'
                  }
                )}
              >
                {status === 'updatedWithin' && <>updated</>}
                {status === 'new' && <>new</>}
              </span>
            )}
            {/* title */}
            {post.title} {/* draft */}
            {post.isDraft && (
              <>
                <span
                  id={`draft-${post.id}`}
                  className={cn('bg-slate-100 text-slate-600 px-2 py-0 text-[0.8rem] rounded-md')}
                >
                  {options?.draftLabel || 'draft'}
                </span>
                <TooltipX id={`#draft-${post.id}`}>
                  {options?.tooltipDraftLabel || 'The content is not so good yet'}
                </TooltipX>
              </>
            )}
          </h3>
          {/* date status on big screen */}
          {(post.createdDate || post.date) && (
            <div className="gap-2 items-center hidden md:flex">
              {['updated', 'updatedWithin'].includes(status) && post.date && (
                <div
                  className={cn(
                    'px-3 py-0.5 text-[0.8rem] rounded-md whitespace-nowrap gap-1 items-center',
                    {
                      'bg-slate-200 text-slate-800': status === 'updated',
                      'bg-green-200 text-green-900': status === 'updatedWithin'
                    }
                  )}
                >
                  <DateComponent
                    dateString={post.date}
                    format="MMM DD, YYYY"
                    humanize={options?.humanizeDate}
                    dateLabel={options?.updatedOnLabel || 'updated'}
                  />
                </div>
              )}
              {status === 'new' && (
                <div className="px-3 py-0.5 text-[0.8rem] rounded-md whitespace-nowrap bg-amber-200 text-amber-900">
                  {options?.newLabel || 'new'}
                </div>
              )}
              {post.createdDate && (
                <DateComponent
                  className="text-[0.8rem] text-slate-500 group-hover:text-slate-700 hidden md:flex"
                  dateString={post.createdDate}
                  format="MMM DD, YYYY"
                  humanize={options?.humanizeDate}
                  dateLabel={options?.addedOnLabel || 'added'}
                />
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
