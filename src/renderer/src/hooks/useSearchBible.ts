import {
  readWriteBibleDataAtom,
  readWriteBibleName,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCommentaryDataAtom,
  readWriteCommentaryName,
  readWriteVerseAtom
} from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'

function useSearchBible(): (book: number, chapter: number, verse: number) => void {
  const bibleName = useAtomValue(readWriteBibleName)
  const commentaryName = useAtomValue(readWriteCommentaryName)

  const setBibleData = useSetAtom(readWriteBibleDataAtom)
  const setCommentaryData = useSetAtom(readWriteCommentaryDataAtom)

  const setBook = useSetAtom(readWriteBookAtom)
  const setChapter = useSetAtom(readWriteChapterAtom)
  const setVerse = useSetAtom(readWriteVerseAtom)

  const searchBible = async (book: number, chapter: number, verse: number): Promise<void> => {
    const bible = await window.context.findBible(bibleName, book, chapter)
    const commentary = await window.context.findCommentary(commentaryName, book, chapter)

    setBibleData(bible)
    setCommentaryData(commentary)

    setBook(book)
    setChapter(chapter)
    setVerse(verse)
  }

  return searchBible
}

export default useSearchBible
