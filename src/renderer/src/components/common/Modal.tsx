import { IconX } from '@tabler/icons-react'
import tw, { css, TwStyle } from 'twin.macro'

export type ModalProps = {
  title: string
  onClose: () => void
  sx?: TwStyle
  children: React.ReactNode
}

function Modal({ title, onClose, sx, children }: ModalProps): JSX.Element {
  // 모달 닫기 버튼 클릭 시
  const handleClose = (e: React.MouseEvent): void => {
    e.preventDefault()
    onClose()
  }

  // 모달 바깥 클릭 시
  const handleOutsideClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    onClose()
  }

  // 모달 안쪽 클릭 시 이벤트 전파 중지
  const handleInsideClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 block bg-black/[0.25]" onClick={handleOutsideClick}>
      <div
        onClick={handleInsideClick}
        css={[
          tw`fixed inset-x-1/2 inset-y-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit max-w-[80%] overflow-hidden rounded-lg`,
          css`
            box-shadow:
              0 10px 15px -3px #0000001a,
              0 4px 6px -4px #0000001a;
          `,
          sx
        ]}
      >
        <div className="flex items-center justify-between w-full h-40pxr p-16pxr bg-brand-blue-500">
          <div className="text-[18px] font-bold text-white select-none">{title}</div>
          <button type="button" onClick={handleClose}>
            <IconX color="white" width={24} height={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
