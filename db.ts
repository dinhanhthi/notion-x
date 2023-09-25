import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import got from 'got'
import { get, set } from 'lodash'
import { SearchParams } from 'notion-types'
import ogs from 'open-graph-scraper'
import { getPlaiceholder } from 'plaiceholder'

import { cleanText, idToUuid } from './helpers'
import { BookmarkPreview, NotionSorts } from './interface'

export const notionMaxRequest = 100

/**
 * We needs this method to be used in outside-nextjs environment. For example, in ./scripts/ud_images.ts
 *
 */
export async function getNotionDatabaseWithoutCache(
  dataId: string,
  notionToken: string,
  notionVersion: string,
  filter?: QueryDatabaseParameters['filter'],
  startCursor?: string,
  pageSize?: number,
  sorts?: NotionSorts[]
): Promise<QueryDatabaseResponse | undefined> {
  try {
    const url = `https://api.notion.com/v1/databases/${dataId}/query`
    const requestBody = {
      filter,
      sorts,
      start_cursor: startCursor,
      page_size: pageSize
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': notionVersion as string,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    return res.json()
  } catch (error: any) {
    console.error(error)
    // Retry after a number of seconds in the returned header
    const retryAfter = error?.response?.headers['retry-after'] || error['retry-after']
    if (retryAfter) {
      console.log(`Retrying after ${retryAfter} seconds`)
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000 + 500))
      return await getNotionDatabaseWithoutCache(
        dataId,
        notionToken,
        notionVersion,
        filter,
        startCursor,
        pageSize,
        sorts
      )
    }
    return
  }
}

/**
 * This methods will get all posts from a Notion database. Especially, when the number of posts is
 * greater than 100, we need to use the "has_more" and "next_cursor" to get all posts.
 *
 * TODO: Update the client's usage to use this method instead of getNotionDatabaseWithoutCache()
 */
export async function getPostsWithoutCache(options: {
  dbId: string
  notionToken: string
  notionVersion: string
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
}): Promise<any[]> {
  const { dbId, notionToken, notionVersion, filter, startCursor, pageSize, sorts } = options

  let data = await getNotionDatabaseWithoutCache(
    dbId,
    notionToken,
    notionVersion,
    filter,
    startCursor,
    pageSize,
    sorts
  )

  let postsList = get(data, 'results', []) as any[]

  if (data && pageSize && data['has_more'] && data['next_cursor'] && pageSize >= notionMaxRequest) {
    while (data!['has_more']) {
      data = await getNotionDatabaseWithoutCache(
        dbId,
        notionToken,
        notionVersion,
        filter,
        startCursor,
        pageSize,
        sorts
      )
      if (get(data, 'results')) {
        const lst = data!['results'] as any[]
        postsList = [...postsList, ...lst]
      }
    }
  }
  return postsList
}

/**
 * We needs this method to be used in outside-nextjs environment. For example, in ./scripts/ud_images.ts
 */
export const getNotionPageWithoutCache = async (
  pageId: string,
  notionToken: string,
  notionVersion: string
) => {
  const url = `https://api.notion.com/v1/pages/${pageId}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': notionVersion as string
    }
  })
  return res.json()
}

/**
 * We needs this method to be used in outside-nextjs environment. For example, in ./scripts/ud_images.ts
 */
export const getNotionBlocksWithoutCache = async (
  pageId: string,
  notionToken: string,
  notionVersion: string,
  pageSize?: number,
  startCursor?: string
) => {
  let url = `https://api.notion.com/v1/blocks/${pageId}/children`

  if (pageSize) {
    url += `?page_size=${pageSize}`
    if (startCursor) url += `&start_cursor=${startCursor}`
  } else if (startCursor) url += `?start_cursor=${startCursor}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': notionVersion as string
    }
  })
  return res.json()
}

/**
 * https://developers.notion.com/reference/retrieve-a-database
 */
export async function retrieveNotionDatabaseWithoutCache(
  dataId: string,
  notionToken: string,
  notionVersion: string
) {
  const url = `https://api.notion.com/v1/databases/${dataId}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${notionToken}`,
      'Notion-Version': notionVersion as string
    }
  })
  return res.json()
}

/**
 * Get all nested blocks (in all levels) of a block.
 *
 */
