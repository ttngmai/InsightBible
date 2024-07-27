import tw, { css, TwStyle } from 'twin.macro'
import Button from './Button'
import {
  IconArrowLeft,
  IconArrowRight,
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
  readWriteReadingRangeAtom,
  readWriteVerseAtom,
  readWriteVoiceTypeAtom
} from '@renderer/store'
import SettingsModal from '../SettingsModal'
import useSearchBible from '@renderer/hooks/useSearchBible'
import CustomSelect from './CustomSelect'
import useChangeBible from '@renderer/hooks/useChangeBible'
import BibleAudioPlayer from '../bible/BibleAudioPlayer'
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
  const [readingRange, setReadingRange] = useAtom(readWriteReadingRangeAtom)
  const [bibleSoundTimeStamp, setBibleSoundTimeStamp] = useAtom(readWriteBibleSoundTimeStampAtom)
  const [currentReadingPosition, setCurrentReadingPosition] = useAtom(
    readWriteCurrentReadingPositionAtom
  )

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false)
  const [lastChapter, setLastChapter] = useState<number>(0)
  const [bibleSoundFileLocation, setBibleSoundFileLocation] = useState<string>('')
  const [readingStartBook, setReadingStartBook] = useState<number | null>(null)
  const [readingEndBook, setReadingEndBook] = useState<number | null>(null)
  const [openBibleSearchModal, setOpenBibleSearchModal] = useState<boolean>(false)
  const [openSettingsModal, setOpenSettingsModal] = useState<boolean>(false)

  const bookName = bookInfo.find((el) => el.id === book)?.name

  const changeBible = useChangeBible()
  const searchBible = useSearchBible()

  const handleReadingRange = (value: number): void => {
    if (readingStartBook && readingEndBook) {
      setReadingStartBook(value)
      setReadingEndBook(null)
    } else if (readingStartBook) {
      if (readingStartBook <= value) {
        setReadingEndBook(value)
      } else {
        setReadingStartBook(value)
        setReadingEndBook(readingStartBook)
      }
    } else {
      setReadingStartBook(value)
    }
  }

  const handleResetReadingRange = (): void => {
    setReadingStartBook(null)
    setReadingEndBook(null)
    setReadingRange(null)
  }

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
      const audioFilePath = await window.context.getAudioFilePath(
        `bible/${bibleName}/${voiceType}/${book}_${chapter}.mp3`
      )
      const timeStamp = await window.context.findBibleSoundTimeStamp(
        `${bibleName}_${voiceType}음성_타임스탬프`,
        book,
        chapter
      )

      setCurrentReadingPosition(null)
      setBibleSoundFileLocation(`file://${audioFilePath}`)
      setBibleSoundTimeStamp(timeStamp)
    })()
  }, [bibleName, book, chapter, voiceType])

  useEffect(() => {
    if (readingStartBook === null || readingEndBook === null) return

    const endChapter =
      bibleCountInfo
        .filter((el) => el.book === readingEndBook)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0

    setReadingRange({
      startBook: Number(readingStartBook),
      startChapter: 1,
      endBook: Number(readingEndBook),
      endChapter: Number(endChapter)
    })
  }, [readingStartBook, readingEndBook])

  useEffect(() => {
    if (readingRange === null) {
      setReadingStartBook(null)
      setReadingEndBook(null)
      return
    }

    if (book !== readingRange.startBook || chapter !== readingRange.startChapter) {
      searchBible(readingRange.startBook, readingRange.startChapter, 1)
    }
  }, [readingRange])

  return (
    <>
      <div className="flex">
        {canScrollLeft && (
          <Button
            type="button"
            onClick={() => handleScroll(-1)}
            variant="ghost"
            sx={tw`sticky left-0 h-60pxr border border-t-0 border-gray-300 bg-white rounded-none`}
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
            <div className="flex justify-center items-center shrink-0 w-fit">
              <div className="flex justify-start items-center text-[18px] font-bold text-brand-blue-500">
                <span>{bibleName}</span>
              </div>
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0 w-fit">
              <div className="flex items-center gap-8pxr mx-auto">
                <Popover.Root>
                  <Popover.Trigger>
                    <span className="text-[18px] font-bold text-brand-blue-500">{bookName}</span>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      sideOffset={5}
                      className="flex max-h-384pxr overflow-hidden bg-white rounded-md shadow-sm"
                      style={{
                        height: 'calc(var(--radix-popover-content-available-height) - 16px)'
                      }}
                    >
                      <div className="flex flex-col w-300pxr">
                        <div className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr border-b border-b-gray-300 text-[14px] font-bold">
                          {readingStartBook === null && readingEndBook === null ? (
                            <span>낭독 범위 지정하기</span>
                          ) : (
                            <>
                              <span className="text-brand-blue-500">
                                {bookInfo.find((el) => el.id === readingStartBook)?.name || '?'}
                              </span>
                              <span>~</span>
                              <span className="text-brand-blue-500">
                                {bookInfo.find((el) => el.id === readingEndBook)?.name || '?'}
                              </span>
                              <span>낭독</span>
                              <Button
                                type="button"
                                onClick={handleResetReadingRange}
                                variant="ghost"
                                sx={tw`h-16pxr ml-auto text-red-500`}
                              >
                                지정 해지
                              </Button>
                            </>
                          )}
                        </div>
                        <div className="flex items-center h-32pxr px-8pxr py-4pxr border-b border-b-gray-300 font-bold text-[14px]">
                          <p className="flex-1">구약</p>
                          <p className="flex-1">신약</p>
                        </div>
                        <div className="flex h-[calc(100%-64px)]">
                          <ul className="flex-1 overflow-y-auto scroll-hidden">
                            {bookInfo.slice(0, 39).map((el) => (
                              <li
                                key={el.id}
                                onClick={() => handleReadingRange(el.id)}
                                className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:font-bold"
                                css={[
                                  (readingStartBook &&
                                    readingEndBook &&
                                    readingStartBook <= el.id &&
                                    el.id <= readingEndBook) ||
                                  readingStartBook === el.id
                                    ? tw`bg-brand-blue-50 font-bold`
                                    : tw`hover:bg-[#F8FAFC]`
                                ]}
                              >
                                <span>{el.name}</span>
                              </li>
                            ))}
                          </ul>
                          <ul className="flex-1 overflow-y-auto scroll-hidden">
                            {bookInfo.slice(39).map((el) => (
                              <li
                                key={el.id}
                                onClick={() => handleReadingRange(el.id)}
                                className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:font-bold"
                                css={[
                                  (readingStartBook &&
                                    readingEndBook &&
                                    readingStartBook <= el.id &&
                                    el.id <= readingEndBook) ||
                                  readingStartBook === el.id
                                    ? tw`bg-brand-blue-50 font-bold`
                                    : tw`hover:bg-[#F8FAFC]`
                                ]}
                              >
                                <span>{el.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Popover.Arrow className="fill-gray-300" />
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
                    <div className="flex justify-center items-center mx-8pxr text-[18px] font-bold">
                      <span className="text-brand-blue-500">
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
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
              decorative
              orientation="vertical"
            />
            <div className="flex items-center shrink-0 w-280pxr h-40pxr">
              <BibleAudioPlayer url={bibleSoundFileLocation} onProgress={handleProgress} />
            </div>
            <Separator.Root
              className="shrink-0 inline-block data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-12pxr bg-gray-300"
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
