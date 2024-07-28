import { useAtom } from 'jotai'
import Modal from './common/Modal'
import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleTextColorAtom,
  readWriteCurrentReadingTextColorAtom,
  readWriteBibleTextSizeAtom,
  readWriteEnableAutoScrollingAtom,
  readWriteAutoScrollingSpeedAtom,
  readWritePlaybackRate
} from '@renderer/store'
import {
  IconArrowAutofitDown,
  IconChevronsDown,
  IconChevronsRight,
  IconHighlight,
  IconPaint,
  IconPalette,
  IconTextSize
} from '@tabler/icons-react'
import { useState } from 'react'
import Button from './common/Button'
import ColorPickerModal from './ColorPickerModal'
import ModalPortal from '@renderer/utils/ModalPortal'
import tw, { css } from 'twin.macro'
import CustomSelect from './common/CustomSelect'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'

type SettingsModalProps = {
  onClose: () => void
}

const contentTableStyle = css`
  th,
  td {
    ${tw`py-8pxr`}
  }
  td {
    ${tw`flex justify-center items-center`}
  }
`

function SettingsModal({ onClose }: SettingsModalProps): JSX.Element {
  const [bibleBackgroundColor, setBibleBackgroundColor] = useAtom(readWriteBibleBackgroundColorAtom)
  const [bibleTextSize, setBibleTextSize] = useAtom(readWriteBibleTextSizeAtom)
  const [bibleTextColor, setBibleTextColor] = useAtom(readWriteBibleTextColorAtom)
  const [currentReadingTextColor, setCurrentReadingTextColor] = useAtom(
    readWriteCurrentReadingTextColorAtom
  )
  const [enableAutoScrolling, setEnableAutoScrolling] = useAtom(readWriteEnableAutoScrollingAtom)
  const [autoScrollingSpeed, setAutoScrollingSpeed] = useAtom(readWriteAutoScrollingSpeedAtom)
  const [playbackRate, setPlaybackRate] = useAtom(readWritePlaybackRate)

  const [openBibleBackgroundColorPickerModal, setOpenBibleBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openBibleTextColorPickerModal, setOpenBibleTextColorPickerModal] = useState<boolean>(false)
  const [openCurrentReadingTextColorPickerModal, setOpenCurrentReadingTextColorPickerModal] =
    useState<boolean>(false)

  const handleAutoScrollingSpeed = (speed: number[]): void => {
    setAutoScrollingSpeed(speed[0])
  }

  const handlePlaybackRate = (speed: number[]): void => {
    setPlaybackRate(speed[0])
  }

  return (
    <>
      <Modal title="설정" onClose={onClose}>
        <div className="flex flex-col justify-center items-center w-300pxr min-h-240pxr p-16pxr bg-white">
          <table css={[contentTableStyle, tw`w-200pxr`]}>
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconPaint size={18} />
                  <span>배경색</span>
                </div>
              </th>
              <td>
                <Button
                  type="button"
                  onClick={() => setOpenBibleBackgroundColorPickerModal(true)}
                  sx={tw`w-26pxr h-26pxr p-2pxr bg-black rounded-full`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: bibleBackgroundColor }}
                  />
                </Button>
              </td>
            </tr>
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconTextSize size={18} />
                  <span>글자 크기</span>
                </div>
              </th>
              <td>
                <CustomSelect
                  value={String(bibleTextSize)}
                  itemList={Array.from({ length: 45 }, (_, idx) => idx + 16).map((el) => ({
                    key: String(el),
                    value: String(el),
                    text: `${el} px`
                  }))}
                  setValue={(value) => setBibleTextSize(Number(value))}
                />
              </td>
            </tr>
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconPalette size={18} />
                  <span>글자색</span>
                </div>
              </th>
              <td>
                <Button
                  type="button"
                  onClick={() => setOpenBibleTextColorPickerModal(true)}
                  sx={tw`w-26pxr h-26pxr p-2pxr bg-black rounded-full`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: bibleTextColor }}
                  />
                </Button>
              </td>
            </tr>
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconHighlight size={18} />
                  <span>강조색</span>
                </div>
              </th>
              <td>
                <Button
                  type="button"
                  onClick={() => setOpenCurrentReadingTextColorPickerModal(true)}
                  sx={tw`w-26pxr h-26pxr p-2pxr bg-black rounded-full`}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: currentReadingTextColor || bibleTextColor }}
                  />
                </Button>
              </td>
            </tr>
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconArrowAutofitDown size={18} />
                  <span>자동 스크롤</span>
                </div>
              </th>
              <td>
                <Switch.Root
                  checked={enableAutoScrolling}
                  onCheckedChange={() => setEnableAutoScrolling(!enableAutoScrolling)}
                  className="relative w-[42px] h-[25px] bg-gray-400 rounded-full shadow outline-none data-[state=checked]:bg-brand-blue-500"
                >
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
              </td>
            </tr>
            {enableAutoScrolling && (
              <>
                <tr>
                  <th>
                    <div className="flex items-center gap-8pxr">
                      <IconChevronsDown size={18} />
                      <span className="font-bold">스크롤 속도</span>
                    </div>
                  </th>
                  <td>
                    <span>{autoScrollingSpeed.toFixed(1)}</span>
                  </td>
                </tr>
                <tr>
                  <th colSpan={2} className="relative !pt-0">
                    <Slider.Root
                      min={1.0}
                      max={150.0}
                      step={0.1}
                      value={[autoScrollingSpeed]}
                      onValueChange={handleAutoScrollingSpeed}
                      className="flex items-center grow h-full select-none touch-none"
                    >
                      <Slider.Track className="relative grow h-6pxr bg-gray-300 rounded-full">
                        <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
                    </Slider.Root>
                  </th>
                </tr>
              </>
            )}
            <tr>
              <th>
                <div className="flex items-center gap-8pxr">
                  <IconChevronsRight size={18} />
                  <span className="font-bold">재생 속도</span>
                </div>
              </th>
              <td>
                <span>{playbackRate.toFixed(1)}</span>
              </td>
            </tr>
            <tr>
              <th colSpan={2} className="relative !pt-0">
                <Slider.Root
                  min={1.0}
                  max={5.0}
                  step={0.1}
                  value={[playbackRate]}
                  onValueChange={handlePlaybackRate}
                  className="flex items-center grow h-full select-none touch-none"
                >
                  <Slider.Track className="relative grow h-6pxr bg-gray-300 rounded-full">
                    <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
                </Slider.Root>
              </th>
            </tr>
          </table>
        </div>
      </Modal>

      {openBibleBackgroundColorPickerModal && (
        <ModalPortal>
          <ColorPickerModal
            title="배경색 선택"
            defaultColor={bibleBackgroundColor}
            onColorSelect={(color: string) => {
              setBibleBackgroundColor(color)
              setOpenBibleBackgroundColorPickerModal(false)
            }}
            onClose={() => setOpenBibleBackgroundColorPickerModal(false)}
          />
        </ModalPortal>
      )}
      {openBibleTextColorPickerModal && (
        <ModalPortal>
          <ColorPickerModal
            title="글자색 선택"
            defaultColor={bibleTextColor}
            onColorSelect={(color: string) => {
              setBibleTextColor(color)
              setOpenBibleTextColorPickerModal(false)
            }}
            onClose={() => setOpenBibleTextColorPickerModal(false)}
          />
        </ModalPortal>
      )}
      {openCurrentReadingTextColorPickerModal && (
        <ModalPortal>
          <ColorPickerModal
            title="강조색 선택"
            defaultColor={currentReadingTextColor || bibleTextColor}
            onColorSelect={(color: string) => {
              setCurrentReadingTextColor(color)
              setOpenCurrentReadingTextColorPickerModal(false)
            }}
            onClose={() => setOpenCurrentReadingTextColorPickerModal(false)}
          />
        </ModalPortal>
      )}
    </>
  )
}

export default SettingsModal
