export type TBible = {
  id: number
  book: number
  chapter: number
  verse: number
  btext: string
}

export type TBibleSoundTimeStamp = {
  id: number
  book: number
  chapter: number
  verse: number
  start_time: number
  end_time: number
}

export type TCommentary = {
  id: number
  book: number
  chapter: number
  verse: number
  btext: string
}
