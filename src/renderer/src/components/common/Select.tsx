import { ComponentProps } from 'react'
import tw, { TwStyle } from 'twin.macro'

type SelectProps = ComponentProps<'select'> & {
  sx?: TwStyle
}

function Select({ sx, children, ...props }: SelectProps): JSX.Element {
  return (
    <select
      css={[tw`h-32pxr p-4pxr border border-[#E4E4E7] text-[14px] rounded-md shadow-sm`, sx]}
      {...props}
    >
      {children}
    </select>
  )
}

export default Select
