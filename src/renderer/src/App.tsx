import { useEffect, useState } from 'react'
import NavigationBar from './components/common/NavigationBar'
import BibleArea from './components/bible/BibleArea'
import tw from 'twin.macro'
import { useAtomValue } from 'jotai'
import { readWriteBookAtom, readWriteChapterAtom, readWriteVerseAtom } from './store'
import useSearchBible from './hooks/useSearchBible'
import {
  autoUpdate,
  flip,
  inline,
  shift,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react'
import Button from './components/common/Button'
import { IconCopy } from '@tabler/icons-react'

const App = (): JSX.Element => {
  const book = useAtomValue(readWriteBookAtom)
  const chapter = useAtomValue(readWriteChapterAtom)
  const verse = useAtomValue(readWriteVerseAtom)

  const [isOpenClipboardTooltip, setIsOpenClipboardTooltip] = useState<boolean>(false)

  const searchBible = useSearchBible()

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-end',
    open: isOpenClipboardTooltip,
    onOpenChange: setIsOpenClipboardTooltip,
    middleware: [inline(), flip(), shift()],
    whileElementsMounted: autoUpdate
  })
  const dismiss = useDismiss(context)
  const { getFloatingProps } = useInteractions([dismiss])

  const copyToSelectedText = (): void => {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      window.electron.copyText(selectedText)
    }
  }

  useEffect(() => {
    searchBible(book, chapter, verse)
  }, [])

  useEffect(() => {
    function handleMouseUp(event: MouseEvent): void {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      setTimeout(() => {
        const selection = window.getSelection()
        const range =
          typeof selection?.rangeCount === 'number' && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null

        if (selection?.isCollapsed) {
          setIsOpenClipboardTooltip(false)
          return
        }

        if (range) {
          refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects()
          })
          setIsOpenClipboardTooltip(true)
        }
      })
    }

    function handleMouseDown(event: MouseEvent): void {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return
      }

      if (window.getSelection()?.isCollapsed) {
        setIsOpenClipboardTooltip(false)
      }
    }

    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [refs])

  return (
    <div className="overflow-hidden">
      <NavigationBar />

      <div className="flex h-[calc(100vh-60px)]">
        <BibleArea sx={tw`flex-1 overflow-y-auto`} />
        {isOpenClipboardTooltip && (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles
            }}
            {...getFloatingProps()}
          >
            <Button
              type="button"
              onClick={() => {
                copyToSelectedText()
                setIsOpenClipboardTooltip(false)
              }}
              size="icon"
            >
              <IconCopy size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
