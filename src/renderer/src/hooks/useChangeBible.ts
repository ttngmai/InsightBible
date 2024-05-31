import {
  readWriteBibleDataAtom,
  readWriteBibleName,
  readWriteBookAtom,
  readWriteChapterAtom
} from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'

function useChangeBible(): (bibleName: string) => void {
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)

  const setBibleName = useSetAtom(readWriteBibleName)
  const setBibleData = useSetAtom(readWriteBibleDataAtom)

  const changeBible = async (bibleName: string): Promise<void> => {
    const bible = await window.context.findBible(bibleName, book, chapter)

    setBibleName(bibleName)
    setBibleData(bible)
  }

  return changeBible
}

export default useChangeBible
