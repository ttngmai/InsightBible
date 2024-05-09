import {
  readWriteBibleDataAtom,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCommentaryDataAtom,
  readWriteVerseAtom
} from '@renderer/store'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

function useSearchBible(): (book: number, chapter: number, verse: number) => void {
  const setBibleData = useSetAtom(readWriteBibleDataAtom)
  const setCommentaryData = useSetAtom(readWriteCommentaryDataAtom)
  const setBook = useSetAtom(readWriteBookAtom)
  const setChapter = useSetAtom(readWriteChapterAtom)
  const setVerse = useSetAtom(readWriteVerseAtom)

  const searchBible = useCallback(async (book: number, chapter: number, verse: number) => {
    const bible = await window.context.findAllBibleByBookAndChapter(book, chapter)
    const commentary = await window.context.findAllCommentaryByBookAndChapter(book, chapter)

    setBibleData(bible)
    setCommentaryData(commentary)

    setBook(book)
    setChapter(chapter)
    setVerse(verse)
  }, [])

  return searchBible
}

export default useSearchBible
