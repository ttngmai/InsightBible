import { useAtom } from 'jotai'
import Modal from './common/Modal'
import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleTextColorAtom,
  readWriteCommentaryBackgroundColorAtom,
  readWriteCommentaryTextColor,
  readWriteCurrentReadingTextColorAtom,
  readWriteBibleTextSizeAtom,
  readWriteCommentaryTextSizeAtom
} from '@renderer/store'
import { IconHighlight, IconPaint, IconPalette, IconTextSize } from '@tabler/icons-react'
import * as Tabs from '@radix-ui/react-tabs'
import { useState } from 'react'
import Button from './common/Button'
import ColorPickerModal from './ColorPickerModal'
import ModalPortal from '@renderer/utils/ModalPortal'
import tw, { css } from 'twin.macro'
import CustomSelect from './common/CustomSelect'

type SettingsModalProps = {
  onClose: () => void
}

const tabsTriggerStyle = css`
  ${tw`flex-1 flex items-center justify-center h-32pxr p-4pxr leading-none select-none data-[state=active]:text-brand-blue-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current`}
`
const tabsContentStyle = css`
  ${tw`flex flex-col grow justify-center items-center`}
`
const contentTableStyle = css`
  th,
  td {
    ${tw`py-4pxr`}
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
  const [commentaryBackgroundColor, setCommentaryBackgroundColor] = useAtom(
    readWriteCommentaryBackgroundColorAtom
  )
  const [commentaryTextSize, setCommentaryTextSize] = useAtom(readWriteCommentaryTextSizeAtom)
  const [commentaryTextColor, setCommentaryTextColor] = useAtom(readWriteCommentaryTextColor)

  const [openBibleBackgroundColorPickerModal, setOpenBibleBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openBibleTextColorPickerModal, setOpenBibleTextColorPickerModal] = useState<boolean>(false)
  const [openCurrentReadingTextColorPickerModal, setOpenCurrentReadingTextColorPickerModal] =
    useState<boolean>(false)
  const [openCommentaryBackgroundColorPickerModal, setOpenCommentaryBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openCommentaryTextColorPickerModal, setOpenCommentaryTextColorPickerModal] =
    useState<boolean>(false)

  return (
    <>
      <Modal title="설정" onClose={onClose}>
        <div className="flex w-600pxr h-360pxr p-16pxr bg-white">
          <Tabs.Root defaultValue="성경" className="flex flex-col w-full">
            <Tabs.List className="flex shrink-0 border-b">
              <Tabs.Trigger value="성경" css={[tabsTriggerStyle]}>
                성경
              </Tabs.Trigger>
              <Tabs.Trigger value="주석" css={[tabsTriggerStyle]}>
                주석
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="성경" css={[tabsContentStyle]}>
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
            </Tabs.Content>
            <Tabs.Content value="주석" css={[tabsContentStyle]}>
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
                      onClick={() => setOpenCommentaryBackgroundColorPickerModal(true)}
                      sx={tw`w-26pxr h-26pxr p-2pxr bg-black rounded-full`}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: commentaryBackgroundColor }}
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
                      value={String(commentaryTextSize)}
                      itemList={Array.from({ length: 45 }, (_, idx) => idx + 16).map((el) => ({
                        key: String(el),
                        value: String(el),
                        text: `${el} px`
                      }))}
                      setValue={(value) => setCommentaryTextSize(Number(value))}
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
                      onClick={() => setOpenCommentaryTextColorPickerModal(true)}
                      sx={tw`w-26pxr h-26pxr p-2pxr bg-black rounded-full`}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: commentaryTextColor }}
                      />
                    </Button>
                  </td>
                </tr>
              </table>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </Modal>

      {openBibleBackgroundColorPickerModal && (
        <ModalPortal>
          <div>
            <ColorPickerModal
              title="배경색 선택"
              defaultColor={bibleBackgroundColor}
              onColorSelect={(color: string) => {
                setBibleBackgroundColor(color)
                setOpenBibleBackgroundColorPickerModal(false)
              }}
              onClose={() => setOpenBibleBackgroundColorPickerModal(false)}
            />
          </div>
        </ModalPortal>
      )}
      {openBibleTextColorPickerModal && (
        <ModalPortal>
          <div>
            <ColorPickerModal
              title="글자색 선택"
              defaultColor={bibleTextColor}
              onColorSelect={(color: string) => {
                setBibleTextColor(color)
                setOpenBibleTextColorPickerModal(false)
              }}
              onClose={() => setOpenBibleTextColorPickerModal(false)}
            />
          </div>
        </ModalPortal>
      )}
      {openCurrentReadingTextColorPickerModal && (
        <ModalPortal>
          <div>
            <ColorPickerModal
              title="강조색 선택"
              defaultColor={currentReadingTextColor || bibleTextColor}
              onColorSelect={(color: string) => {
                setCurrentReadingTextColor(color)
                setOpenCurrentReadingTextColorPickerModal(false)
              }}
              onClose={() => setOpenCurrentReadingTextColorPickerModal(false)}
            />
          </div>
        </ModalPortal>
      )}
      {openCommentaryBackgroundColorPickerModal && (
        <ModalPortal>
          <div>
            <ColorPickerModal
              title="배경색 선택"
              defaultColor={commentaryBackgroundColor}
              onColorSelect={(color: string) => {
                setCommentaryBackgroundColor(color)
                setOpenCommentaryBackgroundColorPickerModal(false)
              }}
              onClose={() => setOpenCommentaryBackgroundColorPickerModal(false)}
            />
          </div>
        </ModalPortal>
      )}
      {openCommentaryTextColorPickerModal && (
        <ModalPortal>
          <div>
            <ColorPickerModal
              title="글자색 선택"
              defaultColor={commentaryTextColor}
              onColorSelect={(color: string) => {
                setCommentaryTextColor(color)
                setOpenCommentaryTextColorPickerModal(false)
              }}
              onClose={() => setOpenCommentaryTextColorPickerModal(false)}
            />
          </div>
        </ModalPortal>
      )}
    </>
  )
}

export default SettingsModal
