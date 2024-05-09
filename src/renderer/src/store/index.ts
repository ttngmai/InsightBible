import { TBible, TCommentary } from '@shared/models'
import { atom } from 'jotai'

const bookAtom = atom<number>(Number(window.electron.store.get('book')) || 1)
const chapterAtom = atom<number>(Number(window.electron.store.get('chapter')) || 1)
const verseAtom = atom<number>(Number(window.electron.store.get('verse')) || 1)
const bibleDataAtom = atom<TBible[]>([])
const commentaryDataAtom = atom<TCommentary[]>([])

const fontSizeAtom = atom<number>(Number(window.electron.store.get('fontSize')) || 16)
const bibleBackgroundColorAtom = atom<string>(
  String(window.electron.store.get('bibleBackgroundColor')) || '#fff'
)
const bibleTextColorAtom = atom<string>(
  String(window.electron.store.get('bibleTextColor')) || '#000'
)
const commentaryBackgroundColorAtom = atom<string>(
  String(window.electron.store.get('commentaryBackgroundColor')) || '#fff'
)
const commentaryTextColorAtom = atom<string>(
  String(window.electron.store.get('commentaryTextColor')) || '#000'
)

export const readWriteBookAtom = atom<number, [number], void>(
  (get) => get(bookAtom),
  (_, set, newValue) => {
    set(bookAtom, newValue)
    window.electron.store.set('book', newValue)
  }
)
export const readWriteChapterAtom = atom<number, [number], void>(
  (get) => get(chapterAtom),
  (_, set, newValue) => {
    set(chapterAtom, newValue)
    window.electron.store.set('chapter', newValue)
  }
)
export const readWriteVerseAtom = atom<number, [number], void>(
  (get) => get(verseAtom),
  (_, set, newValue) => {
    set(verseAtom, newValue)
    window.electron.store.set('verse', newValue)
  }
)
export const readWriteBibleDataAtom = atom<TBible[], [TBible[]], void>(
  (get) => get(bibleDataAtom),
  (_, set, newValue) => {
    set(bibleDataAtom, newValue)
  }
)
export const readWriteCommentaryDataAtom = atom<TCommentary[], [TCommentary[]], void>(
  (get) => get(commentaryDataAtom),
  (_, set, newValue) => {
    set(commentaryDataAtom, newValue)
  }
)

export const readWriteFontSizeAtom = atom<number, [number], void>(
  (get) => get(fontSizeAtom),
  (_, set, newValue) => {
    set(fontSizeAtom, newValue)
    window.electron.store.set('fontSize', newValue)
  }
)
export const readWriteBibleBackgroundColorAtom = atom<string, [string], void>(
  (get) => get(bibleBackgroundColorAtom),
  (_, set, newValue) => {
    set(bibleBackgroundColorAtom, newValue)
    window.electron.store.set('bibleBackgroundColor', newValue)
  }
)
export const readWriteBibleTextColorAtom = atom<string, [string], void>(
  (get) => get(bibleTextColorAtom),
  (_, set, newValue) => {
    set(bibleTextColorAtom, newValue)
    window.electron.store.set('bibleTextColor', newValue)
  }
)
export const readWriteCommentaryBackgroundColorAtom = atom<string, [string], void>(
  (get) => get(commentaryBackgroundColorAtom),
  (_, set, newValue) => {
    set(commentaryBackgroundColorAtom, newValue)
    window.electron.store.set('commentaryBackgroundColor', newValue)
  }
)
export const readWriteCommentaryTextColor = atom<string, [string], void>(
  (get) => get(commentaryTextColorAtom),
  (_, set, newValue) => {
    set(commentaryTextColorAtom, newValue)
    window.electron.store.set('commentaryTextColor', newValue)
  }
)
