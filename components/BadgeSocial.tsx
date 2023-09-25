'use client'

import cn from 'classnames'

import { ImageType } from '../interface'
import ImageComponent from './ImageComponent'

export type BadgeSocialProps = {
  id?: string
  icon: ImageType
  url: string
  title: string
  imgClass?: string
}

export default function BadgeSocial(props: BadgeSocialProps) {
  return (
    <>
      <a
        className={`
        group block h-12 w-12 rounded-2xl bg-gray-700 p-2
        shadow-none md:h-10 md:w-10 md:p-1.5 tooltip-auto
      `}
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        data-title={props.title}
      >
        <ImageComponent
          image={props.icon}
          alt={props.title}
          className={cn(
            'w-16 h-16 rounded-full transition-transform duration-200 group-hover:-translate-y-0.5',
            props.imgClass
          )}
          imageProps={{ width: 64, height: 64 }}
        />
      </a>
    </>
  )
}
