import tw, { css, TwStyle } from 'twin.macro'
import Button from './Button'
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconSettings
} from '@tabler/icons-react'
import { bibleCountInfo, bookInfo } from '@shared/constants'
import ModalPortal from '@renderer/utils/ModalPortal'
import { useEffect, useRef, useState } from 'react'
import BibleSearchModal from '../bible/BibleSearchModal'
import { useAtom, useAtomValue } from 'jotai'
import {
  readWriteBibleName,
  readWriteBibleSoundTimeStampAtom,
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteCurrentReadingPositionAtom,
  readWriteVerseAtom,
  readWriteVoiceTypeAtom
} from '@renderer/store'
import SettingsModal from '../SettingsModal'
import useSearchBible from '@renderer/hooks/useSearchBible'
import CustomSelect from './CustomSelect'
import useChangeBible from '@renderer/hooks/useChangeBible'
import BibleAudioPlayer from './BibleAudioPlayer'
import { OnProgressProps } from 'react-player/base'
import * as Popover from '@radix-ui/react-popover'
import * as Separator from '@radix-ui/react-separator'

type NavigationBarProps = {
  sx?: TwStyle
}

function NavigationBar({ sx }: NavigationBarProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)

  const bibleName = useAtomValue(readWriteBibleName)
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const verse = useAtomValue(readWriteVerseAtom)
  const voiceType = useAtomValue(readWriteVoiceTypeAtom)
  const [bibleSoundTimeStamp, setBibleSoundTimeStamp] = useAtom(readWriteBibleSoundTimeStampAtom)
  const [currentReadingPosition, setCurrentReadingPosition] = useAtom(
    readWriteCurrentReadingPositionAtom
  )

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false)
  const [lastChapter, setLastChapter] = useState<number>(0)
  const [bibleSoundFileLocation, setBibleSoundFileLocation] = useState<string>('')
  const [openBibleSearchModal, setOpenBibleSearchModal] = useState<boolean>(false)
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false)

  const bookName = bookInfo.find((el) => el.id === book)?.name

  const changeBible = useChangeBible()
  const searchBible = useSearchBible()

  const handleProgress = (state: OnProgressProps): void => {
    if (bibleSoundTimeStamp.length > 0) {
      const currentTime = state.playedSeconds

      if (state.playedSeconds === 0) {
        setCurrentReadingPosition(null)
        return
      }

      const currentVerse = bibleSoundTimeStamp.find(
        (el) => currentTime >= el.start_time && currentTime < el.end_time
      )

      if (currentVerse && currentVerse.verse !== currentReadingPosition) {
        setCurrentReadingPosition(currentVerse.verse)
      }
    }
  }

  const handleScroll = (direction): void => {
    const scrollAmount = 200
    scrollRef.current?.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = (): void => {
      if (!scrollRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }

    if (scrollRef.current) {
      handleScroll() // 초기 상태 설정
      scrollRef.current.addEventListener('scroll', handleScroll)
      window.addEventListener('resize', handleScroll) // 창 크기 변경 시에도 업데이트
    }

    return () => {
      scrollRef.current?.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    setLastChapter(
      bibleCountInfo
        .filter((el) => el.book === book)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0
    )
  }, [book])

  useEffect(() => {
    ;(async (): Promise<void> => {
      setCurrentReadingPosition(null)
      setBibleSoundFileLocation(
        new URL(
          '/src/assets/sounds/bible/' +
            bibleName +
            '/' +
            voiceType +
            '/' +
            book +
            '_' +
            chapter +
            '.mp3',
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
      <div className="flex">
        {canScrollLeft && (
          <Button
            type="button"
            onClick={() => handleScroll(-1)}
            variant="ghost"
            sx={tw`sticky left-0 h-60pxr bg-white rounded-none border border-t-0 border-gray-300`}
          >
            <IconChevronLeft size={18} />
          </Button>
        )}
        <div
          ref={scrollRef}
          css={[
            tw`sticky top-0 flex w-full h-60pxr border-b border-b-gray-300 bg-white select-none overflow-x-scroll`,
            css`
              -ms-overflow-style: none;
              scrollbar-width: none;
            `,
            sx
          ]}
        >
          <div className="flex items-center w-full h-full px-16pxr py-8pxr">
            <div className="flex justify-center items-center shrink-0 w-100pxr">
              <CustomSelect
                placeholder="성경 선택"
                itemList={[
                  { key: '개역', value: '개역', text: '개역' },
                  { key: '개역개정', value: '개역개정', text: '개역개정' },
                  { key: '개역한글', value: '개역한글', text: '개역한글' }
                ]}
                value={bibleName}
                setValue={(value) => changeBible(value)}
              >
                <div className="flex justify-center items-center mx-16pxr text-[18px] font-bold">
                  <span>{bibleName}</span>
                </div>
              </CustomSelect>
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0 w-300pxr">
              <div className="flex items-center gap-16pxr mx-auto">
                <Popover.Root>
                  <Popover.Trigger>
                    <span className="text-[18px] font-bold">{bookName}</span>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      sideOffset={5}
                      className="flex max-h-352pxr overflow-hidden bg-white rounded-md shadow-sm"
                      style={{
                        height: 'calc(var(--radix-popover-content-available-height) - 16px)'
                      }}
                    >
                      <div className="flex">
                        <div className="w-150pxr">
                          <p className="px-8pxr py-4pxr font-bold">구약</p>
                          <ul className="h-full overflow-y-auto">
                            {bookInfo.slice(0, 39).map((el) => (
                              <li
                                key={el.id}
                                onClick={() => searchBible(el.id, 1, 1)}
                                className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] rounded-md select-none cursor-pointer hover:bg-[#F8FAFC]"
                              >
                                <span>{el.name}</span>
                                {el.id === book && <IconCheck size={14} />}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="w-150pxr">
                          <p className="px-8pxr py-4pxr font-bold">신약</p>
                          <ul className="h-full overflow-y-auto">
                            {bookInfo.slice(39).map((el) => (
                              <li
                                key={el.id}
                                onClick={() => searchBible(el.id, 1, 1)}
                                className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] rounded-md select-none cursor-pointer hover:bg-[#F8FAFC]"
                              >
                                <span>{el.name}</span>
                                {el.id === book && <IconCheck size={14} />}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => searchBible(book, chapter - 1, 1)}
                    size="icon"
                    disabled={chapter <= 1}
                  >
                    <IconArrowLeft size={18} />
                  </Button>
                  <CustomSelect
                    itemList={bibleCountInfo
                      .filter((el) => el.book === book)
                      .map((el) => ({
                        key: String(el.chapter),
                        value: String(el.chapter),
                        text: `${el.chapter}${el.book !== 19 ? '장' : '편'}`
                      }))}
                    value={String(chapter)}
                    setValue={(value) => searchBible(book, Number(value), 1)}
                  >
                    <div className="flex justify-center items-center mx-16pxr text-[18px] font-bold">
                      <span>
                        {chapter}
                        {book !== 19 ? '장' : '편'}
                      </span>
                      <span className="mx-8pxr">/</span>
                      <span>
                        {lastChapter}
                        {book !== 19 ? '장' : '편'}
                      </span>
                    </div>
                  </CustomSelect>
                  <Button
                    type="button"
                    onClick={() => searchBible(book, chapter + 1, 1)}
                    size="icon"
                    disabled={chapter === lastChapter}
                  >
                    <IconArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0 w-300pxr h-40pxr">
              <BibleAudioPlayer url={bibleSoundFileLocation} onProgress={handleProgress} />
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex grow items-center">
              <Button type="button" onClick={() => setOpenSettingsModal(true)} size="icon">
                <IconSettings size={18} />
              </Button>
            </div>
          </div>
        </div>
        {canScrollRight && (
          <Button
            type="button"
            onClick={() => handleScroll(1)}
            variant="ghost"
            sx={tw`sticky right-0 h-60pxr bg-white rounded-none border border-t-0 border-gray-300`}
          >
            <IconChevronRight size={18} />
          </Button>
        )}
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
