import { useAtom } from 'jotai'
import Modal from './common/Modal'
import {
  readWriteBibleBackgroundColorAtom,
  readWriteBibleTextColorAtom,
  readWriteCurrentReadingTextColorAtom,
  readWriteBibleTextSizeAtom,
  readWriteReadingRangeAtom
} from '@renderer/store'
import {
  IconArrowAutofitWidth,
  IconCircleCheck,
  IconCircleX,
  IconHighlight,
  IconPaint,
  IconPalette,
  IconTextSize
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import Button from './common/Button'
import ColorPickerModal from './ColorPickerModal'
import ModalPortal from '@renderer/utils/ModalPortal'
import tw, { css } from 'twin.macro'
import CustomSelect from './common/CustomSelect'
import BiblePicker from './bible/BiblePicker'

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
  const [readingRange, setReadingRange] = useAtom(readWriteReadingRangeAtom)

  const [openBibleBackgroundColorPickerModal, setOpenBibleBackgroundColorPickerModal] =
    useState<boolean>(false)
  const [openBibleTextColorPickerModal, setOpenBibleTextColorPickerModal] = useState<boolean>(false)
  const [openCurrentReadingTextColorPickerModal, setOpenCurrentReadingTextColorPickerModal] =
    useState<boolean>(false)
  const [startBook, setStartBook] = useState<string>(String(readingRange?.startBook || '1'))
  const [startChapter, setStartChapter] = useState<string>(
    String(readingRange?.startChapter || '1')
  )
  const [endBook, setEndBook] = useState<string>(String(readingRange?.endBook || '1'))
  const [endChapter, setEndChapter] = useState<string>(String(readingRange?.endChapter || '1'))

  const handleReadingRange = (): void => {
    setReadingRange({
      startBook: Number(startBook),
      startChapter: Number(startChapter),
      endBook: Number(endBook),
      endChapter: Number(endChapter)
    })
  }

  const handleResetReadingRange = (): void => {
    setReadingRange(null)
  }

  useEffect(() => {
    const start = `${startBook.padStart(2, '0')}${startChapter.padStart(3, '0')}`
    const end = `${endBook.padStart(2, '0')}${endChapter.padStart(3, '0')}`

    if (start > end) {
      setEndBook(startBook)
      setEndChapter(startChapter)
    }
  }, [startBook, startChapter])

  useEffect(() => {
    const start = `${startBook.padStart(2, '0')}${startChapter.padStart(3, '0')}`
    const end = `${endBook.padStart(2, '0')}${endChapter.padStart(3, '0')}`

    if (end < start) {
      setStartBook(endBook)
      setStartChapter(endChapter)
    }
  }, [endBook, endChapter])

  return (
    <>
      <Modal title="설정" onClose={onClose}>
        <div className="flex flex-col justify-center items-center w-600pxr h-360pxr p-16pxr bg-white">
          <div className="flex flex-col items-center gap-8pxr py-8pxr mb-8pxr">
            <div className="flex items-center gap-8pxr h-32pxr font-bold">
              <IconArrowAutofitWidth size={18} />
              <span>낭독범위</span>
              {readingRange !== null && (
                <Button type="button" onClick={handleResetReadingRange} variant="ghost">
                  <IconCircleX size={18} />
                  <span className="pl-4pxr">해제</span>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-8pxr">
              <div className="flex flex-col gap-4pxr">
                <div className="flex items-center gap-4pxr">
                  <BiblePicker
                    book={startBook}
                    chapter={startChapter}
                    onBookChange={(value: string) => {
                      setStartBook(value)
                      setStartChapter('1')
                    }}
                    onChapterChange={(value: string) => {
                      setStartChapter(value)
                    }}
                    disabled={readingRange !== null}
                  />
                  <span className="ml-auto">부터</span>
                </div>
                <div className="flex items-center gap-4pxr">
                  <BiblePicker
                    book={endBook}
                    chapter={endChapter}
                    onBookChange={(value: string) => {
                      setEndBook(value)
                      setEndChapter('1')
                    }}
                    onChapterChange={(value: string) => {
                      setEndChapter(value)
                    }}
                    disabled={readingRange !== null}
                  />
                  <span className="ml-auto">까지</span>
                </div>
              </div>
              {readingRange === null ? (
                <Button type="button" onClick={handleReadingRange} variant="ghost" sx={tw`w-60pxr`}>
                  <IconCircleCheck size={18} />
                  <span className="px-4pxr">적용</span>
                </Button>
              ) : (
                <span className="w-60pxr px-4pxr">적용 중</span>
              )}
            </div>
          </div>
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
    </>
  )
}

export default SettingsModal
