import { bibleCountInfo, bookInfo } from '@shared/constants'
import CustomSelect from '../common/CustomSelect'

type BiblePickerProps = {
  book: string
  chapter: string
  onBookChange: (value: string) => void
  onChapterChange: (value: string) => void
  disabled?: boolean
}

function BiblePicker({
  book,
  chapter,
  onBookChange,
  onChapterChange,
  disabled
}: BiblePickerProps): JSX.Element {
  const bookList = bookInfo.map((el) => ({
    key: String(el.id),
    value: String(el.id),
    text: el.name
  }))
  const chapterList = bibleCountInfo
    .filter((el) => String(el.book) === book)
    .map((el) => ({
      key: String(el.chapter),
      value: String(el.chapter),
      text: `${el.chapter}${el.book !== 19 ? '장' : '편'}`
    }))

  return (
    <div className="flex flex-col gap-4pxr">
      <div className="flex items-center gap-4pxr">
        <CustomSelect
          itemList={bookList}
          value={book}
          setValue={onBookChange}
          disabled={disabled}
        />
        <CustomSelect
          itemList={chapterList}
          value={chapter}
          setValue={onChapterChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default BiblePicker
