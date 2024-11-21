import cn from 'classnames'
import Link from 'next/link'
import React from 'react'
import { CommonPostTypeOpts } from '../components/PostsList'
import TooltipX from '../components/tooltip-x'
import { Post } from '../interface'
import { getColorIndex, waveColors } from '../lib/helpers'
import { usePostDateStatus } from '../lib/hooks'

export type PostBlogSimpleOpts = {
  colorIndex?: number
  humanizeDate?: boolean
} & CommonPostTypeOpts

type PostBlogSimpleProps = {
  post: Post
  options?: PostBlogSimpleOpts
}

export default function PostBlogSimple(props: PostBlogSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)
  return (
    <Link href={post.uri || '/'}>
      <div className="group flex gap-4 items-center p-4">
        <div className="circle-wave w-12 h-12 flex-shrink-0 rounded-full">
          <div className="bottom-wave">
            <svg
              className="waves !h-[45px] !min-h-[50px]"
              preserveAspectRatio="none"
              shapeRendering="auto"
              viewBox="0 24 150 28"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <path
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                  id="gentle-wave"
                ></path>
              </defs>
              <g className="parallax">
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.2)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="0"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.1)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="3"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.02)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="5"
                ></use>
                <use
                  fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.03)`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="7"
                ></use>
              </g>
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div>
            {props.post.language && props.post.language !== 'en' && (
              <>
                <span
                  id={`lang-${post.id}`}
                  className="border text-sm rounded-md px-1.5 border-slate-300 mr-1.5 text-slate-600"
                >
                  {props.post.language}
                </span>
                <TooltipX id={`#lang-${post.id}`}>
                  {post.language === 'vi' && 'Written in Vietnamese'}
                  {post.language === 'fr' && 'Written in French'}
                </TooltipX>
              </>
            )}
            <span className="text-slate-800 group-hover:m2it-link-hover">{post.title}</span>
            {(post.createdDate || post.date) && (
              <>
                {status === 'updatedWithin' && (
                  <span className="align-middle ml-2 inline bg-green-200 text-green-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap">
                    updated
                  </span>
                )}
                {status === 'new' && (
                  <span className="align-middle ml-2 inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap">
                    new
                  </span>
                )}
              </>
            )}
          </div>
          {post.description && <div className="text-sm text-gray-500">{post.description}</div>}
        </div>
      </div>
    </Link>
  )
}

export const PostBlogSimpleSkeleton = (props: { postContainerClassName?: string }) => (
  <div
    className={cn('flex gap-4 items-center p-4', props.postContainerClassName)}
  >
    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-200"></div>
    <div className="flex flex-col gap-2 w-full">
      <div className="h-4 w-1/2 rounded-xl bg-slate-200"></div>
      <div className="h-3 w-3/4 rounded-xl bg-slate-200"></div>
    </div>
  </div>
)
