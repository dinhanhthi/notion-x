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
  updatedBlock?: React.JSX.Element
}) {
  return (
    <div
      className={cn(mapColorClass(props.color), 'toggle-container my-[0.375rem]', props.className)}
    >
      {props.updatedBlock}
      <Disclosure defaultOpen={false}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={cn('toggle-button flex gap-1.5 w-full items-start rounded-md group')}
            >
              <BsFillCaretRightFill
                className={cn(
                  'mt-[2.5px] shrink-0 text-lg transform ease-in-out transition-all duration-[400ms] group-hover:bg-slate-200 rounded-md',
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
                className={'pl-2'}
              >
                <Disclosure.Panel className={'px-4 pt-[0.1px] border-l inside-toggle-container'}>
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
