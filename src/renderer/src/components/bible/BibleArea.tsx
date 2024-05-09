import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleDataAtom,
  readWriteBibleTextColorAtom,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteFontSizeAtom,
  readWriteVerseAtom
} from '@renderer/store'
import { bibleCountInfo } from '@shared/constants'
import { useAtom, useAtomValue } from 'jotai'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import tw, { TwStyle } from 'twin.macro'

type BibleAreaProps = {
  sx?: TwStyle
}

type BibleTextProps = {
  verse: number
  btext: string
  textColor: string
}

const BibleText = forwardRef<HTMLDivElement, BibleTextProps>(({ verse, btext, textColor }, ref) => {
  return (
    <div ref={ref} data-verse={verse} css={[tw`flex mb-[0.25rem]`, verse === 1 && tw`pt-16pxr`]}>
      <p className="mr-4pxr text-brand-blue-500">{verse}</p>
      <p style={{ color: textColor }}>{btext}</p>
    </div>
  )
})
BibleText.displayName = 'BibleText'

function BibleArea({ sx }: BibleAreaProps): JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement>(null) // 최상단 Div 요소의 참조 리스트
  const verseRefs = useRef<null[] | HTMLElement[]>([]) // 각 절 HTML 요소의 참조 리스트

  const fontSize = useAtomValue(readWriteFontSizeAtom)
  const bibleBackgroundColor = useAtomValue(readWriteBibleBackgroundColorAtom)
  const bibleTextColor = useAtomValue(readWriteBibleTextColorAtom)
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const [verse, setVerse] = useAtom(readWriteVerseAtom)
  const bibleData = useAtomValue(readWriteBibleDataAtom)

  const [lastVerse, setLastVerse] = useState<number>(0)
  const [visibleVerseList, setVisibleVerseList] = useState<number[]>([]) // 화면에 보이는 절 숫자 리스트

  // 각 절 렌더링
  const renderVerseList = (): JSX.Element[] => {
    const result: JSX.Element[] = []
    let verseCursor = 1

    bibleData.forEach(({ verse, btext }) => {
      for (let i = verseCursor; i < verse; i++) {
        result.push(
          <BibleText
            key={`empty-${i}`}
            ref={(el) => (verseRefs.current[i] = el)}
            verse={i}
            btext="없음"
            textColor={bibleTextColor}
          />
        )
      }

      result.push(
        <BibleText
          key={verse}
          ref={(el) => (verseRefs.current[verse] = el)}
          verse={verse}
          btext={btext}
          textColor={bibleTextColor}
        />
      )

      verseCursor = verse + 1
    })

    for (let i = verseCursor; i <= lastVerse; i++) {
      result.push(
        <BibleText
          key={`empty-${i}`}
          ref={(el) => (verseRefs.current[i] = el)}
          verse={i}
          btext="없음"
          textColor={bibleTextColor}
        />
      )
    }

    return result
  }

  // 옵저버 콜백 함수
  const handleObserver = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        setVisibleVerseList((prev) =>
          entry.isIntersecting
            ? [...prev, Number(entry.target.dataset.verse)]
            : prev.filter((el) => el !== Number(entry.target.dataset.verse))
        )
      })
    },
    [bibleData]
  )

  // 옵저버
  const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 })

  useEffect(() => {
    setLastVerse(
      bibleCountInfo.filter((el) => el.book === book).filter((el) => el.chapter === chapter)[0]
        .lastVerse || 0
    )
  }, [book, chapter])

  // 각 절에 옵저버 적용
  // "장 이동", "성경찾기" 등의 기능 사용 시, 선택한 절이 최상단에 보이도록 처리
  useEffect(() => {
    verseRefs.current.forEach((el) => {
      if (el instanceof HTMLElement) observer.observe(el)
    })

    if (bibleData.length > 0) {
      const currentVerseRef = verseRefs.current
        .filter((el) => el instanceof HTMLElement)
        .find((el) => Number(el.dataset.verse) === verse)

      if (currentVerseRef) {
        currentVerseRef.scrollIntoView(true)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [bibleData])

  // 최상단에 보이는 절을 기준으로 verse State 업데이트
  useEffect(() => {
    if (bibleData.length > 0) {
      const topMostVisibleVerse = visibleVerseList.sort((a, b) => a - b)[0]
      setVerse(topMostVisibleVerse || lastVerse)
    }
  }, [bibleData, visibleVerseList])

  if (bibleData.length === 0) return null

  return (
    <div ref={wrapperRef} css={[sx]} style={{ backgroundColor: bibleBackgroundColor }}>
      <div className={`px-16pxr text-[${fontSize}px]`}>{renderVerseList()}</div>
      <div className="h-screen" />
    </div>
  )
}

export default BibleArea
