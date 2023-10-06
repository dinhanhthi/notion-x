'use client'

import { Disclosure, Transition } from '@headlessui/react'
import cn from 'classnames'
import React from 'react'

import { basicBlockGap } from '../components/block'
import BsFillCaretRightFill from '../icons/BsFillCaretRightFill'
import { mapColorClass } from '../lib/helpers'

export default function BlockToggle(props: {
  text: React.ReactNode
  color?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        mapColorClass(props.color),
        'toggle-container rounded-md border-[0.5px] border-slate-200',
        props.className
      )}
    >
      <Disclosure defaultOpen={false}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={cn('toggle-button flex gap-2 w-full items-start p-2 rounded-md', {
                'bg-gray-100 hover:bg-gray-200 toggle-open': open && !props.color,
                'bg-gray-50 hover:bg-gray-100': !open && !props.color,
                'bg-[#0000000a]': !!props.color
              })}
            >
              <BsFillCaretRightFill
                className={cn(
                  'mt-[3px] text-lg transform ease-in-out transition-all duration-[400ms]',
                  {
                    'rotate-90': open,
                    'rotate-0': !open
                  }
                )}
              />
              <div className="text-start">{props.text}</div>
            </Disclosure.Button>
            {!!props.children && (
              <Transition
                enter="transition duration-200 ease-in-out"
                enterFrom="transform scale-y-95 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-200 ease-in-out"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-95 opacity-0"
              >
                <Disclosure.Panel className={'px-4 inside-toggle-container'}>
                  <div className={cn(basicBlockGap)}></div>
                  {props.children}
                  <div className={cn(basicBlockGap)}></div>
                </Disclosure.Panel>
              </Transition>
            )}
          </>
        )}
      </Disclosure>
    </div>
  )
}
