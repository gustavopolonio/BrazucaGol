import { getProviders, signIn } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import * as Dialog from '@radix-ui/react-dialog'

import styles from './styles.module.scss'

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

interface SignInModalProps {
  isModalOpen: boolean
  onOpenModal: Dispatch<SetStateAction<boolean>>
}

export function SignInModal({ isModalOpen, onOpenModal }: SignInModalProps) {
  const [providers, setProviders] = useState<Provider[]>()

  useEffect(() => {
    getProviders().then((response) => setProviders(Object.values(response)))
  }, [])

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={onOpenModal}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalContent}>
          <Dialog.Title className={styles.modalTitle}>Faça Login</Dialog.Title>

          {providers?.map((provider) => (
            <button
              key={provider.name}
              onClick={() =>
                signIn(provider.id, { callbackUrl: '/create-avatar' })
              }
              className={`${styles[provider.id]} ${styles.providerButton}`}
            >
              {provider.id === 'facebook' && <FaFacebook fontSize={20} />}
              {provider.id === 'google' && <FaGoogle fontSize={20} />}
              Entrar com {provider.name}
            </button>
          ))}

          <Dialog.Close className={styles.closeModalButton}>
            <IoMdClose size={28} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
