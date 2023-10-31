import cn from 'classnames'
import { get } from 'lodash'
import * as types from 'notion-types'
import {
  getBlockIcon,
  getBlockParentPage,
  getPageTableOfContents,
  getTextContent,
  uuidToId
} from 'notion-utils'
import * as React from 'react'

import BsCheckSquare from '../icons/BsCheckSquare'
import BsSquare from '../icons/BsSquare'
import CiLink from '../icons/CiLink'
import { useNotionContext } from '../lib/context'
import { generateAnchor } from '../lib/helpers'
import { cs, getListNumber, isUrl } from '../lib/utils'
import BlockCallout from './BlockCallout'
import BlockToggle from './BlockToggle'
import BlockVideo from './BlockVideo'
import PostToc from './PostToc'
import BlockHeadingToggle from './ToggleHeading'
import { AssetWrapper } from './asset-wrapper'
import { Audio } from './audio'
import { EOI } from './eoi'
import { File } from './file'
import { GoogleDrive } from './google-drive'
import { LazyImage } from './lazy-image'
import { PageAside } from './page-aside'
import { PageIcon } from './page-icon'
import { PageTitle } from './page-title'
import { SyncPointerBlock } from './sync-pointer-block'
import { Text } from './text'

interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean

  children?: React.ReactNode
}

export const basicBlockGap = cn('my-4')

// TODO: use react state instead of a global for this
const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

const pageCoverStyleCache: Record<string, object> = {}

