import tw, { css, TwStyle } from 'twin.macro'
import Button from './Button'
import { IconArrowLeft, IconArrowRight, IconBible, IconSettings } from '@tabler/icons-react'
import { bookInfo } from '@shared/constants'
import ModalPortal from '@renderer/utils/ModalPortal'
import { useState } from 'react'
import BibleSearchModal from '../bible/BibleSearchModal'
import { useAtomValue, useSetAtom } from 'jotai'
import { bookAtom, chapterAtom, selectedItemAtom, verseAtom } from '@renderer/store'
import SettingsModal from '../SettingsModal'

type NavigationBarProps = {
  lastChapter: number
  sx?: TwStyle
}

const dividerStyles = css`
  & > div::after {
    ${tw`w-1pxr h-32pxr mx-8pxr bg-gray-300`}
    content: '';
  }
`

function NavigationBar({ lastChapter, sx }: NavigationBarProps): JSX.Element {
  const book = useAtomValue(bookAtom)
  const chapter = useAtomValue(chapterAtom)
  const verse = useAtomValue(verseAtom)
  const setSelectedItem = useSetAtom(selectedItemAtom)

  const [openBibleSearchModal, setOpenBibleSearchModal] = useState<boolean>(false)
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false)

  const bookName = bookInfo.find((el) => el.id === book)?.name

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
            onClick={() => setSelectedItem({ book, chapter: chapter - 1, verse: 1 })}
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
            onClick={() => setSelectedItem({ book, chapter: chapter + 1, verse: 1 })}
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
              setSelectedItem({ book, chapter, verse })
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
