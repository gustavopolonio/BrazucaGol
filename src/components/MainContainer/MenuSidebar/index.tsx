import { MdPlayArrow } from 'react-icons/md'
import Link from 'next/link'

import styles from './styles.module.scss'

export function MenuSidebar() {
  return (
    <aside className={styles.menuContainer}>
      <h2>Menu</h2>

      <nav>
        <Link href="/">
          Principal
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Rodadas
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Níveis
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Premiações
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Ranking
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Regras
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Dúvidas
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Divisão de Acesso
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Divisão de Jogadores
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Movimentações
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Vips
          <MdPlayArrow />
          <div></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          Confirmar VIP
          <MdPlayArrow />
          <div></div>
        </Link>
      </nav>
    </aside>
  )
}
