import { useCallback, useEffect, useState } from 'react'
import { TBible, TCommentary } from '@shared/models'
import NavigationBar from './components/common/NavigationBar'
import BibleArea from './components/bible/BibleArea'
import CommentaryArea from './components/commentary/CommentaryArea'
import { bibleCountInfo } from '@shared/constants'
import tw from 'twin.macro'
import { useAtomValue, useSetAtom } from 'jotai'
import { bookAtom, chapterAtom, selectedItemAtom, verseAtom } from './store'

const App = (): JSX.Element => {
  const selectedItem = useAtomValue(selectedItemAtom)
  const setBook = useSetAtom(bookAtom)
  const setChapter = useSetAtom(chapterAtom)
  const setVerse = useSetAtom(verseAtom)

  const [bibleData, setBibleData] = useState<TBible[]>([])
  const [commentaryData, setCommentaryData] = useState<TCommentary[]>([])
  const [lastVerse, setLastVerse] = useState<number>(0)
  const [lastChapter, setLastChapter] = useState<number>(0)

  const handleSearchBible = useCallback(async (book: number, chapter: number, verse: number) => {
    const bible = await window.context.findAllBibleByBookAndChapter(book, chapter)
    const commentary = await window.context.findAllCommentaryByBookAndChapter(book, chapter)

    setBibleData(bible)
    setCommentaryData(commentary)

    setBook(book)
    setChapter(chapter)
    setVerse(verse)

    setLastChapter(
      bibleCountInfo
        .filter((el) => el.book === book)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0
    )
    setLastVerse(
      bibleCountInfo.filter((el) => el.book === book).filter((el) => el.chapter === chapter)[0]
        .lastVerse || 0
    )
  }, [])

  useEffect(() => {
    if (selectedItem) {
      handleSearchBible(selectedItem.book, selectedItem.chapter, selectedItem.verse)
    }
  }, [selectedItem])

  return (
    <>
      <NavigationBar lastChapter={lastChapter} />

      <div className="flex h-[calc(100vh-60px)]">
        <BibleArea bibleData={bibleData} lastVerse={lastVerse} sx={tw`flex-1 overflow-y-auto`} />
        <CommentaryArea
          commentaryData={commentaryData}
          lastVerse={lastVerse}
          sx={tw`flex-1 overflow-y-auto border-l border-gray-300`}
        />
      </div>
    </>
  )
}

export default App
