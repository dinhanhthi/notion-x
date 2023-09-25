import cn from 'classnames'
import Link from 'next/link'

import { Post } from '../interface'

export type PostCardWaveOpts = {
  fontClassName?: string
  colorIndex?: number
}

type PostCardWaveProps = {
  post: Post
  options?: PostCardWaveOpts
}

export default function PostCardWave(props: PostCardWaveProps) {
  return (
    <Link href={props.post.uri || '/'}>
      <div className="post-card-wave group">
        <span
          className={cn(
            props.options?.fontClassName,
            'card-title font-semibold group-hover:m2it-link-hover text-slate-800',
            'leading-[1.35] text-[0.95rem]'
          )}
        >
          {props.post.title}
        </span>
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
                fill={`rgba(${waveColors[props.options?.colorIndex || 0]}, 0.1)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="0"
              ></use>
              <use
                fill={`rgba(${waveColors[props.options?.colorIndex || 0]}, 0.05)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="3"
              ></use>
              <use
                fill={`rgba(${waveColors[props.options?.colorIndex || 0]}, 0.01)`}
                x="48"
                xlinkHref="#gentle-wave"
                y="5"
              ></use>
              <use
                fill={`rgba(${waveColors[props.options?.colorIndex || 0]}, 0.005)`}
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
