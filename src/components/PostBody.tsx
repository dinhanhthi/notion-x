'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ExtendedRecordMap } from 'notion-types'
import * as React from 'react'

import { BlockOptionsContextType } from '../lib/context'
import { NotionRenderer } from '../lib/renderer'

type PostBodyProps = {
  recordMap: ExtendedRecordMap
  className?: string
  blockOptions?: BlockOptionsContextType
}

const Equation = dynamic(() => import('./BlockEquation'))
const Code = dynamic(() => import('./BlockCode'), { ssr: false })

// In case we need more suppored components, check this out:
// https://github.com/transitive-bullshit/nextjs-notion-starter-kit/blob/main/components/NotionPage.tsx
export default function PostBody(props: PostBodyProps) {
  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Equation
    }),
    []
  )

  return (
    <>
      <NotionRenderer
        recordMap={props.recordMap}
        fullPage={true}
        darkMode={false}
        components={components}
        showTableOfContents={false}
        minTableOfContentsItems={3}
        disableHeader={true}
        previewImages={true}
        blockOptions={props.blockOptions}
      />
    </>
  )
}