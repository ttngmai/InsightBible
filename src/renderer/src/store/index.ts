import { atom } from 'jotai'

export const bookAtom = atom<number>(1)
export const chapterAtom = atom<number>(1)
export const verseAtom = atom<number>(1)
export const selectedItemAtom = atom<{ book: number; chapter: number; verse: number } | null>({
  book: 1,
  chapter: 1,
  verse: 1
})

export const fontSizeAtom = atom<number>(16)
export const bibleBackgroundColorAtom = atom<string>('#fff')
export const bibleTextColorAtom = atom<string>('#000')
export const commentaryBackgroundColorAtom = atom<string>('#fff')
export const commentaryTextColorAtom = atom<string>('#000')
