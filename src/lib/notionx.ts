import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

export const notionX = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2
})

export async function getPage(pageId: string) {
  const recordMap = await notionX.getPage(pageId)
  const newRecordMap = await fixMissingBlocks(recordMap)
  return newRecordMap
}

async function fixMissingBlocks(recordMap: ExtendedRecordMap): Promise<ExtendedRecordMap> {
  const brokenBlockIds = [] as any
  for (const blockId of Object.keys(recordMap.block)) {
    const block = recordMap.block[blockId]?.value
    if (!block || block.type !== 'text') {
      continue
    }
    const title = block.properties?.title
    if (!title) {
      continue
    }
    title.map(([_text, decorations], _index) => {
      if (!decorations) {
        return false
      }
      const decorator = decorations[0]
      if (!decorator || decorator[0] !== 'p' || !decorator[1]) {
        return false
      }
      const bId = decorator[1]
      if (!recordMap.block[bId]?.value) {
        brokenBlockIds.push(bId)
        return true
      }
      return false
    })
  }
  const missingBlocks = await notionX.getBlocks(brokenBlockIds)
  const newBlocks = {
    ...recordMap.block,
    ...missingBlocks?.recordMap?.block
  }

  return {
    ...recordMap,
    block: newBlocks
  }
}
