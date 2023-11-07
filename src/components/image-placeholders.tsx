import cn from 'classnames'
import React from 'react'

import AiOutlineLoading3Quarters from '../icons/AiOutlineLoading3Quarters'

export function ImagePlaceholderPostHeader() {
  return (
    <div
      className={cn(
        'bg-gray-100 flex items-center justify-center animate-pulse w-full h-full',
        'flex flex-col'
      )}
    >
      <AiOutlineLoading3Quarters className="text-[70px] text-slate-400 animate-spin" />
    </div>
  )
}
