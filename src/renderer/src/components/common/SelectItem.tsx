import { ComponentProps } from 'react'
import tw, { TwStyle } from 'twin.macro'

type SelectItemProps = ComponentProps<'option'> & {
  sx?: TwStyle
}

function SelectItem({ value, sx, children, ...props }: SelectItemProps): JSX.Element {
  return (
    <option value={value} css={[tw``, sx]} {...props}>
      {children}
    </option>
  )
}

export default SelectItem
