import {
  RichTextItemResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import cn from 'classnames'
import slugify from 'slugify'
import * as types from 'notion-types'

import { AnnotationIgnoreField, Post, Tag } from './interface'

export function generateAnchor(blockId: string, text: string) {
  return `${makeSlugText(text)}-${blockId.slice(-5)}`
}

export function makeSlugText(text?: string | null): string | undefined {
  if (!text) return undefined
  return slugify(text, {
    lower: true,
    locale: 'vi',
    remove: /[:?&".,/\\]/g
  })
}

export function mapTag(tagName: string, tagPrefix: string): Tag {
  if (!tagName) throw new Error('tagName is required')
  return {
    id: makeSlugText(tagName),
    name: tagName,
    slug: makeSlugText(tagName),
    uri: `/${tagPrefix}/${makeSlugText(tagName)}/`
  }
}

export function mapColorClass(color?: string): string | null {
  switch (color) {
    case 'gray':
      return 'text-gray-500'
    case 'brown':
      return 'text-brown-500'
    case 'orange':
      return 'text-orange-500'
    case 'yellow':
      return 'text-yellow-500'
    case 'green':
      return 'text-emerald-600'
    case 'blue':
      return 'text-blue-500'
    case 'purple':
      return 'text-purple-500'
    case 'pink':
      return 'text-pink-500'
    case 'red':
      return 'text-red-500'
    // Highlight
    case 'gray_background':
      return 'bg-gray-100'
    case 'brown_background':
      return 'bg-[#f4eeee]'
    case 'orange_background':
      return 'bg-orange-100'
    case 'yellow_background':
      return 'bg-amber-100'
    case 'green_background':
      return 'bg-[#deffdb]'
    case 'blue_background':
      return 'bg-blue-100'
    case 'purple_background':
      return 'bg-purple-100'
    case 'pink_background':
      return 'bg-pink-100'
    case 'red_background':
      return 'bg-red-100'
    case 'teal_background':
      return 'bg-teal-100'
    default:
      return null
  }
}

export function mapNoteUri(postSlug: string): string {
  return `/note/${postSlug}/`
}

export function removeBaseUrl(url: string) {
  const baseUrlRegex = /^(https?:\/\/[^/]+)/
  const matches = url.match(baseUrlRegex)
  if (matches && matches.length > 1) {
    const baseUrl = matches[1]
    return url.replace(baseUrl, '')
  }
  return url
}

export function cleanText(text?: string) {
  if (!text) return undefined
  return text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Convert "7c2e54318e52416ca5769831454bf08d" or "7c2e5431-8e52-416c-a576-9831454bf08d"
 * to "7c2e5431-8e52-416c-a576-9831454bf08d"
 */
export function idToUuid(id: string): string | null {
  if (!id) {
    return null
  }

  id = id.split('?')[0]
  const match = id.match(/\b([a-f0-9]{32})\b/)

  if (match) {
    return `${id.slice(0, 8)}-${id.slice(8, 4 + 8)}-${id.slice(12, 4 + 12)}-${id.slice(
      16,
      4 + 16
    )}-${id.slice(20)}`
  }

  const match2 = id.match(/\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/)
  if (match2) {
    return match2[1]
  }

  return null
}

export function generateTextAnnotationClasses(
  annotations: TextRichTextItemResponse['annotations'],
  ignore?: AnnotationIgnoreField[]
): string {
  return cn({
    'font-semibold': annotations.bold && !ignore?.includes('bold'),
    italic: annotations.italic && !ignore?.includes('italic'),
    'underline underline-offset-4': annotations.underline && !ignore?.includes('underline'),
    'line-through': annotations.strikethrough && !ignore?.includes('strikethrough'),
    'font-mono text-[85%] bg-[#ececec] text-[#067b26] p-[1px_4px_2px_4px] rounded break-words border-[1px_solid_#ddd]':
      annotations.code && !ignore?.includes('code'),
    [mapColorClass(annotations.color) as any]: true && !ignore?.includes('color')
  })
}

export function getJoinedRichText(richTextArr?: RichTextItemResponse[]): string {
  if (!richTextArr || !richTextArr.length) return ''
  const textArr = richTextArr.map((richText: RichTextItemResponse) => richText.plain_text)
  return textArr.join('')
}

export function isDateAfter(date1?: string, date2?: string): boolean {
  if (!date1 || !date2) return false
  const dateOne = new Date(date1).setHours(0, 0, 0, 0)
  const dateTwo = new Date(date2).setHours(0, 0, 0, 0)
  return dateOne > dateTwo
}

/**
 * Get a right start_cursor for pagination based on current page and posts
 * @param posts
 * @param postsPerPage
 * @param currentPage
 * @returns next_cursor or `undefined` (it has to be `undefined`, not `null` because
 * Notion API doesn't accept `null` value for `start_cursor`)
 */
export function getStartCursorForCurrentPage(
  currentPage: number,
  posts: Post[],
  postsPerPage: number
): string | undefined {
  if (posts?.length === 0) return undefined
  if (currentPage === 1) return undefined
  const numPages = Math.ceil(posts.length / postsPerPage)
  if (currentPage > numPages) return undefined
  return posts[(currentPage - 1) * postsPerPage]?.id
}

export function getCreatedDate(block: types.Block, createdId: string) {
  const _cDf =
    block.properties?.[`${createdId}`]?.[0]?.[1]?.[0]?.[1]?.[
      'start_date'
    ]
  const createdDateField = _cDf ? new Date(_cDf).toISOString() : null
  const created_time = new Date(block.created_time).toISOString()
  return createdDateField || created_time
}

export function getModifedDate(block: types.Block, modifiedId: string) {
  const _mDf =
    block.properties?.[`${modifiedId}`]?.[0]?.[1]?.[0]?.[1]?.[
      'start_date'
    ]
  const modifiedDateField = _mDf ? new Date(_mDf).toISOString() : null
  const last_edited_time = new Date(block.last_edited_time).toISOString()
  return modifiedDateField || last_edited_time
}