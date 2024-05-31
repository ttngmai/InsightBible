import tw, { css, TwStyle } from 'twin.macro'
import Button from './Button'
import { IconArrowLeft, IconArrowRight, IconBible, IconSettings } from '@tabler/icons-react'
import { bibleCountInfo, bookInfo } from '@shared/constants'
import ModalPortal from '@renderer/utils/ModalPortal'
import { useEffect, useState } from 'react'
import BibleSearchModal from '../bible/BibleSearchModal'
import { useAtom, useAtomValue } from 'jotai'
import {
  readWriteBibleName,
  readWriteBibleSoundTimeStampAtom,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCommentaryName,
  readWriteCurrentReadingPositionAtom,
  readWriteVerseAtom,
  readWriteVoiceTypeAtom
} from '@renderer/store'
import SettingsModal from '../SettingsModal'
import useSearchBible from '@renderer/hooks/useSearchBible'
import SelectBox from './SelectBox'
import useChangeBible from '@renderer/hooks/useChangeBible'
import useChangeCommentary from '@renderer/hooks/useChangeCommentary'
import AudioPlayer from './AudioPlayer'
import { OnProgressProps } from 'react-player/base'

type NavigationBarProps = {
  sx?: TwStyle
}

const dividerStyles = css`
  & > div:not(:last-child)::after {
    ${tw`w-1pxr h-32pxr mx-8pxr bg-gray-300`}
    content: '';
  }
`

function NavigationBar({ sx }: NavigationBarProps): JSX.Element {
  const bibleName = useAtomValue(readWriteBibleName)
  const commentaryName = useAtomValue(readWriteCommentaryName)
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const verse = useAtomValue(readWriteVerseAtom)
  const voiceType = useAtomValue(readWriteVoiceTypeAtom)
  const [bibleSoundTimeStamp, setBibleSoundTimeStamp] = useAtom(readWriteBibleSoundTimeStampAtom)
  const [currentReadingPosition, setCurrentReadingPosition] = useAtom(
    readWriteCurrentReadingPositionAtom
  )

  const [lastChapter, setLastChapter] = useState<number>(0)
  const [bibleSoundFileLocation, setBibleSoundFileLocation] = useState<string>('')
  const [openBibleSearchModal, setOpenBibleSearchModal] = useState<boolean>(false)
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false)

  const bookName = bookInfo.find((el) => el.id === book)?.name

  const changeBible = useChangeBible()
  const changeCommentary = useChangeCommentary()
  const searchBible = useSearchBible()

  const handleProgress = (state: OnProgressProps): void => {
    if (bibleSoundTimeStamp.length > 0) {
      const currentTime = state.playedSeconds

      if (state.playedSeconds === 0) {
        setCurrentReadingPosition(null)
        return
      }

      const currentVerse = bibleSoundTimeStamp.find(
        (el) => currentTime >= el.start_time && currentTime <= el.end_time
      )

      if (currentVerse && currentVerse.verse !== currentReadingPosition) {
        setCurrentReadingPosition(currentVerse.verse)
      }
    }
  }

  useEffect(() => {
    ;(async (): Promise<void> => {
      setLastChapter(
        bibleCountInfo
          .filter((el) => el.book === book)
          .map((el) => el.chapter)
          .sort((a, b) => b - a)[0] || 0
      )

      setCurrentReadingPosition(null)
      setBibleSoundFileLocation(
        new URL(
          `/src/assets/sound/bible/${bibleName}/${voiceType}/${book}_${chapter}.mp3`,
          import.meta.url
        ).toString()
      )
      const timeStamp = await window.context.findBibleSoundTimeStamp(
        `${bibleName}_${voiceType}음성_타임스탬프`,
        book,
        chapter
      )
      setBibleSoundTimeStamp(timeStamp)
    })()
  }, [bibleName, book, chapter, voiceType])

  return (
    <>
      <div
        css={[
          tw`sticky top-0 flex items-center h-60pxr px-16pxr py-8pxr border-b border-b-gray-300 bg-white`,
          sx
        ]}
      >
        <div css={[tw`flex items-center w-full`, dividerStyles]}>
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
            <div className="flex gap-[0.5rem]">
              <SelectBox
                placeholder="성경 선택"
                itemList={[
                  { key: '개역개정', value: '개역개정', text: '개역개정' },
                  { key: '개역한글', value: '개역한글', text: '개역한글' }
                ]}
                defaultValue={bibleName}
                setValue={(value) => changeBible(value)}
              />
              <SelectBox
                placeholder="주석 선택"
                itemList={[
                  { key: '사용 안 함', value: '사용 안 함', text: '사용 안 함' },
                  { key: '매튜헨리', value: '매튜헨리', text: '매튜헨리' },
                  { key: '성경관주', value: '성경관주', text: '성경관주' }
                ]}
                defaultValue={commentaryName}
                setValue={(value) => changeCommentary(value)}
              />
            </div>
          </div>
          <div className="flex items-center select-none">
            <div className="w-360pxr h-40pxr">
              <AudioPlayer url={bibleSoundFileLocation} onProgress={handleProgress} />
            </div>
          </div>
          <div className="flex items-center ml-auto select-none">
            <div className="flex items-center select-none">
              <Button type="button" onClick={() => setOpenSettingsModal(true)}>
                <IconSettings size={18} className="mr-4pxr" />
                설정
              </Button>
            </div>
          </div>
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
    </>
  )
}

export default NavigationBar
