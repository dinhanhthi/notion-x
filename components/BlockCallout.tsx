import cn from 'classnames'

import { mapColorClass } from '../helpers'

export default function BlockCallout(props: {
  text: React.ReactNode
  icon: React.ReactNode
  color?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn(props.className)}>
      <div
        className={cn('flex rounded-md', mapColorClass(props.color) || 'border border-gray-200')}
      >
        {props.icon && <div className="text-2xl pl-4 py-3">{props.icon}</div>}
        <div className="py-4 pl-2 pr-4 w-full">
          {props.text}
          {!!props.children && <div className="pt-2 m2it-inside-box">{props.children}</div>}
        </div>
      </div>
    </div>
  )
}
