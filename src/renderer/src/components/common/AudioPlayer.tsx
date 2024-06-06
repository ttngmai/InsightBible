import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import * as Slider from '@radix-ui/react-slider'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Button from './Button'
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
import { useAtom } from 'jotai'
import { readWriteVoiceTypeAtom } from '@renderer/store'

type AudioPlayerProps = {
  url: string
  onProgress: (state: OnProgressProps) => void
}

function AudioPlayer({ url, onProgress }: AudioPlayerProps): JSX.Element {
  const playerRef = useRef<ReactPlayer>(null)

  const [voiceType, setVoiceType] = useAtom(readWriteVoiceTypeAtom)

  const [playing, setPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [seeking, setSeeking] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const [playbackRate, setPlaybackRate] = useState<number>(1.0)
  const [progressInterval, setProgressInterval] = useState<number>(300)

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

  useEffect(() => {
    if (seeking && playerRef.current) {
      playerRef.current.seekTo(currentTime / duration, 'fraction')
    }
  }, [currentTime, duration])

  useEffect(() => {
    if (seeking) {
      setPlaying(false)
    }
  }, [seeking])

  useEffect(() => {
    setProgressInterval(playbackRate < 3 ? 300 : 150)
  }, [playbackRate])

  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        ref={playerRef}
        controls={false}
        url={url}
        playing={playing}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        onDuration={setDuration}
        onProgress={handleProgress}
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
          <span className="flex w-full ml-8pxr">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex justify-center items-center h-32pxr w-32pxr rounded-md text-black cursor-pointer hover:bg-[#F4F4F5]"
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
                        {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map((rate) => (
                          <DropdownMenu.Item
                            key={rate}
                            onClick={() => handlePlaybackRate(rate)}
                            css={[
                              tw`px-8pxr py-2pxr cursor-pointer select-none outline-none`,
                              rate === playbackRate ? tw`bg-brand-blue-50` : tw`hover:bg-gray-100`
                            ]}
                          >
                            {rate}
                          </DropdownMenu.Item>
                        ))}
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

export default AudioPlayer
