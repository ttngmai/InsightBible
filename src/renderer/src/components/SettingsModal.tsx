import { useAtom } from 'jotai'
import Modal from './common/Modal'
import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleTextColorAtom,
  readWriteCurrentReadingTextColorAtom,
  readWriteBibleTextSizeAtom
} from '@renderer/store'
import { IconHighlight, IconPaint, IconPalette, IconTextSize } from '@tabler/icons-react'
import { useState } from 'react'
import Button from './common/Button'
import ColorPickerModal from './ColorPickerModal'
import ModalPortal from '@renderer/utils/ModalPortal'
import tw, { css } from 'twin.macro'
import CustomSelect from './common/CustomSelect'

type SettingsModalProps = {
  onClose: () => void
}

const contentTableStyle = css`
  th,
  td {
    ${tw`py-8pxr`}
  }
  td {
    ${tw`text-center`}
  }
`

function SettingsModal({ onClose }: SettingsModalProps): JSX.Element {
  const [bibleBackgroundColor, setBibleBackgroundColor] = useAtom(readWriteBibleBackgroundColorAtom)
  const [bibleTextSize, setBibleTextSize] = useAtom(readWriteBibleTextSizeAtom)
  const [bibleTextColor, setBibleTextColor] = useAtom(readWriteBibleTextColorAtom)
  const [currentReadingTextColor, setCurrentReadingTextColor] = useAtom(
    readWriteCurrentReadingTextColorAtom
  )

  const [openBibleBackgroundColorPickerModal, setOpenBibleBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openBibleTextColorPickerModal, setOpenBibleTextColorPickerModal] = useState<boolean>(false)
  const [openCurrentReadingTextColorPickerModal, setOpenCurrentReadingTextColorPickerModal] =
    useState<boolean>(false)

  return (
    <>
      <Modal title="설정" onClose={onClose}>
        <div className="flex flex-col justify-center items-center w-360pxr h-240pxr p-16pxr bg-white">
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
