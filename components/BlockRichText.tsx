import {
  EquationRichTextItemResponse,
  RichTextItemResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import dynamic from 'next/dynamic'

import { TextIgnoreField } from '../interface'
import BlockText from './BlockText'

const DynamicInlineEquation = dynamic(() => import('./BlockInlineEquation'))

type BlockRichTextProps = {
  richText: RichTextItemResponse
  ignore?: TextIgnoreField[]
  mathFontSize?: string
}

export default function BlockRichText(props: BlockRichTextProps) {
  switch (props.richText.type) {
    case 'text':
    case 'mention':
      return (
        <BlockText richText={props.richText as TextRichTextItemResponse} ignore={props.ignore} />
      )
    case 'equation':
      return (
        <DynamicInlineEquation
          equation={props.richText as EquationRichTextItemResponse}
          fontSize={props.mathFontSize}
        />
      )
    default:
      return <BlockText richText={props.richText as TextRichTextItemResponse} />
  }
}
