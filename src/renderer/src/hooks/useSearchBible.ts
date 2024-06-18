import {
  readWriteBibleDataAtom,
  readWriteBibleName,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteVerseAtom
} from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'

function useSearchBible(): (book: number, chapter: number, verse: number) => void {
  const bibleName = useAtomValue(readWriteBibleName)

  const setBibleData = useSetAtom(readWriteBibleDataAtom)

  const setBook = useSetAtom(readWriteBookAtom)
  const setChapter = useSetAtom(readWriteChapterAtom)
  const setVerse = useSetAtom(readWriteVerseAtom)

  const searchBible = async (book: number, chapter: number, verse: number): Promise<void> => {
    const bible = await window.context.findBible(bibleName, book, chapter)

    setBibleData(bible)

    setBook(book)
    setChapter(chapter)
    setVerse(verse)
  }

  return searchBible
}

export default useSearchBible
