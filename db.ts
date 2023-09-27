import { Client } from '@notionhq/client'
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

import { cleanText, defaultBlurData, idToUuid } from './helpers'
import { BookmarkPreview, NotionSorts } from './interface'

export const notionMaxRequest = 100

const notion = new Client({ auth: process.env.NOTION_TOKEN })

/**
 * https://developers.notion.com/reference/post-database-query
 */
export async function queryDatabase(opts: {
  dbId: string
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
}): Promise<QueryDatabaseResponse | undefined> {
  const { dbId, filter, startCursor, pageSize, sorts } = opts
  try {
    return await notion.databases.query({
      database_id: dbId,
      filter,
      sorts,
      start_cursor: startCursor,
      page_size: pageSize
    })
  } catch (error: any) {
    console.error(error)
    const retryAfter = error?.response?.headers['retry-after'] || error['retry-after']
    if (retryAfter) {
      console.log(`Retrying after ${retryAfter} seconds`)
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000 + 500))
      return await queryDatabase({ dbId, filter, startCursor, pageSize, sorts })
    }
    return
  }
}

/**
 * https://developers.notion.com/reference/retrieve-a-database
 */
export async function retrieveDatabase(dbId: string) {
  return await notion.databases.retrieve({ database_id: dbId })
}

/**
 * https://developers.notion.com/reference/retrieve-a-page
 */
export const retrievePage = async (pageId: string) => {
  return await notion.pages.retrieve({ page_id: pageId })
}

/**
 * https://developers.notion.com/reference/get-block-children
 */
export const retrieveBlockChildren = async (
  pageId: string,
  pageSize?: number,
  startCursor?: string
) => {
  return await notion.blocks.children.list({
    block_id: pageId,
    page_size: pageSize,
    start_cursor: startCursor
  })
}

export async function getPosts(opts: {
  dbId: string
  filter?: QueryDatabaseParameters['filter']
  startCursor?: string
  pageSize?: number
  sorts?: NotionSorts[]
}): Promise<any[]> {
  const { dbId, filter, startCursor, pageSize, sorts } = opts

  let data = await queryDatabase({ dbId, filter, startCursor, pageSize, sorts })
  let postsList = get(data, 'results', []) as any[]

  if (data && pageSize && data['has_more'] && data['next_cursor'] && pageSize >= notionMaxRequest) {
    while (data!['has_more']) {
      const nextCursor = data!['next_cursor']
      data = await queryDatabase({
        dbId,
        filter,
        startCursor: nextCursor!,
        pageSize,
        sorts
      })
      if (get(data, 'results')) {
        const lst = data!['results'] as any[]
        postsList = [...postsList, ...lst]
      }
    }
  }
  return postsList
}

/**
 * Get all nested blocks (in all levels) of a block.
 *
 */
export async function getBlocks(
  blockId: string,
  initNumbering?: string,
  getPageUri?: (pageId: string) => Promise<string | undefined>,
  parseImgurUrl?: (url: string) => string
): Promise<ListBlockChildrenResponse['results']> {
  let data = await retrieveBlockChildren(blockId)
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
      data = await retrieveBlockChildren(blockId, undefined, startCursor)
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
      const children = await getBlocks(block.id, block['list_item'], getPageUri, parseImgurUrl)
      block['children'] = children
    }

    // Get real image size (width and height) of an image block
    if (block.type === 'image') {
      const url = get(block, 'image.file.url') || get(block, 'image.external.url')
      if (url) {
        if (parseImgurUrl) block['imgUrl'] = parseImgurUrl(url)
        block['imageInfo'] = {
          base64: defaultBlurData.url,
          width: defaultBlurData.width,
          height: defaultBlurData.height
        }
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