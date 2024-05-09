import {
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCommentaryBackgroundColorAtom,
  readWriteCommentaryDataAtom,
  readWriteCommentaryTextColor,
  readWriteFontSizeAtom,
  readWriteVerseAtom
} from '@renderer/store'
import { bibleCountInfo } from '@shared/constants'
import { useAtomValue } from 'jotai'
import { forwardRef, useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'

type CommentaryAreaProps = {
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

function CommentaryArea({ sx }: CommentaryAreaProps): JSX.Element | null {
  const verseRefs = useRef<null[] | HTMLDivElement[]>([]) // 각 주석 HTML 요소의 참조 리스트

  const currentBibleVerse = useAtomValue(readWriteVerseAtom)
  const fontSize = useAtomValue(readWriteFontSizeAtom)
  const commentaryBackgroundColor = useAtomValue(readWriteCommentaryBackgroundColorAtom)
  const commentaryTextColor = useAtomValue(readWriteCommentaryTextColor)
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const commentaryData = useAtomValue(readWriteCommentaryDataAtom)

  const [lastVerse, setLastVerse] = useState<number>(0)

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
    setLastVerse(
      bibleCountInfo.filter((el) => el.book === book).filter((el) => el.chapter === chapter)[0]
        .lastVerse || 0
    )
  }, [book, chapter])

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
