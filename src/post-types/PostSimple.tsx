'use client'

import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '../components/DateComponent'
import { CommonPostTypeOpts } from '../components/PostsList'
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
} & CommonPostTypeOpts

type PostSimpleProps = {
  post: Post
  options?: PostSimpleOpts
}

export default function PostSimple(props: PostSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, 7)

  return (
    <div className="group hover:bg-slate-50">
      <Link
        className={cn(options?.fontClassName, 'flex items-start gap-3 p-4')}
        href={post.uri || '/'}
      >
        <div
          className={cn('mt-[3px] text-slate-600 relative', {
            'tooltip-auto': post.wellWritten
          })}
          data-title={options?.wellWrittenLabel ?? 'Well written, verified by me.'}
        >
          {!!options?.customIcon && options.customIcon}
          {!options?.customIcon && <HiOutlineDocumentText className="text-xl" />}
          {post.wellWritten && (
            <span className="bg-white absolute bottom-[-5px] right-[-5px]">
              <HiMiniCheckBadge className={cn('text-gray-400 text-sm')} />
            </span>
          )}
        </div>
        <h3 className="flex-1">
          {post.title}{' '}
          {post.isDraft && (
            <span
              className={cn(
                'bg-slate-100 text-slate-600 px-2 py-0 text-[0.8rem] rounded-md tooltip-auto'
              )}
              data-title={options?.tooltipDraftLabel || 'The content is not so good yet'}
            >
              {options?.draftLabel || 'draft'}
            </span>
          )}
        </h3>
        {(post.createdDate || post.date) && (
          <div className="gap-2 hidden md:flex items-center">
            {['updated', 'updatedWithin'].includes(status) && post.date && (
              <div
                className={cn(
                  'px-3 py-0.5 text-[0.8rem] items-start rounded-md whitespace-nowrap',
                  {
                    'bg-slate-200 text-slate-800': status === 'updated',
                    'bg-green-200 text-green-900': status === 'updatedWithin'
                  },
                  'hidden lg:flex gap-1 items-center'
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
              <div
                className={cn(
                  'px-3 py-0.5 text-[0.8rem] rounded-md whitespace-nowrap',
                  'bg-amber-200 text-amber-900'
                )}
              >
                {options?.newLabel || 'new'}
              </div>
            )}
            {post.createdDate && (
              <DateComponent
                className="text-[0.8rem] text-slate-500 group-hover:text-slate-700"
                dateString={post.createdDate}
                format="MMM DD, YYYY"
                humanize={options?.humanizeDate}
                dateLabel={options?.addedOnLabel || 'added'}
              />
            )}
          </div>
        )}
      </Link>
    </div>
  )
}
