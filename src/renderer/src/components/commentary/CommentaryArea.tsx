import {
  commentaryBackgroundColorAtom,
  commentaryTextColorAtom,
  fontSizeAtom,
  verseAtom
} from '@renderer/store'
import { TCommentary } from '@shared/models'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useRef } from 'react'
import tw, { TwStyle } from 'twin.macro'

type CommentaryAreaProps = {
  commentaryData?: TCommentary[]
  lastVerse?: number
  sx?: TwStyle
}

type CommentaryTextProps = {
  verse: number
  btext: string
  textColor: string
}

const CommentaryText = forwardRef<HTMLDivElement, CommentaryTextProps>(
  ({ verse, btext, textColor }, ref) => {
    return (
      <div ref={ref} data-verse={verse} css={[tw`flex mb-[1rem]`, verse === 1 && tw`pt-16pxr`]}>
        <p className="mr-4pxr text-brand-blue-500">{verse}</p>
        <p dangerouslySetInnerHTML={{ __html: btext }} style={{ color: textColor }} />
      </div>
    )
  }
)
CommentaryText.displayName = 'CommentaryText'

function CommentaryArea({
  commentaryData = [],
  lastVerse = 0,
  sx
}: CommentaryAreaProps): JSX.Element | null {
  // 각 주석 HTML 요소의 참조 리스트
  const verseRefs = useRef<null[] | HTMLDivElement[]>([])

  const currentBibleVerse = useAtomValue(verseAtom)
  const fontSize = useAtomValue(fontSizeAtom)
  const commentaryBackgroundColor = useAtomValue(commentaryBackgroundColorAtom)
  const commentaryTextColor = useAtomValue(commentaryTextColorAtom)

  // 각 주석 렌더링
  const renderVerseList = (): JSX.Element[] => {
    const result: JSX.Element[] = []
    let verseCursor = 1

    commentaryData.forEach(({ verse, btext }) => {
      for (let i = verseCursor; i < verse; i++) {
        result.push(
          <CommentaryText
            key={`empty-${i}`}
            ref={(el) => (verseRefs.current[i] = el)}
            verse={i}
            btext="없음"
            textColor={commentaryTextColor}
          />
        )
      }

      result.push(
        <CommentaryText
          key={verse}
          ref={(el) => (verseRefs.current[verse] = el)}
          verse={verse}
          btext={btext}
          textColor={commentaryTextColor}
        />
      )

      verseCursor = verse + 1
    })

    for (let i = verseCursor; i <= lastVerse; i++) {
      result.push(
        <CommentaryText
          key={`empty-${i}`}
          ref={(el) => (verseRefs.current[i] = el)}
          verse={i}
          btext="없음"
          textColor={commentaryTextColor}
        />
      )
    }

    return result
  }

  useEffect(() => {
    if (commentaryData.length > 0) {
      const currentVerseRef = verseRefs.current
        .filter((el) => el instanceof HTMLElement)
        .find((el) => Number(el.dataset.verse) === currentBibleVerse)

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
