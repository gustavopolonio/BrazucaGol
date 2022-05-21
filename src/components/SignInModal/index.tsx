import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import ReactModal from 'react-modal'

import styles from './styles.module.scss'

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string
}

interface SignInModalProps {
  isModalOpen: boolean;
  onCloseSignInModal: () => void
}

export function SignInModal({ isModalOpen, onCloseSignInModal }: SignInModalProps) {
  const [providers, setProviders] = useState<Provider[]>()

  useEffect(() => {
    getProviders().then(response => setProviders(Object.values(response)))
  }, [])

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={onCloseSignInModal}
      overlayClassName={styles['react-modal-overlay']}
      className={styles['react-modal-content']}
    >
      <button onClick={onCloseSignInModal} className={styles.closeButton}>x</button>
      <div className={styles.container}>
        <div className={styles.content}>

          {providers?.map(provider => (
            <button 
              key={provider.name} 
              onClick={() => signIn(provider.id, { callbackUrl: '/subscribe' })} 
              className={styles[provider.id]}
            >
              {provider.id === 'facebook' && (
                <FaFacebook fontSize={20} />
              )}

              {provider.id === 'google' && (
                <FaGoogle fontSize={20} />
              )}

              Entrar com {provider.name}
            </button>
          ))}

        </div>
      </div>          
    </ReactModal>
  )
}