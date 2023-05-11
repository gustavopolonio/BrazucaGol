import { getProviders, signIn } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import {
  Root,
  Portal,
  Overlay,
  Content,
  Close,
  Title,
} from '@radix-ui/react-dialog'

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
    <Root open={isModalOpen} onOpenChange={onOpenModal}>
      <Portal>
        <Overlay className={styles.modalOverlay} />
        <Content className={styles.modalContent}>
          <Title className={styles.modalTitle}>Faça Login</Title>

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

          <Close className={styles.closeModalButton}>
            <IoMdClose size={28} />
          </Close>
        </Content>
      </Portal>
    </Root>
  )
}
