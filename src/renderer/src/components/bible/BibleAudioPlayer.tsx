import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import * as Slider from '@radix-ui/react-slider'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Button from '../common/Button'
import {
  IconAdjustmentsHorizontal,
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
import { bibleCountInfo } from '@shared/constants'
import useSearchBible from '@renderer/hooks/useSearchBible'

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

  useEffect(() => {
    if (seeking && playerRef.current) {
      playerRef.current.seekTo(currentTime / duration, 'fraction')
    }
  }, [currentTime, duration])

  useEffect(() => {
    setProgressInterval(playbackRate < 3 ? 200 : 100)
  }, [playbackRate])

  useEffect(() => {
    if (readingRange === null) return

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
              {playing ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
            </Button>
            <Button type="button" onClick={handleMuted} variant="ghost" size="icon">
              {muted ? <IconVolumeOff size={24} /> : <IconVolume size={24} />}
            </Button>
            <div className="relative w-60pxr ml-2pxr">
              <Slider.Root
                max={1}
                step={0.1}
                value={muted ? [0] : [volume]}
                onValueChange={handleVolumeChange}
                className="flex items-center grow h-full select-none touch-none"
              >
                <Slider.Track className="relative grow h-4pxr bg-gray-300 rounded-full">
                  <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
              </Slider.Root>
            </div>
          </div>
          <span className="text-[18px]">
            {formatTime(currentTime / playbackRate)} / {formatTime(duration / playbackRate)}
          </span>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex justify-center items-center h-32pxr w-32pxr rounded-md cursor-pointer hover:bg-[#F4F4F5]"
                >
                  <IconAdjustmentsHorizontal size={24} />
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
                              voice === voiceType
                                ? tw`bg-brand-blue-50 font-bold`
                                : tw`hover:bg-gray-100`
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
