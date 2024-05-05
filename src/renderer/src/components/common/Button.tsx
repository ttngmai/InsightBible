import { ComponentProps } from 'react'
import tw, { TwStyle } from 'twin.macro'

type ButtonProps = ComponentProps<'button'> & {
  size?: 'sm' | 'md' | 'lg' | 'icon'
  color?: 'blue'
  sx?: TwStyle
}

const sizeVariants = {
  sm: tw`h-32pxr p-4pxr text-[14px] rounded-md`,
  icon: tw`h-32pxr w-32pxr rounded-md`
}
const colorVariants = {
  blue: tw`text-white bg-brand-blue-500`
}

const styles = {
  size: ({ size }): TwStyle => sizeVariants[size],
  color: ({ color }): TwStyle => colorVariants[color]
}

function Button({ size = 'sm', color = 'blue', sx, children, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      css={[
        tw`inline-flex justify-center items-center border shadow`,
        styles.size({ size }),
        styles.color({ color }),
        tw`disabled:border-[#bdc4d4] disabled:bg-[#efefef] disabled:text-[#333] disabled:shadow-none disabled:cursor-not-allowed`,
        sx
      ]}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
