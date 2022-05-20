import { getProviders, signIn } from "next-auth/react"
import Link from 'next/link'
import { FaFacebookF, FaGoogle } from "react-icons/fa"

import styles from './signin.module.scss'

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string
}

interface SignInProps {
  providers: Provider[]
}

export default function SignIn({ providers }: SignInProps) {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.title}>Já tem uma conta?</span>

        {Object.values(providers).map(provider => (
          <button 
            key={provider.name} 
            onClick={() => signIn(provider.id)} 
            className={styles[provider.id]}
          >
            {provider.id === 'facebook' && (
              <FaFacebookF fontSize={20} />
            )}

            {provider.id === 'google' && (
              <FaGoogle fontSize={20} />
            )}

            Entrar com {provider.name}
          </button>
        ))}

        <hr />

        <span className={styles.title}>Ainda não tem uma conta?</span>

        <Link href='' passHref>
          <a className={styles.signUpButton}>
            Cadastre-se
          </a>
        </Link>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: { providers }
  }
}