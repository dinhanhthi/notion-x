import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

import DateComponent from '../components/DateComponent'
import Excerpt from '../components/Excerpt'
import PostFeaturedImage from '../components/PostFeaturedImage'
import AiOutlineClockCircle from '../icons/AiOutlineClockCircle'
import { Post } from '../interface'

export type PostCardWhiteBgBigOpts = {
  hideDate?: boolean
  hideAuthor?: boolean
  hideExcerpt?: boolean
  fontClassName?: string
  imageProps?: Partial<ImageProps>
}

type PostCardWhiteBgBigProps = {
  post: Post
  options?: PostCardWhiteBgBigOpts
}

export const CWBBHeightClass = 'h-36'

export default function PostCardWhiteBgBig(props: PostCardWhiteBgBigProps) {
  const { title, featuredImage, date, uri, excerpt, authors } = props.post
  const options = props.options
  return (
    <div className="group overflow-hidden rounded-md bg-white shadow-lg h-full">
      <Link className={cn(options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div className="flex flex-col justify-center">
          <div className={cn('relative w-full overflow-hidden', CWBBHeightClass)}>
            <PostFeaturedImage
              featuredImage={featuredImage}
              title={title}
              imageProps={props.options?.imageProps}
            />
          </div>
        </div>
        <div className="p-4">
          <div className="group-hover:m2it-link-hover text-base font-bold leading-[1.35]">
            {title}
          </div>
          {(!options?.hideDate || !options?.hideAuthor) && (
            <div className="flex justify-center gap-2 p-2">
              {!options?.hideDate && date && (
                <div className="text-sm opacity-80">
                  <AiOutlineClockCircle />
                  <DateComponent dateString={date} />
                </div>
              )}
              {!options?.hideAuthor && authors?.length && (
                <div className="flex gap-1 text-sm opacity-80">
                  {authors?.length > 1 && (
                    <>
                      <i className="icon-users-outline"></i>
                      <span>Nhiều tác giả</span>
                    </>
                  )}
                  {authors?.length <= 1 && (
                    <>
                      <i className="icon-user-outline -mr-1"></i>
                      <span>{authors[0].name}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {!options?.hideExcerpt && excerpt && (
            <div className="pt-2 text-[0.8rem] opacity-80 group-hover:opacity-100">
              <Excerpt excerpt={excerpt} defaultExcerpt="Một bài viết trên Math2IT"></Excerpt>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
