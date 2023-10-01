import cn from 'classnames'
import { ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

import PostFeaturedImage from '../components/PostFeaturedImage'
import { Post } from '../interface'

export type PostImageBackgroundOpts = {
  fontClassName?: string
  imageProps?: Partial<ImageProps>
}

type PostImageBackgroundProps = {
  post: Post
  options?: PostImageBackgroundOpts
}

export const PIBHeightClass = 'h-36'

export default function PostImageBackground(props: PostImageBackgroundProps) {
  const { title, featuredImage, uri } = props.post
  return (
    <div className="group overflow-hidden rounded-md shadow-lg">
      <Link className={cn(props.options?.fontClassName, 'text-center')} href={uri || '/'}>
        <div className="flex flex-col justify-center">
          <div className={cn('relative w-full overflow-hidden mix-blend-overlay', PIBHeightClass)}>
            <PostFeaturedImage
              featuredImage={featuredImage}
              title={title}
              imageProps={props.options?.imageProps}
            />
            <div
              className={cn(
                'absolute bottom-0 left-0 flex h-fit w-full flex-col justify-end',
                'bg-gradient-to-t from-gray-900 to-transparent p-4 pt-6 text-sm font-bold',
                'leading-5 text-white duration-300 hover:from-black hover:to-transparent'
              )}
            >
              {title}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
