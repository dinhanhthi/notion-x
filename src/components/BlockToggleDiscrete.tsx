import cn from 'classnames'
import React from 'react'
import { mapColorClass } from '../lib/helpers'

export default function BlockToggleDiscrete(props: {
  text: React.ReactNode | null
  color?: string
  children?: React.ReactNode
  className?: string
  updatedBlock?: React.JSX.Element
}) {
  return (
    <div
      className={cn(
        mapColorClass(props.color, true),
        props.className,
        'text-[95%] w-full break-inside-avoid'
      )}
    >
      <div className="w-full grid grid-cols-1 rounded-lg shadow-lg overflow-hidden">
        {props.text && (
          <div className="px-4 text-[105%] py-2.5 bg-slate-500 text-white">{props.text}</div>
        )}
        <div className={'discrete-content-container p-4'}>{props.children}</div>
      </div>
    </div>
  )
}
