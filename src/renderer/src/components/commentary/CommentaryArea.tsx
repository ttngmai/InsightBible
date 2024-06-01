import {
  readWriteCommentaryBackgroundColorAtom,
  readWriteCommentaryDataAtom,
  readWriteCommentaryTextColor,
  readWriteFontSizeAtom,
  readWriteVerseAtom
} from '@renderer/store'
import isLight from '@renderer/utils/contrastColor'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useRef } from 'react'
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import tw, { TwStyle } from 'twin.macro'

type CommentaryAreaProps = {
  sx?: TwStyle
}

type CommentaryTextProps = {
  verse: number
  btext: string
  textColor: string
  isLight: boolean
}

const CommentaryText = forwardRef<HTMLDivElement, CommentaryTextProps>(
  ({ verse, btext, textColor, isLight }, ref) => {
    return (
      <div ref={ref} data-verse={verse} css={[tw`flex mb-[1rem]`, verse === 1 && tw`pt-16pxr`]}>
        <p css={[tw`mr-[0.5em]`, isLight ? tw`text-brand-blue-500` : tw`text-white`]}>{verse}</p>
        <p dangerouslySetInnerHTML={{ __html: btext }} style={{ color: textColor }} />
      </div>
    )
  }
)
CommentaryText.displayName = 'CommentaryText'

function CommentaryArea({ sx }: CommentaryAreaProps): JSX.Element | null {
  const verseRefs = useRef<null[] | HTMLDivElement[]>([]) // 각 주석 HTML 요소의 참조 리스트
  const leftPaddingRef = useRef<ImperativePanelHandle>(null) // 왼쪽 패딩 영역 참조
  const rightPaddingRef = useRef<ImperativePanelHandle>(null) // 오른쪽 패딩 영역 참조

  const currentBibleVerse = useAtomValue(readWriteVerseAtom)
  const fontSize = useAtomValue(readWriteFontSizeAtom)
  const commentaryBackgroundColor = useAtomValue(readWriteCommentaryBackgroundColorAtom)
  const commentaryTextColor = useAtomValue(readWriteCommentaryTextColor)
  const commentaryData = useAtomValue(readWriteCommentaryDataAtom)

  // 각 주석 렌더링
  const renderVerseList = (): JSX.Element[] => {
    const result: JSX.Element[] = []
    commentaryData.forEach(({ verse, btext }) => {
      result.push(
        <CommentaryText
          key={verse}
          ref={(el) => (verseRefs.current[verse] = el)}
          verse={verse}
          btext={btext}
          textColor={commentaryTextColor}
          isLight={isLight(commentaryBackgroundColor)}
        />
      )
    })

    return result
  }

  // 양쪽 패딩 영역의 너비를 동일하게 조정
  const handleSidePaddingSync = (referenceSide: 'left' | 'right'): void => {
    if (leftPaddingRef.current === null || rightPaddingRef.current === null) return

    if (referenceSide === 'left') {
      rightPaddingRef.current.resize(leftPaddingRef.current.getSize())
    } else {
      leftPaddingRef.current.resize(rightPaddingRef.current.getSize())
    }
  }

  useEffect(() => {
    if (commentaryData.length > 0) {
      const currentVerseRef = verseRefs.current
        .filter((el) => el instanceof HTMLElement)
        .find((el) => Number(el?.dataset?.verse) === currentBibleVerse)

      if (currentVerseRef) {
        currentVerseRef.scrollIntoView(true)
      }
    }
  }, [commentaryData, currentBibleVerse])

  if (commentaryData.length === 0) return null

  return (
    <div css={[sx]} style={{ backgroundColor: commentaryBackgroundColor }}>
      <PanelGroup direction="horizontal" style={{ height: 'auto' }}>
        <Panel ref={leftPaddingRef} defaultSize={1} maxSize={25} className="bg-gray-100" />
        <PanelResizeHandle
          className="w-2pxr px-4pxr hover:bg-gray-300 cursor-col-resize"
          onDoubleClick={() => handleSidePaddingSync('left')}
        />

        <Panel>
          <div className={`px-16pxr text-[${fontSize}px]`}>{renderVerseList()}</div>
        </Panel>

        <PanelResizeHandle
          className="w-2pxr px-4pxr hover:bg-gray-300 cursor-col-resize"
          onDoubleClick={() => handleSidePaddingSync('right')}
        />
        <Panel ref={rightPaddingRef} defaultSize={1} maxSize={25} className="bg-gray-200" />
      </PanelGroup>
      <div className="w-full h-screen bg-gray-200" />
    </div>
  )
}

export default CommentaryArea
