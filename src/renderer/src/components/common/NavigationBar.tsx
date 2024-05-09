import tw, { css, TwStyle } from 'twin.macro'
import Button from './Button'
import { IconArrowLeft, IconArrowRight, IconBible, IconSettings } from '@tabler/icons-react'
import { bibleCountInfo, bookInfo } from '@shared/constants'
import ModalPortal from '@renderer/utils/ModalPortal'
import { useEffect, useState } from 'react'
import BibleSearchModal from '../bible/BibleSearchModal'
import { useAtomValue } from 'jotai'
import { readWriteBookAtom, readWriteChapterAtom, readWriteVerseAtom } from '@renderer/store'
import SettingsModal from '../SettingsModal'
import useSearchBible from '@renderer/hooks/useSearchBible'

type NavigationBarProps = {
  sx?: TwStyle
}

const dividerStyles = css`
  & > div::after {
    ${tw`w-1pxr h-32pxr mx-8pxr bg-gray-300`}
    content: '';
  }
`

function NavigationBar({ sx }: NavigationBarProps): JSX.Element {
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const verse = useAtomValue(readWriteVerseAtom)

  const [lastChapter, setLastChapter] = useState<number>(0)
  const [openBibleSearchModal, setOpenBibleSearchModal] = useState<boolean>(false)
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false)

  const bookName = bookInfo.find((el) => el.id === book)?.name

  const searchBible = useSearchBible()

  useEffect(() => {
    setLastChapter(
      bibleCountInfo
        .filter((el) => el.book === book)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0
    )
  }, [book, chapter])

  return (
    <div
      css={[
        tw`sticky top-0 flex items-center h-60pxr px-16pxr py-8pxr border-b border-b-gray-300 bg-white`,
        sx
      ]}
    >
      <div css={[tw`flex items-center`, dividerStyles]}>
        <div className="flex items-center w-180pxr">
          <span className="grow text-[18px] font-bold">{`${bookName} ${chapter} : ${verse}`}</span>
        </div>
        <div className="flex items-center w-180pxr select-none">
          <Button
            type="button"
            onClick={() => searchBible(book, chapter - 1, 1)}
            size="icon"
            disabled={chapter <= 1}
          >
            <IconArrowLeft size={18} />
          </Button>
          <div className="flex justify-center items-center mx-auto">
            <span>{chapter}</span>
            <span className="mx-8pxr">/</span>
            <span>{lastChapter}</span>
          </div>
          <Button
            type="button"
            onClick={() => searchBible(book, chapter + 1, 1)}
            size="icon"
            disabled={chapter === lastChapter}
          >
            <IconArrowRight size={18} />
          </Button>
        </div>
        <div className="flex items-center select-none">
          <Button
            type="button"
            onClick={() => {
              setOpenBibleSearchModal(true)
            }}
          >
            <IconBible size={18} className="mr-4pxr" />
            성경찾기
          </Button>
        </div>
        <div className="flex items-center select-none">
          <Button type="button" onClick={() => setOpenSettingsModal(true)}>
            <IconSettings size={18} className="mr-4pxr" />
            설정
          </Button>
        </div>
      </div>

      {openBibleSearchModal && (
        <ModalPortal>
          <BibleSearchModal
            book={book}
            chapter={chapter}
            verse={verse}
            onSelect={({ book, chapter, verse }) => {
              searchBible(book, chapter, verse)
              setOpenBibleSearchModal(false)
            }}
            onClose={() => setOpenBibleSearchModal(false)}
          />
        </ModalPortal>
      )}
      {openSettingsModal && (
        <ModalPortal>
          <SettingsModal onClose={() => setOpenSettingsModal(false)} />
        </ModalPortal>
      )}
    </div>
  )
}

export default NavigationBar
