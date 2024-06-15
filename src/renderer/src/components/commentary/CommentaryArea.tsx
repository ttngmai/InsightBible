import {
  readWriteCommentaryBackgroundColorAtom,
  readWriteCommentaryDataAtom,
  readWriteCommentaryTextColor,
  readWriteVerseAtom,
  readWriteCommentaryTextSizeAtom
} from '@renderer/store'
import isLight from '@renderer/utils/contrastColor'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useRef } from 'react'
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

  const currentBibleVerse = useAtomValue(readWriteVerseAtom)
  const fontSize = useAtomValue(readWriteCommentaryTextSizeAtom)
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
      <div className={`px-16pxr text-[${fontSize}px]`}>{renderVerseList()}</div>
      <div className="h-screen" />
    </div>
  )
}

export default CommentaryArea
