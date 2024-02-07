import cn from 'classnames'
import React from 'react'
import { mapColorClass } from '../lib/helpers'

export default function BlockToggleDiscrete(props: {
  text: React.ReactNode | null
  color?: string
  children?: React.ReactNode
  className?: string
  updateStatus?: 'updated' | 'new'
}) {
  return (
    <div
      className={cn(
        mapColorClass(props.color, true),
        props.className,
        'text-[95%] w-full break-inside-avoid rounded-lg shadow-lg overflow-hidden discrete-container'
      )}
    >
      {props.text && (
        <div className="px-4 text-[105%] py-2.5 border-b border-[#86aecd] text-sky-800 font-medium relative discrete-header-container">
          {props.text}
          {props.updateStatus && (
            <div
              className={cn('absolute right-0 top-0 text-xs px-2 rounded-bl-md', {
                'text-green-900 bg-green-200': props.updateStatus === 'updated',
                'text-amber-900 bg-amber-200': props.updateStatus === 'new'
              })}
            >
              {props.updateStatus}
            </div>
          )}
        </div>
      )}
      <div
        className={cn('discrete-content-container p-4', {
          relative: !props.text
        })}
      >
        {props.children}
        {!props.text && props.updateStatus && (
          <div
            className={cn('absolute right-0 top-0 text-xs px-2 rounded-bl-md', {
              'text-green-900 bg-green-200': props.updateStatus === 'updated',
              'text-amber-900 bg-amber-200': props.updateStatus === 'new'
            })}
          >
            {props.updateStatus}
          </div>
        )}
      </div>
    </div>
  )
}
