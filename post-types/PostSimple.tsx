'use client'

import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import React from 'react'

import DateComponent from '../components/DateComponent'
import { isDateAfter } from '../helpers'
import FaPenNib from '../icons/FaPenNib'
import HiOutlineDocumentText from '../icons/HiOutlineDocumentText'
import { Post } from '../interface'

export type PostSimpleOpts = {
  hideDate?: boolean
  fontClassName?: string
  customIcon?: React.ReactNode
  updatedOnLabel?: string
  addedOnLabel?: string
  newLabel?: string
  draftLabel?: string
  tooltipDraftLabel?: string
  humanizeDate?: boolean
  wellWrittenLabel?: string
}

type PostSimpleProps = {
  post: Post
  options?: PostSimpleOpts
}

const maxDays = 7

export default function PostSimple(props: PostSimpleProps) {
  const [isIn7Days, setIsIn7Days] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const { post, options } = props

  useEffect(() => {
    const lastModifiedDate = new Date(post.date!)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lastModifiedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= maxDays) {
      setIsIn7Days(true)
    }

    const createdDate = new Date(post.createdDate!)
    const diffTime2 = Math.abs(today.getTime() - createdDate.getTime())
    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24))
    if (diffDays2 <= maxDays) {
      setIsNew(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="group hover:bg-slate-50">
      <Link
        className={cn(options?.fontClassName, 'flex items-start gap-3 p-4')}
        href={post.uri || '/'}
      >
        <div
          className={cn('mt-[3px] text-slate-600', {
            'tooltip-auto': post.isBlog
          })}
          data-title={
            post.isBlog ? props.options?.wellWrittenLabel || 'Well-written, like a blog' : null
          }
        >
          {!!options?.customIcon && options.customIcon}
          {!options?.customIcon && !post.isBlog && <HiOutlineDocumentText className="text-xl" />}
          {!options?.customIcon && post.isBlog && <FaPenNib className="text-lg" />}
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
            {post.date &&
              !isNew &&
              post.createdDate &&
              isDateAfter(post.date, post.createdDate) && (
                <div
                  className={cn(
                    'px-3 py-0.5 text-[0.8rem] items-start rounded-md whitespace-nowrap',
                    {
                      'bg-slate-200 text-slate-800': !isIn7Days,
                      'bg-green-200 text-green-900': isIn7Days
                    },
                    'flex gap-1 items-center'
                  )}
                >
                  <DateComponent
                    className="hidden lg:inline-block"
                    dateString={post.date}
                    format="MMM DD, YYYY"
                    humanize={options?.humanizeDate}
                    dateLabel={options?.updatedOnLabel || 'updated'}
                  />
                </div>
              )}
            {isNew && (
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
