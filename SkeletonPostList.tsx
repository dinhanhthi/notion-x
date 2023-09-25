'use client'

import cn from 'classnames'

import { Carousel, CarouselItem } from './components/Carousel'
import { PostListStyle, PostType, postListGridCLass } from './components/PostsList'
import HiOutlineDocumentText from './icons/HiOutlineDocumentText'
import { CWBBHeightClass } from './post-types/PostCardWhiteBgBig'
import { PIBHeightClass } from './post-types/PostImageBackground'
import { TCDFIHeightClass } from './post-types/PostTitleCateDate'

type SkeletonPostListProps = {
  count: number
  postType?: PostType
  listStyle?: PostListStyle
  options?: {
    className?: string
  }
}

export default function SkeletonPostList(props: SkeletonPostListProps) {
  return (
    <>
      {(!props.listStyle || props.listStyle === 'default') && (
        <div className={cn(props.options?.className || postListGridCLass, 'animate-pulse')}>
          {Array.from({ length: props.count }).map((_, i) => getSkeleton(i, props.postType))}
        </div>
      )}
      {props.listStyle === 'carousel' && (
        <Carousel
          items={Array.from({ length: props.count }).map((_, i) => ({ id: i }))}
          renderItem={({ item, isSnapPoint }) => (
            <CarouselItem key={item.id} isSnapPoint={isSnapPoint} widthClass={'w-80'}>
              {getSkeleton(item.id, props.postType)}
            </CarouselItem>
          )}
        />
      )}
    </>
  )
}

function getSkeleton(key: number | string, postType?: PostType) {
  switch (postType) {
    case 'PostTitleCateDate':
      return <PostTitleCateDateSkeleton key={key} />

    case 'PostCardWhiteBgBig':
      return <PostCardWhiteBgBigSkeleton key={key} />

    case 'PostImageBackground':
      return <PostImageBackgroundSkeleton key={key} />

    case 'PostCardWave':
      return <PostCardWaveSkeleton key={key} />

    case 'PostSimple':
      return <PostSimpleSkeleton key={key} />

    default:
      return <PostTitleCateDateSkeleton key={key} />
  }
}

const PostCardWaveSkeleton = () => (
  <div className="flex flex-col justify-center">
    <div className={cn('flex items-center justify-center w-full rounded-md bg-slate-200', 'h-32')}>
      <div className="w-full flex flex-col items-center gap-1 p-3">
        <div className="h-4 w-full rounded-md bg-slate-300"></div>
        <div className="h-4 w-3/4 rounded-md bg-slate-300"></div>
      </div>
    </div>
  </div>
)

const PostTitleCateDateSkeleton = () => (
  <div className="flex flex-col justify-center">
    <div className={cn('w-full rounded-md bg-slate-200', TCDFIHeightClass)}></div>
    <div className="flex flex-col items-center gap-1 p-2">
      <div className="h-4 w-full rounded-md bg-slate-200"></div>
      <div className="h-4 w-3/4 rounded-md bg-slate-200"></div>
    </div>
  </div>
)

const PostCardWhiteBgBigSkeleton = () => (
  <div className="flex flex-col justify-center">
    <div className={cn('w-full rounded-md bg-slate-200', CWBBHeightClass)}></div>
    <div className="flex flex-col items-center gap-1 p-2">
      <div className="h-4 w-full rounded-md bg-slate-200"></div>

      {/* excerpt */}
      <div className="w-full mt-2 px-2 flex flex-col items-center gap-1">
        <div className="h-2 w-full rounded-md bg-slate-200"></div>
        <div className="h-2 w-full rounded-md bg-slate-200"></div>
        <div className="h-2 w-3/4 rounded-md bg-slate-200"></div>
      </div>
    </div>
  </div>
)

const PostImageBackgroundSkeleton = () => (
  <div className="flex flex-col justify-center">
    <div className={cn('relative w-full rounded-md bg-slate-200', PIBHeightClass)}>
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center gap-1 p-3">
        <div className="h-4 w-full rounded-md bg-slate-300"></div>
        <div className="h-4 w-3/4 rounded-md bg-slate-300"></div>
      </div>
    </div>
  </div>
)

const PostSimpleSkeleton = () => (
  <div className="flex items-center gap-3 py-3 px-2">
    <div>
      <HiOutlineDocumentText className="text-xl text-slate-700" />
    </div>
    <div className="flex-1 flex justify-start">
      <div className="h-6 w-3/4 rounded-md bg-slate-200"></div>
    </div>
    <div className="h-4 w-[150px] rounded-md bg-slate-200"></div>
  </div>
)
