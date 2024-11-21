'use client'

import cn from 'classnames'
import React from 'react'

import { Carousel, CarouselItem } from '../components/Carousel'
import { PostListStyle, PostType, postListGridCLass } from '../components/PostsList'
import { PostBlogSimpleSkeleton } from '../post-types/PostBlogSimple'
import { PostCardWaveSkeleton } from '../post-types/PostCardWave'
import { PostCardWhiteBgBigSkeleton } from '../post-types/PostCardWhiteBgBig'
import { PostImageBackgroundSkeleton } from '../post-types/PostImageBackground'
import { PostSimpleSkeleton } from '../post-types/PostSimple'
import { PostTitleCateDateSkeleton } from '../post-types/PostTitleCateDate'

type SkeletonPostListProps = {
  count: number
  postType?: PostType
  listStyle?: PostListStyle
  options?: {
    className?: string
    postContainerClassName?: string
  }
}

export default function SkeletonPostList(props: SkeletonPostListProps) {
  return (
    <>
      {(!props.listStyle || props.listStyle === 'default') && (
        <div className={cn(props.options?.className || postListGridCLass, 'animate-pulse')}>
          {Array.from({ length: props.count }).map((_, i) =>
            getSkeleton(i, props.postType, props.options?.postContainerClassName)
          )}
        </div>
      )}
      {props.listStyle === 'carousel' && (
        <Carousel
          items={Array.from({ length: props.count }).map((_, i) => ({ id: i }))}
          renderItem={({ item, isSnapPoint }) => (
            <CarouselItem key={item.id} isSnapPoint={isSnapPoint} widthClass={'w-80'}>
              {getSkeleton(item.id, props.postType, props.options?.postContainerClassName)}
            </CarouselItem>
          )}
        />
      )}
    </>
  )
}

function getSkeleton(key: number | string, postType?: PostType, postContainerClassName?: string) {
  switch (postType) {
    case 'PostTitleCateDate':
      return <PostTitleCateDateSkeleton key={key} />

    case 'PostCardWhiteBgBig':
      return <PostCardWhiteBgBigSkeleton key={key} />

    case 'PostImageBackground':
      return <PostImageBackgroundSkeleton key={key} />

    case 'PostCardWave':
      return <PostCardWaveSkeleton key={key} postContainerClassName={postContainerClassName} />

    case 'PostSimple':
      return <PostSimpleSkeleton key={key} />

    case 'PostBlogSimple':
      return <PostBlogSimpleSkeleton key={key} postContainerClassName={postContainerClassName} />

    default:
      return <PostTitleCateDateSkeleton key={key} />
  }
}
