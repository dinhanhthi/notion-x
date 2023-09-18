'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ExtendedRecordMap } from 'notion-types'
// import { useMemo } from 'react'
import * as React from 'react'

import { NotionRenderer } from '../renderer'

type PostBodyProps = {
  recordMap: ExtendedRecordMap
  className?: string
}

const Equation = dynamic(() => import('../third-party/equation'))
const Code = dynamic(() => import('../third-party/code'), { ssr: false })

export default function PostBody(props: PostBodyProps) {
  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      // Collection,
      Equation
      // Pdf,
      // Modal,
      // Tweet,
      // Header: NotionPageHeader,
      // propertyLastEditedTimeValue,
      // propertyTextValue,
      // propertyDateValue
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
        showTableOfContents={true}
        minTableOfContentsItems={3}
        disableHeader={true}
      />
    </>
  )
}
