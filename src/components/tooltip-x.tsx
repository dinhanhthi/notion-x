import React from 'react'
import { Tooltip } from 'react-tooltip'

type TooltipXProps = {
  className?: string
  content: string
  id: string
}

export default function TooltipX(props: TooltipXProps) {
  return (
    <Tooltip
      anchorSelect={`#draft-${props.id}`}
      place="bottom"
      className="!text-sm !px-2 !py-0.5 !rounded-md"
      noArrow={true}
      defaultIsOpen={true}
    >
      {props.content}
    </Tooltip>
  )
}
