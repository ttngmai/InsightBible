import { TBible, TBibleSoundTimeStamp } from '@shared/models'
import { TReadingRange } from '@shared/types'
import { atom } from 'jotai'

const bibleNameAtom = atom<string>(String(window.electron.store.get('bibleName') || '개역개정'))
const bookAtom = atom<number>(Number(window.electron.store.get('book') || 1))
const chapterAtom = atom<number>(Number(window.electron.store.get('chapter') || 1))
const verseAtom = atom<number>(Number(window.electron.store.get('verse') || 1))
const bibleDataAtom = atom<TBible[]>([])
const voiceTypeAtom = atom<string>(String(window.electron.store.get('voiceType') || '남성'))
const bibleSoundTimeStampAtom = atom<TBibleSoundTimeStamp[]>([])
const readingRangeAtom = atom<TReadingRange | null>(null)
const currentReadingPositionAtom = atom<number | null>(null)

const bibleBackgroundColorAtom = atom<string>(
  String(window.electron.store.get('bibleBackgroundColor') || '#fff')
)
const bibleTextSizeAtom = atom<number>(Number(window.electron.store.get('bibleTextSize') || 16))
const bibleTextColorAtom = atom<string>(
  String(window.electron.store.get('bibleTextColor') || '#000')
)
const currentReadingTextColorAtom = atom<string | null>(
  String(window.electron.store.get('currentReadingTextColor') || null)
)

export const readWriteBibleName = atom<string, [string], void>(
  (get) => get(bibleNameAtom),
  (_, set, newValue) => {
    set(bibleNameAtom, newValue)
    window.electron.store.set('bibleName', newValue)
  }
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
export const readWriteVoiceTypeAtom = atom<string, string[], void>(
  (get) => get(voiceTypeAtom),
  (_, set, newValue) => {
    set(voiceTypeAtom, newValue)
    window.electron.store.set('voiceType', newValue)
  }
)
export const readWriteBibleSoundTimeStampAtom = atom<
  TBibleSoundTimeStamp[],
  [TBibleSoundTimeStamp[]],
  void
>(
  (get) => get(bibleSoundTimeStampAtom),
  (_, set, newValue) => {
    set(bibleSoundTimeStampAtom, newValue)
  }
)
export const readWriteReadingRangeAtom = atom<TReadingRange | null, [TReadingRange | null], void>(
  (get) => get(readingRangeAtom),
  (_, set, newValue) => {
    set(readingRangeAtom, newValue)
  }
)
export const readWriteCurrentReadingPositionAtom = atom<number | null, [number | null], void>(
  (get) => get(currentReadingPositionAtom),
  (_, set, newValue) => {
    set(currentReadingPositionAtom, newValue)
  }
)

export const readWriteBibleBackgroundColorAtom = atom<string, [string], void>(
  (get) => get(bibleBackgroundColorAtom),
  (_, set, newValue) => {
    set(bibleBackgroundColorAtom, newValue)
    window.electron.store.set('bibleBackgroundColor', newValue)
  }
)
export const readWriteBibleTextSizeAtom = atom<number, [number], void>(
  (get) => get(bibleTextSizeAtom),
  (_, set, newValue) => {
    set(bibleTextSizeAtom, newValue)
    window.electron.store.set('bibleTextSize', newValue)
  }
)
export const readWriteBibleTextColorAtom = atom<string, [string], void>(
  (get) => get(bibleTextColorAtom),
  (_, set, newValue) => {
    set(bibleTextColorAtom, newValue)
    window.electron.store.set('bibleTextColor', newValue)
  }
)
export const readWriteCurrentReadingTextColorAtom = atom<string | null, [string | null], void>(
  (get) => get(currentReadingTextColorAtom),
  (_, set, newValue) => {
    set(currentReadingTextColorAtom, newValue)
    window.electron.store.set('currentReadingTextColor', newValue)
  }
)
