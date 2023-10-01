import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

import DateComponent from '../components/DateComponent'
import PostFeaturedImage from '../components/PostFeaturedImage'
import AiOutlineClockCircle from '../icons/AiOutlineClockCircle'
import IoBookOutline from '../icons/IoBookOutline'
import { Post } from '../interface'
import { usePostDateStatus } from '../lib/hooks'

export type PostTitleCateDateOpts = {
  hideCategory?: boolean
  hideDate?: boolean
  fontClassName?: string
  defaultCategoryBgColor?: string
  defaultCategoryTextColor?: string
  imageProps?: Partial<ImageProps>
  newLabel?: string
  updatedLabel?: string
}

type PostTitleCateDateProps = {
  post: Post
  options?: PostTitleCateDateOpts
}

export const TCDFIHeightClass = 'h-28'

export default function PostTitleCateDate(props: PostTitleCateDateProps) {
  const { title, featuredImage, date, categories, uri } = props.post
  const options = props.options
  const category = categories ? categories[0] : null

  const status = usePostDateStatus(props.post.createdDate!, props.post.date!, 7)

  return (
    <div className="group">
      <Link className={cn(options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div
          className={cn('flex flex-col justify-center overflow-hidden rounded-t-md shadow-sm', {
            'rounded-b-md': !category || options?.hideCategory
          })}
        >
          <div className={cn('relative w-full overflow-hidden', TCDFIHeightClass)}>
            {(status === 'new' || status === 'updatedWithin') && (
              <div
                className={cn(
                  'absolute bottom-4 left-0 z-10 text-[0.8rem] py-[1px] pl-2 pr-4',
                  'rounded-r-md',
                  {
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'bg-amber-200 text-amber-900': status === 'new'
                  }
                )}
              >
                {status === 'new' && (props.options?.newLabel || 'new')}
                {status === 'updatedWithin' && (props.options?.updatedLabel || 'updated')}
              </div>
            )}
            <PostFeaturedImage
              className="duration-300 group-hover:scale-110"
              featuredImage={featuredImage}
              title={title}
              imageProps={props.options?.imageProps}
            />
          </div>
          {!options?.hideCategory && category && (
            <div
              style={{
                backgroundColor: `${
                  category.style?.bgColor || options?.defaultCategoryBgColor || '#eee'
                }`,
                color: `${category.style?.textColor || options?.defaultCategoryTextColor || '#222'}`
              }}
              className={cn('rounded-b-md px-2 py-1 text-xs font-semibold')}
            >
              {category?.name}
            </div>
          )}
        </div>
        <div
          className={cn(
            'group-hover:m2it-link-hover p-2 text-[0.95rem] font-semibold leading-[1.35]'
          )}
        >
          {title}
          {!!props.post.bookCover && (
            <IoBookOutline className="group-hover:m2it-link-hover mb-[2px] ml-2 inline text-sm text-slate-700" />
          )}
        </div>
        {!options?.hideDate && (
          <div className="text-sm opacity-80 flex gap-1 items-center justify-center">
            <AiOutlineClockCircle />
            {date && <DateComponent dateString={date} />}
          </div>
        )}
      </Link>
    </div>
  )
}
