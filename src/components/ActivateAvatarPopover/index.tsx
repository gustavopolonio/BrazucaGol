import * as Popover from '@radix-ui/react-popover'
import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import styles from './styles.module.scss'
import { useEffect, useState } from 'react'

export function ActivateAvatarPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  useEffect(() => setIsPopoverOpen(true), [])

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <Popover.Trigger asChild>
        <button className={styles.IconButton} aria-label="Update dimensions">
          <MixerHorizontalIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="left"
          sideOffset={6}
          className={styles.PopoverContent}
        >
          <h2>Opa! Você precisa criar seu jogador para começar a chutar!</h2>
          <Link href="/create-avatar" className={styles.CreateAvatarButton}>
            Criar jogador
          </Link>

          <Popover.Close className={styles.PopoverClose}>
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow
            width={20}
            height={16}
            className={styles.PopoverArrow}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
