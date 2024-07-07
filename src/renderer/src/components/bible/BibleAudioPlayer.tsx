import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import * as Slider from '@radix-ui/react-slider'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Button from '../common/Button'
import {
  IconAdjustmentsHorizontal,
  IconArrowAutofitWidth,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolumeOff
} from '@tabler/icons-react'
import tw from 'twin.macro'
import { OnProgressProps } from 'react-player/base'
import formatTime from '@renderer/utils/timeFormat'
import { useAtom, useAtomValue } from 'jotai'
import {
  readWriteBookAtom,
  readWriteChapterAtom,
  readWriteReadingRangeAtom,
  readWriteVoiceTypeAtom
} from '@renderer/store'
import { bibleCountInfo, bookInfo } from '@shared/constants'
import useSearchBible from '@renderer/hooks/useSearchBible'
import * as Popover from '@radix-ui/react-popover'

type BibleAudioPlayerProps = {
  url: string
  onProgress: (state: OnProgressProps) => void
}

function BibleAudioPlayer({ url, onProgress }: BibleAudioPlayerProps): JSX.Element {
  const playerRef = useRef<ReactPlayer>(null)

  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const [voiceType, setVoiceType] = useAtom(readWriteVoiceTypeAtom)
  const [readingRange, setReadingRange] = useAtom(readWriteReadingRangeAtom)

  const [playing, setPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [seeking, setSeeking] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const [playbackRate, setPlaybackRate] = useState<number>(1.0)
  const [progressInterval, setProgressInterval] = useState<number>(300)
  const [lastChapter, setLastChapter] = useState<number>(0)
  const [startBook, setStartBook] = useState<number | null>(null)
  const [endBook, setEndBook] = useState<number | null>(null)

  const searchBible = useSearchBible()

  const handlePlayOrPause = (): void => {
    setPlaying(!playing)
  }

  const handleProgress = (state: OnProgressProps): void => {
    if (!seeking) {
      setCurrentTime(state.playedSeconds)
    }
    onProgress(state)
  }

  const handleSliderChange = (value: number[]): void => {
    setCurrentTime(value[0])
  }

  const handleMuted = (): void => {
    setMuted(!muted)
  }

  const handlePlaybackRate = (rate: number): void => {
    setPlaybackRate(rate)
  }

  const handleVolumeChange = (volume: number[]): void => {
    setVolume(volume[0])
    setMuted(volume[0] === 0 ? true : false)
  }

  const handleEnded = (): void => {
    if (readingRange === null) return

    if (book === readingRange.endBook) {
      if (chapter < readingRange.endChapter) {
        searchBible(book, chapter + 1, 1)
      } else if (chapter === readingRange.endChapter) {
        setReadingRange(null)
      }
    } else {
      if (chapter === lastChapter) {
        searchBible(book + 1, 1, 1)
      } else {
        searchBible(book, chapter + 1, 1)
      }
    }
  }

  const handleReadingRange = (value: number): void => {
    if (startBook && endBook) {
      setStartBook(value)
      setEndBook(null)
    } else if (startBook) {
      if (startBook <= value) {
        setEndBook(value)
      } else {
        setStartBook(value)
        setEndBook(startBook)
      }
    } else {
      setStartBook(value)
    }
  }

  const handleResetReadingRange = (): void => {
    setStartBook(null)
    setEndBook(null)
    setReadingRange(null)
  }

  useEffect(() => {
    if (seeking && playerRef.current) {
      playerRef.current.seekTo(currentTime / duration, 'fraction')
    }
  }, [currentTime, duration])

  useEffect(() => {
    setProgressInterval(playbackRate < 3 ? 200 : 100)
  }, [playbackRate])

  useEffect(() => {
    if (readingRange === null) {
      setStartBook(null)
      setEndBook(null)
      return
    }

    if (book !== readingRange.startBook || chapter !== readingRange.startChapter) {
      searchBible(readingRange.startBook, readingRange.startChapter, 1)
    }

    if (playerRef.current) {
      playerRef.current.seekTo(0)
    }
  }, [readingRange])

  useEffect(() => {
    setLastChapter(
      bibleCountInfo
        .filter((el) => el.book === book)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0
    )
  }, [book])

  useEffect(() => {
    if (readingRange === null) return

    if (readingRange.startBook <= book && book <= readingRange.endBook) {
      if (book === readingRange.endBook && chapter > readingRange.endChapter) {
        setReadingRange(null)
      }
    } else {
      setReadingRange(null)
    }
  }, [book, chapter])

  useEffect(() => {
    if (startBook === null || endBook === null) return

    const endChapter =
      bibleCountInfo
        .filter((el) => el.book === endBook)
        .map((el) => el.chapter)
        .sort((a, b) => b - a)[0] || 0

    setReadingRange({
      startBook: Number(startBook),
      startChapter: 1,
      endBook: Number(endBook),
      endChapter: Number(endChapter)
    })
  }, [startBook, endBook])

  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        ref={playerRef}
        controls={false}
        url={url}
        playing={playing && !seeking}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        onDuration={setDuration}
        onProgress={handleProgress}
        onEnded={handleEnded}
        progressInterval={progressInterval}
        width="100%"
        height="100%"
      />
      <div className="absolute inset-0 flex flex-col">
        <Slider.Root
          max={duration}
          step={0.1}
          value={[currentTime]}
          onValueChange={handleSliderChange}
          onPointerDown={() => setSeeking(true)}
          onPointerUp={() => setSeeking(false)}
          className="flex items-center grow h-full select-none touch-none"
        >
          <Slider.Track className="relative grow h-4pxr bg-gray-300 rounded-full">
            <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
        </Slider.Root>
        <div className="flex justify-between items-center">
          <div className="flex">
            <Button type="button" onClick={handlePlayOrPause} variant="ghost" size="icon">
              {playing ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
            </Button>
            <Button type="button" onClick={handleMuted} variant="ghost" size="icon">
              {muted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
            </Button>
            <div className="relative w-50pxr ml-2pxr">
              <Slider.Root
                max={1}
                step={0.1}
                value={muted ? [0] : [volume]}
                onValueChange={handleVolumeChange}
                className="flex items-center grow h-full select-none touch-none"
              >
                <Slider.Track className="relative grow h-3pxr bg-gray-300 rounded-full">
                  <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-8pxr h-8pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
              </Slider.Root>
            </div>
          </div>
          <span>
            {formatTime(currentTime / playbackRate)} / {formatTime(duration / playbackRate)}
          </span>
          <div>
            <Popover.Root>
              <Popover.Trigger>
                <button
                  type="button"
                  className="inline-flex justify-center items-center h-32pxr w-32pxr rounded-md cursor-pointer hover:bg-[#F4F4F5]"
                >
                  <IconArrowAutofitWidth size={18} />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  sideOffset={5}
                  className="flex max-h-352pxr overflow-hidden bg-white rounded-md shadow-sm"
                  style={{
                    height: 'calc(var(--radix-popover-content-available-height) - 16px)'
                  }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4pxr h-40pxr px-8pxr py-4pxr border-b border-b-gray-300 text-[14px]">
                      {startBook === null && endBook === null ? (
                        <span>낭독 범위 지정</span>
                      ) : (
                        <>
                          <span className="font-bold">
                            {bookInfo.find((el) => el.id === startBook)?.name || '?'}
                          </span>
                          <span>~</span>
                          <span className="font-bold">
                            {bookInfo.find((el) => el.id === endBook)?.name || '?'}
                          </span>
                          <span>낭독</span>
                          <Button
                            type="button"
                            onClick={handleResetReadingRange}
                            variant="ghost"
                            sx={tw`h-16pxr ml-auto text-red-500`}
                          >
                            해제
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex h-[calc(100%-32px)] w-240pxr">
                      <ul className="flex-1 overflow-y-auto scroll-hidden">
                        {bookInfo.slice(0, 39).map((el) => (
                          <li
                            key={el.id}
                            onClick={() => handleReadingRange(el.id)}
                            className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] select-none cursor-pointer hover:font-bold"
                            css={[
                              (startBook && endBook && startBook <= el.id && el.id <= endBook) ||
                              startBook === el.id
                                ? tw`bg-brand-blue-50`
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
                              (startBook && endBook && startBook <= el.id && el.id <= endBook) ||
                              startBook === el.id
                                ? tw`bg-brand-blue-50`
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex justify-center items-center h-32pxr w-32pxr rounded-md cursor-pointer hover:bg-[#F4F4F5]"
                >
                  <IconAdjustmentsHorizontal size={18} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="w-120pxr rounded border bg-white" align="end">
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger className="flex items-center px-8pxr py-2pxr cursor-pointer select-none outline-none">
                      재생 속도
                      <div className="ml-auto -mr-4pxr">
                        <IconChevronRight size={18} />
                      </div>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent
                        sideOffset={2}
                        className="w-120pxr rounded border bg-white overflow-hidden"
                      >
                        <div className="flex flex-col justify-center items-center p-8pxr">
                          <input
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={playbackRate}
                            onChange={(event) => handlePlaybackRate(Number(event.target.value))}
                            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                          />
                          <span>{playbackRate.toFixed(1)} 배속</span>
                        </div>
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger className="flex items-center px-8pxr py-2pxr cursor-pointer select-none outline-none">
                      음성 선택
                      <div className="ml-auto -mr-4pxr">
                        <IconChevronRight size={18} />
                      </div>
                    </DropdownMenu.SubTrigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.SubContent
                        sideOffset={2}
                        className="w-120pxr rounded border bg-white overflow-hidden"
                      >
                        {['남성', '여성'].map((voice) => (
                          <DropdownMenu.Item
                            key={voice}
                            onClick={() => setVoiceType(voice)}
                            css={[
                              tw`px-8pxr py-2pxr cursor-pointer select-none outline-none`,
                              voice === voiceType ? tw`bg-brand-blue-50` : tw`hover:bg-gray-100`
                            ]}
                          >
                            {voice}
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.SubContent>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Arrow className="fill-gray-300" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BibleAudioPlayer
