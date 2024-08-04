import { useState } from 'react'
import Modal from './common/Modal'
import { ChromePicker } from 'react-color'
import Button from './common/Button'
import tw from 'twin.macro'

type ColorPickerModalProps = {
  title: string
  defaultColor: string
  onColorSelect: (color: string) => void
  onClose: () => void
}

function ColorPickerModal({
  title,
  defaultColor,
  onColorSelect,
  onClose
}: ColorPickerModalProps): JSX.Element {
  const [currentColor, setCurrentColor] = useState<string>(defaultColor)

  return (
    <Modal title={title} onClose={onClose} sx={tw`w-300pxr`}>
      <div className="p-16pxr bg-white select-none">
        <div className="flex justify-center mb-16pxr">
          <ChromePicker
            color={currentColor}
            onChange={(color) => setCurrentColor(color.hex)}
            disableAlpha={true}
          />
        </div>
        <div className="flex w-full">
          <Button
            type="button"
            onClick={() => onColorSelect(currentColor)}
            sx={tw`ml-auto w-60pxr`}
          >
            선택
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ColorPickerModal