export async function getBlocks(
  blockId: string,
  notionToken: string,
  notionVersion: string,
  initNumbering?: string,
  getPageUri?: (pageId: string) => Promise<string | undefined>,
  parseImgurUrl?: (url: string) => string
): Promise<ListBlockChildrenResponse['results']> {
  let data = await getNotionBlocksWithoutCache(blockId, notionToken, notionVersion)
  let blocks = data?.results as
    | (BlockObjectResponse & {
        list_item?: string
        children?: ListBlockChildrenResponse['results']
        imageInfo?: any
        imgUrl?: string
        bookmark?: BookmarkPreview
      })[]
    | []

  if (!blocks?.length) return []

  if (data && data['has_more']) {
    while (data!['has_more']) {
      const startCursor = data!['next_cursor'] as string
      data = await getNotionBlocksWithoutCache(
        blockId,
        notionToken,
        notionVersion,
        undefined,
        startCursor
      )
      if (get(data, 'results') && get(data, 'results').length) {
        const lst = data!['results'] as any[]
        blocks = [...blocks, ...lst]
      }
    }
  }

  let number = 1
  for (const block of blocks) {
    /**
     * Remark: Consider 2 cases:
     * ++ First:
     * 1. Item 1
     * Paragraph
     * 1. Item 2
     *
     * ++ Second:
     * 1. Item 1
     * 2. Item 2
     *
     * The Notion API doesn't give any information in that Item 1 and Item 2 of the first case are
     * in diffrent uls while in the second case, they are in the same ul.
     *
     * They are both in the same structure.
     * Check: https://developers.notion.com/reference/block#numbered-list-item-blocks
     *
     * That's why we add some additional information to the block.
     */
    if (block.type === 'numbered_list_item') {
      if (initNumbering && ['1', '2', '3'].includes(initNumbering)) initNumbering = undefined
      block['list_item'] = (initNumbering ?? '') + `${number}.`
      number++
    } else {
      number = 1
    }

    if (block.type === 'bulleted_list_item') {
      block['list_item'] = !initNumbering ? '1' : initNumbering === '1' ? '2' : '3'
    }

    if (get(block, `${block.type}.rich_text`) && !!getPageUri) {
      const parsedMention = await parseMention(
        get(block, `${block.type}.rich_text`) as any,
        getPageUri
      )
      set(block, `${block.type}.rich_text`, parsedMention)
    }

    if (block.has_children) {
      const children = await getBlocks(
        block.id,
        notionToken,
        notionVersion,
        block['list_item'],
        getPageUri,
        parseImgurUrl
      )
      block['children'] = children
    }

    // Get real image size (width and height) of an image block
    if (block.type === 'image') {
      const url = get(block, 'image.file.url') || get(block, 'image.external.url')
      if (url) {
        // Resize the image to 1024x1024 max, except for gif and png (with transparent background)
        if (parseImgurUrl) block['imgUrl'] = parseImgurUrl(url)
        block['imageInfo'] = await getPlaceholderImage(url) // { base64, width, height }
      }
    }

    // bookmark
    if (block.type === 'bookmark') {
      const url = get(block, 'bookmark.url')
      if (url) {
        const { result } = await ogs({ url })
        const bookmark: BookmarkPreview = {
          url,
          title: cleanText(result.ogTitle),
          description: cleanText(result.ogDescription) ?? null,
          favicon: result.favicon?.includes('http')
            ? result.favicon
            : result?.ogUrl && result?.favicon
            ? result?.ogUrl + result?.favicon?.replace('/', '')
            : undefined,
          imageSrc: result.ogImage?.[0]?.url ?? null
        }
        block['bookmark'] = bookmark as any
      }
    }
  }

  return blocks
}

async function parseMention(
  richText: RichTextItemResponse[] | [],
  getPageUri?: (pageId: string) => Promise<string | undefined>
): Promise<any> {
  if (!richText?.length) return []
  const newRichText = [] as RichTextItemResponse[]
  for (const block of richText) {
    if (block.type === 'mention' && block.mention?.type === 'page') {
      const pageId = get(block, 'mention.page.id')
      if (pageId && getPageUri) {
        const pageUri = await getPageUri(pageId)
        set(block, 'mention.page.uri', pageUri)
      }
      newRichText.push(block)
    } else {
      newRichText.push(block)
    }
  }
  return newRichText
}

/**
 * Get blurDataURL (base64) of an image
 *
 * REMARK: This method MUST be placed in this file, otherwise, there will be an error of "Can't resolve 'fs'"
 */
export const getPlaceholderImage = async function getPlaceholderImage(src: string) {
  const res = await fetch(src)
  const arrayBuffer = await res.arrayBuffer()
  if (arrayBuffer.byteLength === 0) return { base64: '', width: 0, height: 0 }
  const buffer = await fetch(src).then(async res => Buffer.from(await res.arrayBuffer()))

  const { base64, metadata } = await getPlaiceholder(buffer)
  return { base64, width: metadata.width, height: metadata.height }
}

// Used for unofficial APIs
export async function searchNotion(
  params: SearchParams,
  apiUrl: string,
  tokenV2: string,
  activeUser: string,
  dbId: string
): Promise<any> {
  const headers: any = {
    'Content-Type': 'application/json',
    cookie: `token_v2=${tokenV2}`,
    'x-notion-active-user-header': activeUser
  }

  if (!dbId) {
    throw new Error('dbId is not defined')
  }

  const body = {
    type: 'BlocksInAncestor',
    source: 'quick_find_public',
    ancestorId: idToUuid(dbId),
    sort: {
      field: 'relevance'
    },
    limit: params.limit || 20,
    query: params.query,
    filters: {
      isDeletedOnly: false,
      isNavigableOnly: false,
      excludeTemplates: true,
      requireEditPermissions: false,
      ancestors: [],
      createdBy: [],
      editedBy: [],
      lastEditedTime: {},
      createdTime: {},
      ...params.filters
    }
  }

  const url = `${apiUrl}/search`

  return got
    .post(url, {
      body: JSON.stringify(body),
      headers
    })
    .json()
}
