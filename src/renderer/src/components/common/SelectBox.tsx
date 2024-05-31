import * as Select from '@radix-ui/react-select'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'
import { ComponentProps, forwardRef, ReactNode } from 'react'

type TItem = { key: string; value: string; text: string }

type SelectBoxProps = ComponentProps<'select'> & {
  placeholder?: string
  itemList: TItem[]
  defaultValue?: string
  setValue: (value: string) => void
}

type SelectItemProps = {
  value: string
  disabled?: boolean
  children?: ReactNode
}

function SelectBox({ placeholder, itemList, defaultValue, setValue }: SelectBoxProps): JSX.Element {
  return (
    <Select.Root defaultValue={defaultValue} onValueChange={setValue}>
      <Select.Trigger className="inline-flex items-center justify-center gap-4pxr h-32pxr px-8pxr py-4pxr border border-[#E4E4E7] text-[14px] rounded-md shadow-sm hover:bg-[#F8FAFC]">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <IconChevronDown size={14} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-sm">
          <Select.Viewport className="p-4pxr">
            <Select.Group>
              {itemList.map((el) => (
                <SelectItem key={el.key} value={el.value}>
                  {el.text}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, disabled }, ref) => {
    return (
      <Select.Item
        ref={ref}
        className="flex items-center gap-4pxr h-32pxr px-8pxr py-4pxr text-[14px] rounded-md select-none cursor-pointer hover:bg-[#F8FAFC]"
        value={value}
        disabled={disabled}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="inline-flex items-center justify-center">
          <IconCheck size={14} />
        </Select.ItemIndicator>
      </Select.Item>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export default SelectBox
