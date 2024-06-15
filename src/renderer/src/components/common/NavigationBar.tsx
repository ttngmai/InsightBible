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
  readWriteCommentaryName,
  readWriteCurrentReadingPositionAtom,
  readWriteVerseAtom,
  readWriteVoiceTypeAtom
} from '@renderer/store'
import SettingsModal from '../SettingsModal'
import useSearchBible from '@renderer/hooks/useSearchBible'
import CustomSelect from './CustomSelect'
import useChangeBible from '@renderer/hooks/useChangeBible'
import useChangeCommentary from '@renderer/hooks/useChangeCommentary'
import BibleAudioPlayer from './BibleAudioPlayer'
import { OnProgressProps } from 'react-player/base'
import * as Select from '@radix-ui/react-select'
import * as Separator from '@radix-ui/react-separator'

type NavigationBarProps = {
  sx?: TwStyle
}

function NavigationBar({ sx }: NavigationBarProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false)
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
          `/src/assets/sounds/bible/${bibleName}/${voiceType}/${book}_${chapter}.mp3`,
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
            <div className="flex items-center shrink-0">
              <CustomSelect
                placeholder="성경 선택"
                itemList={[
                  { key: '개역개정', value: '개역개정', text: '개역개정' },
                  { key: '개역한글', value: '개역한글', text: '개역한글' }
                ]}
                value={bibleName}
                setValue={(value) => changeBible(value)}
              />
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0 w-360pxr">
              <div className="flex items-center gap-16pxr mx-auto">
                <Select.Root
                  value={String(book)}
                  onValueChange={(value) => searchBible(Number(value), 1, 1)}
                >
                  <Select.Trigger>
                    <Select.Value asChild>
                      <span className="text-[18px] font-bold">{bookName}</span>
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="overflow-hidden bg-white rounded-md shadow-sm">
                      <Select.Viewport className="p-4pxr">
                        <Select.Group>
                          {bookInfo.map((el) => (
                            <Select.Item
                              key={el.id}
                              value={String(el.id)}
                              className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] rounded-md select-none cursor-pointer hover:bg-[#F8FAFC]"
                            >
                              <Select.ItemText>{el.name}</Select.ItemText>
                              <Select.ItemIndicator className="inline-flex items-center justify-center">
                                <IconCheck size={14} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={() => searchBible(book, chapter - 1, 1)}
                    size="icon"
                    disabled={chapter <= 1}
                  >
                    <IconArrowLeft size={18} />
                  </Button>
                  <Select.Root
                    value={String(chapter)}
                    onValueChange={(value) => searchBible(book, Number(value), 1)}
                  >
                    <Select.Trigger>
                      <Select.Value asChild>
                        <div className="flex justify-center items-center mx-16pxr text-[18px] font-bold">
                          <span>{chapter}장</span>
                          <span className="mx-8pxr">/</span>
                          <span>{lastChapter}장</span>
                        </div>
                      </Select.Value>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="overflow-hidden bg-white rounded-md shadow-sm">
                        <Select.Viewport className="p-4pxr">
                          <Select.Group>
                            {bibleCountInfo
                              .filter((el) => el.book === book)
                              .map((el) => (
                                <Select.Item
                                  key={el.chapter}
                                  value={String(el.chapter)}
                                  className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] rounded-md select-none cursor-pointer hover:bg-[#F8FAFC]"
                                >
                                  <Select.ItemText>{el.chapter}장</Select.ItemText>
                                  <Select.ItemIndicator className="inline-flex items-center justify-center">
                                    <IconCheck size={14} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                          </Select.Group>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
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
            <div className="flex items-center shrink-0 w-400pxr h-40pxr">
              <BibleAudioPlayer url={bibleSoundFileLocation} onProgress={handleProgress} />
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex justify-end grow items-center">
              <Button type="button" onClick={() => setOpenSettingsModal(true)} size="icon">
                <IconSettings size={18} />
              </Button>
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-8pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0">
              <CustomSelect
                placeholder="주석 선택"
                itemList={[
                  { key: '사용 안 함', value: '사용 안 함', text: '사용 안 함' },
                  { key: '매튜헨리', value: '매튜헨리', text: '매튜헨리' },
                  { key: '성경관주', value: '성경관주', text: '성경관주' }
                ]}
                value={commentaryName}
                setValue={(value) => changeCommentary(value)}
              />
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
