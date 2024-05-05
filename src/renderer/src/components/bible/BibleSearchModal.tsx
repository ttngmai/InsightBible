import { bibleCountInfo, bookInfo } from '@shared/constants'
import Modal from '../common/Modal'
import { useEffect, useRef, useState } from 'react'
import tw from 'twin.macro'

type BibleSearchModalProps = {
  book: number
  chapter: number
  verse: number
  onSelect: ({ book, chapter, verse }) => void
  onClose: () => void
}

function BibleSearchModal({
  book,
  chapter,
  verse,
  onSelect,
  onClose
}: BibleSearchModalProps): JSX.Element {
  const bookRefs = useRef<null[] | HTMLLIElement[]>([])
  const chapterRefs = useRef<null[] | HTMLLIElement[]>([])
  const verseRefs = useRef<null[] | HTMLLIElement[]>([])

  const [selectedBook, setSelectedBook] = useState<number>(book)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(chapter)
  const [selectedVerse, setSelectedVerse] = useState<number | null>(verse)

  const renderBookList = (): React.ReactNode => {
    let currentGroup = ''

    return bookInfo.map((el, idx) => {
      let groupMarker: React.ReactNode = null

      if (el.group !== currentGroup) {
        groupMarker = (
          <div key={el.group} className="px-4pxr py-2pxr bg-gray-200 text-[12px]">
            {el.group}
          </div>
        )
        currentGroup = el.group
      }

      return (
        <>
          {groupMarker}
          <li
            key={el.id}
            ref={(el) => (bookRefs.current[idx] = el)}
            data-book={el.id}
            onClick={() => {
              setSelectedBook(el.id)
              setSelectedChapter(null)
              setSelectedVerse(null)
            }}
            css={[
              tw`px-16pxr py-4pxr cursor-pointer`,
              selectedBook === el.id ? tw`bg-brand-blue-50` : tw`hover:bg-gray-100`
            ]}
          >
            {el.name}
          </li>
        </>
      )
    })
  }

  const renderChapterList = (): React.ReactNode => {
    return bibleCountInfo
      .filter((el) => el.book === selectedBook)
      .map((el, idx) => (
        <li
          key={el.chapter}
          ref={(el) => (chapterRefs.current[idx] = el)}
          data-chapter={el.chapter}
          onClick={() => {
            setSelectedChapter(el.chapter)
            setSelectedVerse(null)
          }}
          css={[
            tw`px-16pxr py-4pxr cursor-pointer`,
            selectedChapter === el.chapter ? tw`bg-brand-blue-50` : tw`hover:bg-gray-100`
          ]}
        >{`${el.chapter} 장`}</li>
      ))
  }

  const renderVerseList = (): React.ReactNode => {
    const result: React.ReactNode[] = []
    const lastVerse =
      bibleCountInfo.find((el) => el.book === selectedBook && el.chapter === selectedChapter)
        ?.lastVerse || 0

    for (let i = 1; i <= lastVerse; i++) {
      result.push(
        <li
          key={i}
          ref={(el) => (verseRefs.current[i] = el)}
          data-verse={i}
          onClick={() => onSelect({ book: selectedBook, chapter: selectedChapter, verse: i })}
          css={[
            tw`px-16pxr py-4pxr cursor-pointer`,
            selectedVerse === i ? tw`bg-brand-blue-50` : tw`hover:bg-gray-100`
          ]}
        >{`${i}절`}</li>
      )
    }

    return result
  }

  useEffect(() => {
    const currentBookRef = bookRefs.current
      .filter((el) => el instanceof HTMLElement)
      .find((el) => Number(el.dataset.book) === book)
    const currentChapterRef = chapterRefs.current
      .filter((el) => el instanceof HTMLElement)
      .find((el) => Number(el.dataset.chapter) === chapter)
    const currentVerseRef = verseRefs.current
      .filter((el) => el instanceof HTMLElement)
      .find((el) => Number(el.dataset.verse) === verse)

    if (currentBookRef) currentBookRef.scrollIntoView(true)
    if (currentChapterRef) currentChapterRef.scrollIntoView(true)
    if (currentVerseRef) currentVerseRef.scrollIntoView(true)
  }, [])

  return (
    <Modal title="성경찾기" onClose={onClose}>
      <div className="h-480pxr bg-white">
        <div className="flex w-600pxr h-full">
          <div className="flex-[1] h-full overflow-y-auto">
            <ul>{renderBookList()}</ul>
          </div>
          <div className="flex-1 overflow-y-auto border-l border-gray-300">
            <ul>{renderChapterList()}</ul>
          </div>
          <div className="flex-1 overflow-y-auto border-l border-gray-300">
            <ul>{renderVerseList()}</ul>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BibleSearchModal
