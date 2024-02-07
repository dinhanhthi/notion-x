'use client'

import { Disclosure } from '@headlessui/react'
import cn from 'classnames'
import React from 'react'

import BsFillCaretRightFill from '../icons/BsFillCaretRightFill'

type BlockHeadingToggleProps = {
  className?: string
  headingElement: JSX.Element
  anchorRight?: JSX.Element
  children: React.ReactNode
  updatedBlock?: React.JSX.Element
}

export default function BlockHeadingToggle(props: BlockHeadingToggleProps) {
  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div className="relative">
          <div className={cn('flex w-full items-start gap-1', props.className)}>
            {props.updatedBlock}
            <Disclosure.Button className="rounded-md p-1 hover:bg-slate-200 z-20">
              <BsFillCaretRightFill
                className={cn('text-lg transform ease-in-out transition-all duration-[400ms]', {
                  'rotate-90': open,
                  'rotate-0': !open
                })}
              />
            </Disclosure.Button>
            {props.headingElement}
            {props.anchorRight}
          </div>
          <Disclosure.Panel>
            <div className="pl-8">{props.children}</div>
          </Disclosure.Panel>
          <div
            className={cn(
              'absolute h-[calc(100%-8px)] top-0 left-0 w-0 border-sky-100 border-l-2 ml-[12.5px] mt-[14px] z-10',
              {
                hidden: !open
              }
            )}
          ></div>
        </div>
      )}
    </Disclosure>
  )
}
