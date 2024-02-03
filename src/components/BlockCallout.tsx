import cn from 'classnames'
import React from 'react'

import { mapColorClass } from '../lib/helpers'

export default function BlockCallout(props: {
  text: React.ReactNode
  icon: React.ReactNode
  color?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn(props.className, 'block-callout')}>
      <div
        className={cn('flex rounded-md', mapColorClass(props.color) || 'border border-gray-200')}
      >
        {props.icon && <div className="text-2xl pl-4 py-3">{props.icon}</div>}
        <div className="pl-2 pr-4 w-0 flex-1">
          <div className="mt-4 mb-3">{props.text}</div>
          {!!props.children && <div className="m2it-inside-box">{props.children}</div>}
          <div className="my-4"></div>
        </div>
      </div>
    </div>
  )
}
