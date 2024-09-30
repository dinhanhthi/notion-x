import React from 'react'
import { Tooltip } from 'react-tooltip'

type TooltipXProps = {
  className?: string
  id: string
  children: React.ReactNode
  defaultIsOpen?: boolean
}

export default function TooltipX(props: TooltipXProps) {
  return (
    <Tooltip
      anchorSelect={props.id}
      place="bottom"
      className="!text-sm !px-2 !py-0.5 !rounded-md !z-[9999]"
      noArrow={true}
      defaultIsOpen={props.defaultIsOpen}
    >
      {props.children}
    </Tooltip>
  )
}
