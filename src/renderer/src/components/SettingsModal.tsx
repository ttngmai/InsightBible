import { useAtom } from 'jotai'
import Modal from './common/Modal'
import {
  bibleBackgroundColorAtom,
  bibleTextColorAtom,
  commentaryBackgroundColorAtom,
  commentaryTextColorAtom,
  fontSizeAtom
} from '@renderer/store'
import { IconPaint, IconPalette, IconTextSize } from '@tabler/icons-react'
import Select from './common/Select'
import SelectItem from './common/SelectItem'
import * as Tabs from '@radix-ui/react-tabs'
import { useState } from 'react'
import Button from './common/Button'
import ColorPickerModal from './ColorPickerModal'
import ModalPortal from '@renderer/utils/ModalPortal'
import tw, { css } from 'twin.macro'

type SettingsModalProps = {
  onClose: () => void
}

const tabsTriggerStyle = css`
  ${tw`flex-1 flex items-center justify-center h-32pxr p-4pxr leading-none select-none data-[state=active]:text-brand-blue-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current`}
`
const tabsContentStyle = css`
  ${tw`flex flex-col gap-16pxr`}
`
const optionItemBoxStyle = css`
  ${tw`flex items-center select-none`}
`

function SettingsModal({ onClose }: SettingsModalProps): JSX.Element {
  const [fontSize, setFontSize] = useAtom(fontSizeAtom)
  const [bibleBackgroundColor, setBibleBackgroundColor] = useAtom(bibleBackgroundColorAtom)
  const [bibleTextColor, setBibleTextColor] = useAtom(bibleTextColorAtom)
  const [commentaryBackgroundColor, setCommentaryBackgroundColor] = useAtom(
    commentaryBackgroundColorAtom
  )
  const [commentaryTextColor, setCommentaryTextColor] = useAtom(commentaryTextColorAtom)

  const [openBibleBackgroundColorPickerModal, setOpenBibleBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openBibleTextColorPickerModal, setOpenBibleTextColorPickerModal] = useState<boolean>(false)
  const [openCommentaryBackgroundColorPickerModal, setOpenCommentaryBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openCommentaryTextColorPickerModal, setOpenCommentaryTextColorPickerModal] =
    useState<boolean>(false)

  return (
    <>
      <Modal title="설정" onClose={onClose}>
        <div className="h-480pxr bg-white">
          <div className="flex w-600pxr h-full">
            <div className="w-full p-16pxr">
              <Tabs.Root defaultValue="공통">
                <Tabs.List className="flex shrink-0 mb-30pxr border-b">
                  <Tabs.Trigger value="공통" css={[tabsTriggerStyle]}>
                    공통
                  </Tabs.Trigger>
                  <Tabs.Trigger value="성경" css={[tabsTriggerStyle]}>
                    성경
                  </Tabs.Trigger>
                  <Tabs.Trigger value="주석" css={[tabsTriggerStyle]}>
                    주석
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="공통" css={[tabsContentStyle]}>
                  <div css={[optionItemBoxStyle]}>
                    <IconTextSize size={18} className="mr-8pxr" />
                    <span className="mr-8pxr">글자 크기</span>
                    <Select
                      defaultValue={fontSize}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setFontSize(Number(e.target.value))
                      }
                    >
                      {Array.from({ length: 60 }, (_, idx) => idx + 1).map((el) => (
                        <SelectItem key={el} value={el}>
                          {`${el} px`}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="성경" css={[tabsContentStyle]}>
                  <div css={[optionItemBoxStyle]}>
                    <IconPaint size={18} className="mr-8pxr" />
                    <span className="mr-8pxr">배경색</span>
                    <Button
                      type="button"
                      onClick={() => setOpenBibleBackgroundColorPickerModal(true)}
                      sx={tw`w-60pxr`}
                    >
                      선택
                    </Button>
                  </div>
                  <div css={[optionItemBoxStyle]}>
                    <IconPalette size={18} className="mr-8pxr" />
                    <span className="mr-8pxr">글자색</span>
                    <Button
                      type="button"
                      onClick={() => setOpenBibleTextColorPickerModal(true)}
                      sx={tw`w-60pxr`}
                    >
                      선택
                    </Button>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="주석" css={[tabsContentStyle]}>
                  <div css={[optionItemBoxStyle]}>
                    <IconPaint size={18} className="mr-8pxr" />
                    <span className="mr-8pxr">배경색</span>
                    <Button
                      type="button"
                      onClick={() => setOpenCommentaryBackgroundColorPickerModal(true)}
                      sx={tw`w-60pxr`}
                    >
                      선택
                    </Button>
                  </div>
                  <div css={[optionItemBoxStyle]}>
                    <IconPalette size={18} className="mr-8pxr" />
                    <span className="mr-8pxr">글자색</span>
                    <Button
                      type="button"
                      onClick={() => setOpenCommentaryTextColorPickerModal(true)}
                      sx={tw`w-60pxr`}
                    >
                      선택
                    </Button>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
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
