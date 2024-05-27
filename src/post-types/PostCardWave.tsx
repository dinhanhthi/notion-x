import cn from 'classnames'
import Link from 'next/link'
import React from 'react'

import DateComponent from '../components/DateComponent'
import { CommonPostTypeOpts } from '../components/PostsList'
import { Post } from '../interface'
import { usePostDateStatus } from '../lib/hooks'

export type PostCardWaveOpts = {
  colorIndex?: number
  humanizeDate?: boolean
} & CommonPostTypeOpts

type PostCardWaveProps = {
  post: Post
  options?: PostCardWaveOpts
}

export default function PostCardWave(props: PostCardWaveProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)

  return (
    <Link href={props.post.uri || '/'}>
      <div className="post-card-wave group gap-2">
        <span
          className={cn(
            options?.fontClassName,
            'card-title group-hover:m2it-link-hover text-slate-800',
            'leading-[1.35] text-[0.95rem]'
          )}
        >
          {props.post.title}
        </span>
        {(post.createdDate || post.date) && (
          <div className="gap-2 items-center">
            {['updated', 'updatedWithin'].includes(status) && post.date && (
              <div
                className={cn(
                  'px-3 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap gap-1 items-center',
                  {
                    'bg-slate-200 text-slate-800': status === 'updated',
                    'bg-green-200 text-green-900': status === 'updatedWithin',
                    'hidden md:flex': status !== 'updatedWithin'
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
              <div className="px-3 py-0.5 text-[0.7rem] rounded-md whitespace-nowrap bg-amber-200 text-amber-900">
                {options?.newLabel || 'new'}
              </div>
            )}
          </div>
        )}
        <div className="bottom-wave">
          <svg
            className="waves"
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
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.1)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="0"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.05)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="3"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.01)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="5"
              ></use>
              <use
                fill={`rgba(${waveColors[getColorIndex(options?.colorIndex)]}, 0.005)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="7"
              ></use>
            </g>
          </svg>
        </div>
      </div>
    </Link>
  )
}

const waveColors = [
  '0, 0, 255',
  '255, 0, 166',
  '0, 0, 0',
  '166, 82, 0',
  '0, 120, 0',
  '166, 0, 82',
  '166, 0, 255',
  '0, 139, 139',
  '0, 255, 255',
  '0, 255, 166',
  '166, 255, 0'
]

const getColorIndex = (index?: number) => {
  return (index || 0) % waveColors.length
}
