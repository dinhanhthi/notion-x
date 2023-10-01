'use client'

import cn from 'classnames'
import React from 'react'

import { ImageType } from '../interface'
import ImageComponent from './ImageComponent'

export type TechItem = {
  id: string
  name: string
  icon: ImageType
  url: string
  imgClass?: string
}

type BadgeTechProps = {
  tech: TechItem
  hideText?: boolean
  useLink?: boolean
  hideTooltip?: boolean
}

export default function BadgeTech(props: BadgeTechProps) {
  const containerClass = cn(
    `flex h-6 w-fit items-center justify-center rounded-md border bg-slate-100 px-1
  align-baseline text-base text-[#1e293b] shadow-sm transition
  duration-200 ease-in-out hover:-translate-y-0.5`,
    {
      'tooltip-auto': !props.hideTooltip
    }
  )

  const children = () => (
    <>
      <ImageComponent
        image={props.tech.icon}
        alt={props.tech.name}
        className={cn('w-[18px] h-[18px]', props.tech.imgClass)}
        imageProps={{ width: 32, height: 32 }}
      />
      {!props.hideText && (
        <span className="ml-1.5 whitespace-nowrap text-[81%] tracking-wide">{props.tech.name}</span>
      )}
    </>
  )

  return (
    <>
      {props.useLink && (
        <a className={containerClass} href={props.tech.url} data-title={props.tech.name}>
          {children()}
        </a>
      )}
      {!props.useLink && (
        <div className={containerClass} data-title={props.tech.name}>
          {children()}
        </div>
      )}
    </>
  )
}
