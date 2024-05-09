import { useEffect } from 'react'
import NavigationBar from './components/common/NavigationBar'
import BibleArea from './components/bible/BibleArea'
import CommentaryArea from './components/commentary/CommentaryArea'
import tw from 'twin.macro'
import { useAtomValue } from 'jotai'
import { readWriteBookAtom, readWriteChapterAtom, readWriteVerseAtom } from './store'
import useSearchBible from './hooks/useSearchBible'

const App = (): JSX.Element => {
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const verse = useAtomValue(readWriteVerseAtom)

  const searchBible = useSearchBible()

  useEffect(() => {
    searchBible(book, chapter, verse)
  }, [])

  return (
    <>
      <NavigationBar />

      <div className="flex h-[calc(100vh-60px)]">
        <BibleArea sx={tw`flex-1 overflow-y-auto`} />
        <CommentaryArea sx={tw`flex-1 overflow-y-auto border-l border-gray-300`} />
      </div>
    </>
  )
}

export default App
