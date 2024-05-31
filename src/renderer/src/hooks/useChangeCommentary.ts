import {
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCommentaryDataAtom,
  readWriteCommentaryName
} from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'

function useChangeCommentary(): (commentaryName: string) => void {
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)

  const setCommentaryName = useSetAtom(readWriteCommentaryName)
  const setCommentaryData = useSetAtom(readWriteCommentaryDataAtom)

  const changeCommentary = async (commentaryName: string): Promise<void> => {
    const commentary = await window.context.findCommentary(commentaryName, book, chapter)

    setCommentaryData(commentary)
    setCommentaryName(commentaryName)
  }

  return changeCommentary
}

export default useChangeCommentary
