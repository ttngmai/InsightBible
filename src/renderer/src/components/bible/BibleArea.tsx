import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleDataAtom,
  readWriteBibleTextColorAtom,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCurrentReadingPositionAtom,
  readWriteCurrentReadingTextColorAtom,
  readWriteBibleTextSizeAtom,
  readWriteVerseAtom
} from '@renderer/store'
import isLight from '@renderer/utils/contrastColor'
import { bibleCountInfo, bookInfo } from '@shared/constants'
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
  currentReadingTextColor: string | null
  isLight: boolean
  isReading: boolean
}

const BibleText = forwardRef<HTMLDivElement, BibleTextProps>(
  ({ verse, btext, textColor, currentReadingTextColor, isLight, isReading }, ref) => {
    return (
      <div ref={ref} data-verse={verse} className="mb-[0.25rem]">
        <div className="flex">
          <p css={[tw`mr-[0.5em]`, isLight ? tw`text-brand-blue-500` : tw`text-white`]}>{verse}</p>
          <p
            style={
              isReading && currentReadingTextColor
                ? { color: currentReadingTextColor }
                : { color: textColor }
            }
            css={[isReading && tw`font-bold`]}
          >
            {btext}
          </p>
        </div>
      </div>
    )
  }
)
BibleText.displayName = 'BibleText'

function BibleArea({ sx }: BibleAreaProps): JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement>(null) // 최상단 Div 요소의 참조 리스트
  const titleRef = useRef<HTMLHeadingElement>(null) // h1 요소의 참조
  const verseRefs = useRef<null[] | HTMLElement[]>([]) // 각 절 HTML 요소의 참조 리스트

  const fontSize = useAtomValue(readWriteBibleTextSizeAtom)
  const bibleBackgroundColor = useAtomValue(readWriteBibleBackgroundColorAtom)
  const bibleTextColor = useAtomValue(readWriteBibleTextColorAtom)
  const currentReadingTextColor = useAtomValue(readWriteCurrentReadingTextColorAtom)
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const [verse, setVerse] = useAtom(readWriteVerseAtom)
  const bibleData = useAtomValue(readWriteBibleDataAtom)
  const currentReadingPosition = useAtomValue(readWriteCurrentReadingPositionAtom)

  const [lastVerse, setLastVerse] = useState<number>(0)
  const [visibleVerseList, setVisibleVerseList] = useState<number[]>([]) // 화면에 보이는 절 숫자 리스트

  const bookName = bookInfo.find((el) => el.id === book)?.name

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
            currentReadingTextColor={currentReadingTextColor}
            isLight={isLight(bibleBackgroundColor)}
            isReading={i === currentReadingPosition}
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
          currentReadingTextColor={currentReadingTextColor}
          isLight={isLight(bibleBackgroundColor)}
          isReading={verse === currentReadingPosition}
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
          currentReadingTextColor={currentReadingTextColor}
          isLight={isLight(bibleBackgroundColor)}
          isReading={i === currentReadingPosition}
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
      if (verse === 1 && titleRef.current) {
        titleRef.current.scrollIntoView(true)
        return
      }

      const currentVerseRef = verseRefs.current
        .filter((el) => el instanceof HTMLElement)
        .find((el) => Number(el?.dataset?.verse) === verse)

      if (currentVerseRef) {
        currentVerseRef.scrollIntoView(true)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [bibleData])

  useEffect(() => {
    if (currentReadingPosition !== null && bibleData.length > 0) {
      const currentVerseRef = verseRefs.current
        .filter((el) => el instanceof HTMLElement)
        .find((el) => Number(el?.dataset?.verse) === currentReadingPosition)

      if (currentVerseRef) {
        currentVerseRef.scrollIntoView({ block: 'center' })
      }
    }
  }, [currentReadingPosition])

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
      <div className={`px-16pxr text-[${fontSize}px]`}>
        <h1
          ref={titleRef}
          css={[
            tw`py-24pxr text-[1.25em] text-center`,
            !isLight(bibleBackgroundColor) && tw`text-white`
          ]}
        >{`${bookName} ${chapter}${book !== 19 ? '장' : '편'}`}</h1>
        {renderVerseList()}
      </div>
      <div className="h-screen" />
    </div>
  )
}

export default BibleArea