export const Block: React.FC<BlockProps> = props => {
  const ctx = useNotionContext()
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon,
    defaultPageCoverPosition,
    blockOptions,
    customPreviewImage
  } = ctx

  const [activeSection, setActiveSection] = React.useState(null)

  const {
    block,
    children,
    level,
    className,
    bodyClassName,
    header,
    footer,
    pageFooter,
    pageAside,
    hideBlockId,
    disableHeader
  } = props

  if (!block) {
    return null
  }

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  const blockId = hideBlockId ? 'notion-block' : `notion-block-${uuidToId(block.id)}`

  switch (block.type) {
    case 'collection_view_page':
    // fallthrough
    case 'page':
      if (level === 0) {
        const {
          page_cover_position = defaultPageCoverPosition,
          page_full_width,
          page_small_text
        } = block.format || {}

        if (fullPage) {
          const coverPosition = (1 - (page_cover_position || 0.5)) * 100
          const pageCoverObjectPosition = `center ${coverPosition}%`
          let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition]
          if (!pageCoverStyle) {
            pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
              objectPosition: pageCoverObjectPosition
            }
          }

          const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon
          const isPageIconUrl = pageIcon && isUrl(pageIcon)

          const tocs = getPageTableOfContents(block as types.PageBlock, recordMap)

          const hasToc = showTableOfContents && tocs.length >= minTableOfContentsItems
          const hasAside = (hasToc || pageAside) && !page_full_width

          return (
            <div
              className={cs(
                'notion',
                'notion-app',
                darkMode ? 'dark-mode' : 'light-mode',
                blockId,
                className
              )}
            >
              <div className="notion-viewport" />

              <div className="notion-frame">
                {!disableHeader && <components.Header block={block} />}
                {header}

                <div className="notion-page-scroller">
                  <main
                    className={cs(
                      'notion-page m2it-prose',
                      isPageIconUrl ? 'notion-page-has-image-icon' : 'notion-page-has-text-icon',
                      'notion-full-page',
                      page_full_width && 'notion-full-width',
                      page_small_text && 'notion-small-text',
                      bodyClassName
                    )}
                  >
                    {block.type !== 'collection_view_page' && (
                      <div
                        className={cs(
                          'notion-page-content',
                          hasAside && ('notion-page-content-has-aside' as any),
                          hasToc && 'notion-page-content-has-toc'
                        )}
                      >
                        <article className="notion-page-content-inner">
                          <PostToc
                            recordMap={recordMap}
                            tocs={tocs}
                            inPost={true}
                            labelTocTitle={blockOptions?.labelTocTitle ?? 'In this note'}
                            minNumHeadingsToShowToc={blockOptions?.minNumHeadingsToShowToc}
                          />
                          {children}
                        </article>

                        {hasAside && (
                          <PageAside
                            toc={tocs}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection as any}
                            hasToc={hasToc}
                            hasAside={hasAside}
                            pageAside={pageAside}
                          />
                        )}
                      </div>
                    )}

                    {pageFooter}
                  </main>

                  {footer}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <main
              className={cs(
                'notion',
                darkMode ? 'dark-mode' : 'light-mode',
                'notion-page',
                page_full_width && 'notion-full-width',
                page_small_text && 'notion-small-text',
                blockId,
                className,
                bodyClassName
              )}
            >
              <div className="notion-viewport" />
              {pageFooter}
            </main>
          )
        }
      } else {
        const blockColor = block.format?.block_color

        return (
          <components.PageLink
            className={cs('notion-page-link', blockColor && `notion-${blockColor}`, blockId)}
            href={mapPageUrl(block.id)}
          >
            <PageTitle block={block} />
          </components.PageLink>
        )
      }

    case 'header':
    // fallthrough
    case 'sub_header':
    // fallthrough
    case 'sub_sub_header': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color
      const id = uuidToId(block.id)
      const title = getTextContent(block.properties.title) || `Notion Header ${id}`
      const anchor = generateAnchor(id, title)

      // we use a cache here because constructing the ToC is non-trivial
      let indentLevel = tocIndentLevelCache[block.id]
      let indentLevelClass = ''

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap)

        if (page) {
          const toc = getPageTableOfContents(page, recordMap)
          const tocItem = toc.find(tocItem => tocItem.id === block.id)

          if (tocItem) {
            indentLevel = tocItem.indentLevel
            tocIndentLevelCache[block.id] = indentLevel
          }
        }
      }

      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`
      }

      const isH1 = block.type === 'header'
      const isH2 = block.type === 'sub_header'
      const isH3 = block.type === 'sub_sub_header'

      const classNameStr = cs(
        isH1 && 'notion-h notion-h1',
        isH2 && 'notion-h notion-h2',
        isH3 && 'notion-h notion-h3',
        blockColor && `notion-${blockColor}`,
        indentLevelClass,
        blockId
      )

      const innerHeader = (
        <>
          <span className="notion-h-title">
            <Text ignoreMarkup={['b']} value={block.properties.title} block={block} />
          </span>
          {!block.format?.toggleable && (
            <a
              className={cn('opacity-0 group-hover:opacity-100')}
              href={`#${anchor}`}
              title={title}
            >
              <CiLink />
            </a>
          )}
        </>
      )
      let headerBlock = <></>

      const headingCommonClasss = cn(
        '!my-0 flex items-center gap-2',
        blockOptions?.headingScrollMarginTopClass ?? 'scroll-mt-[70px]'
      )

      if (isH1) {
        headerBlock = (
          <h1 id={anchor} className={cn(classNameStr, headingCommonClasss)} data-id={id}>
            {innerHeader}
          </h1>
        )
      } else if (isH2) {
        headerBlock = (
          <h2 id={anchor} className={cn(classNameStr, headingCommonClasss)} data-id={id}>
            {innerHeader}
          </h2>
        )
      } else {
        headerBlock = (
          <h3
            id={anchor}
            className={cn(classNameStr, headingCommonClasss, 'my-0 group')}
            data-id={id}
          >
            {innerHeader}
          </h3>
        )
      }

      if (block.format?.toggleable) {
        return (
          <BlockHeadingToggle
            className={cn('heading-container group', {
              'border-l-[2px] rounded-l-sm py-1 border-sky-300 from-sky-50 to-white bg-gradient-to-r':
                isH2,
              'mt-8': isH2 || isH1,
              'mt-6': isH3
            })}
            headingElement={headerBlock}
          >
            {children}
          </BlockHeadingToggle>
        )
      } else {
        return (
          <div
            className={cn('heading-container mb-4 group', {
              'pl-2 border-l-[2px] rounded-l-sm py-1 border-sky-300 from-sky-50 to-white bg-gradient-to-r':
                isH2,
              'mt-8': isH2 || isH1,
              'mt-6': isH3
            })}
          >
            {headerBlock}
          </div>
        )
      }
    }

    case 'divider':
      return <hr className={cs('notion-hr', blockId)} />

    case 'text': {
      if (!block.properties && !block.content?.length) {
        return <div className={cs('notion-blank', blockId)}>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <div
          className={cs(
            'notion-text',
            basicBlockGap,
            blockColor && `notion-${blockColor}`,
            blockId
          )}
        >
          {block.properties?.title && <Text value={block.properties.title} block={block} />}

          {children && <div className="notion-text-children">{children}</div>}
        </div>
      )
    }

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list': {
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === 'bulleted_list' ? (
          <ul className={cs('notion-list', 'notion-list-disc', blockId)}>{content}</ul>
        ) : (
          <ol start={start} className={cs('notion-list', 'notion-list-numbered', blockId)}>
            {content}
          </ol>
        )

      let output: JSX.Element | null = null

      if (block.content) {
        output = (
          <>
            {block.properties && (
              <li>
                <Text value={block.properties.title} block={block} />
              </li>
            )}
            {wrapList(children)}
          </>
        )
      } else {
        output = block.properties ? (
          <li>
            <Text value={block.properties.title} block={block} />
          </li>
        ) : null
      }

      const isTopLevel = block.type !== recordMap.block[block.parent_id]?.value?.type
      const start = getListNumber(block.id, recordMap.block)

      return isTopLevel ? wrapList(output, start) : output
    }

    case 'embed':
      return <components.Embed blockId={blockId} block={block} />
    // case 'replit':
    // fallthrough
    case 'tweet':
    // fallthrough
    case 'maps':
    // fallthrough
    case 'pdf':
    // fallthrough
    case 'figma':
    // fallthrough
    case 'typeform':
    // fallthrough
    case 'codepen':
    // fallthrough
    case 'excalidraw':
    // fallthrough
    case 'image':
    // fallthrough
    case 'gist':
      return (
        <AssetWrapper blockId={blockId} block={block} customPreviewImage={customPreviewImage} />
      )

    case 'video':
      return (
        <BlockVideo
          className={cn(blockId, basicBlockGap)}
          caption={<Text value={block.properties.caption!} block={block} />}
          videoUrl={block?.properties?.source?.[0]?.[0]}
        />
      )

    case 'drive': {
      const properties = block.format?.drive_properties
      if (!properties) {
        // check if this drive actually needs to be embeded ex. google sheets.
        if (block.format?.display_source) {
          return <AssetWrapper blockId={blockId} block={block} />
        }
      }

      return <GoogleDrive block={block as types.GoogleDriveBlock} className={blockId} />
    }

    case 'audio':
      return <Audio block={block as types.AudioBlock} className={blockId} />

    case 'file':
      return <File block={block as types.FileBlock} className={blockId} />

    case 'equation':
      return (
        <components.Equation
          block={block as types.EquationBlock}
          inline={false}
          className={cn(blockId, basicBlockGap)}
        />
      )

    case 'code':
      return <components.Code block={block as types.CodeBlock} className={basicBlockGap} />

    case 'column_list': {
      return (
        <div className={cn('md:flex md:flex-nowrap md:gap-4 md:-my-2', blockId)}>{children}</div>
      )
    }

    case 'column': {
      const ratio = block.format?.column_ratio
      const parent = recordMap.block[block.parent_id]?.value
      const nCols = parent?.content?.length || 1
      let width = '100%'
      if (!ratio || ratio === 1 || nCols >= 5) width = `${100 / nCols}%`
      else width = `${ratio * 100}%`

      return (
        <div className={cn('!min-w-full md:!min-w-0')} style={{ width }}>
          {children}
        </div>
      )
    }

    case 'quote': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color

      return (
        <blockquote
          className={cn(
            'notion-quote',
            {
              [`notion-${blockColor}`]: blockColor,
              'text-[115%]': get(block, 'format.quote_size') === 'large'
            },
            blockId
          )}
        >
          <div className={cn('quote-title')}>
            <Text value={block.properties.title} block={block} />
          </div>
          <div className="quote-children">{children}</div>
        </blockquote>
      )
    }

    // case 'collection_view':
    //   return <components.Collection block={block} className={blockId} ctx={ctx} />

    case 'callout':
      if (components.Callout) {
        return <components.Callout block={block} className={blockId} />
      } else {
        return (
          <BlockCallout
            className={basicBlockGap}
            icon={<PageIcon block={block} />}
            text={<Text value={block.properties?.title} block={block} />}
            color={block.format?.block_color}
          >
            {children}
          </BlockCallout>
        )
      }

    case 'bookmark': {
      if (!block.properties) return null

      const link = block.properties.link
      if (!link || !link[0]?.[0]) return null

      let title = getTextContent(block.properties.title)
      if (!title) {
        title = getTextContent(link)
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title)
            title = url.hostname
          } catch (err) {
            // ignore invalid links
          }
        }
      }

      return (
        <div className={cn(basicBlockGap)}>
          <a
            className={cn(
              'flex gap-4 w-full overflow-hidden rounded-md border border-slate-200 p-3',
              'hover:cursor-pointer hover:border-sky-300 hover:shadow-sm'
            )}
            href={link[0][0]}
            target="_blank"
            rel="noreferrer"
          >
            <div className="flex flex-[4_1_180px] flex-col justify-between gap-4 overflow-hidden">
              <div className="flex flex-col gap-1.5">
                {title && (
                  <div className="truncate font-normal">
                    <Text value={[[title]]} block={block} />
                  </div>
                )}
                {block.properties?.description && (
                  <div className="truncate text-sm font-normal text-slate-600">
                    <Text value={block.properties?.description} block={block} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {block.format?.bookmark_icon && (
                  <div className="relative h-4 w-4 shrink-0">
                    <LazyImage src={mapImageUrl(block.format?.bookmark_icon, block)} alt={title} />
                  </div>
                )}
                <div className="text-sm font-normal text-slate-500 truncate">
                  <Text value={link} block={block} />
                </div>
              </div>
            </div>
            {block.format?.bookmark_cover && (
              <div className="relative hidden flex-[1_1_100px] sm:block">
                <LazyImage
                  src={mapImageUrl(block.format?.bookmark_cover, block)}
                  alt={getTextContent(block.properties?.title)}
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </a>
        </div>
      )
    }

    case 'toggle':
      return (
        <BlockToggle
          className={basicBlockGap}
          text={<Text value={block.properties?.title} block={block} />}
          color={get(block, 'format.block_color')}
        >
          {children}
        </BlockToggle>
      )

    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap)
      if (!page) return null

      const toc = getPageTableOfContents(page, recordMap)
      const blockColor = block.format?.block_color

      return (
        <div
          className={cs('notion-table-of-contents', blockColor && `notion-${blockColor}`, blockId)}
        >
          {toc.map(tocItem => (
            <a
              key={tocItem.id}
              href={`#${uuidToId(tocItem.id)}`}
              className="notion-table-of-contents-item"
            >
              <span
                className="notion-table-of-contents-item-body"
                style={{
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 24
                }}
              >
                {tocItem.text}
              </span>
            </a>
          ))}
        </div>
      )
    }

    case 'to_do': {
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes'

      return (
        <div className={cs('notion-to-do', blockId)}>
          <div className="flex items-baseline gap-2 my-2">
            <div className="w-4 h-4">
              {isChecked && <BsCheckSquare className="text-slate-500 mt-0.5" />}
              {!isChecked && <BsSquare className="mt-0.5" />}
            </div>
            <Text value={block.properties?.title} block={block} />
          </div>

          <div className="notion-to-do-children pl-6">{children}</div>
        </div>
      )
    }

    case 'transclusion_container':
      return <div className={cs('notion-sync-block', blockId)}>{children}</div>

    case 'transclusion_reference':
      return <SyncPointerBlock blockObj={block} levelObj={level + 1} {...props} />

    case 'alias': {
      const blockPointerId = block?.format?.alias_pointer?.id
      const linkedBlock = recordMap.block[blockPointerId]?.value
      if (!linkedBlock) {
        console.log('"alias" missing block', blockPointerId)
        return null
      }

      return (
        <components.PageLink
          className={cs('notion-page-link', blockPointerId)}
          href={mapPageUrl(blockPointerId)}
        >
          <PageTitle block={linkedBlock} />
        </components.PageLink>
      )
    }

    case 'table':
      return (
        <div className={cn(basicBlockGap, 'overflow-auto m2it-scrollbar')}>
          <table className={cs('notion-simple-table table-auto my-0', blockId)}>
            <tbody
              className={cn({
                table_block_column_header: block?.format?.table_block_column_header,
                table_block_row_header: get(block, 'format.table_block_row_header', false)
              })}
            >
              {children}
            </tbody>
          </table>
        </div>
      )

    case 'table_row': {
      const tableBlock = recordMap.block[block.parent_id]?.value as types.TableBlock
      const order = tableBlock.format?.table_block_column_order
      const formatMap = tableBlock.format?.table_block_column_format
      const backgroundColor = block.format?.block_color

      if (!tableBlock || !order) {
        return null
      }

      return (
        <tr
          className={cs(
            'notion-simple-table-row',
            backgroundColor && `notion-${backgroundColor}`,
            blockId
          )}
        >
          {order.map(column => {
            const color = formatMap?.[column]?.color

            return (
              <td
                key={column}
                className={cn('border border-slate-300', {
                  [`notion-${color}`]: color
                })}
              >
                <div className="notion-simple-table-cell">
                  <Text value={block.properties?.[column] || [['ㅤ']]} block={block} />
                </div>
              </td>
            )
          })}
        </tr>
      )
    }

    case 'external_object_instance': {
      return <EOI block={block} className={blockId} />
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log('Unsupported type ' + (block as any).type, JSON.stringify(block, null, 2))
      }

      return <div />
  }
}
