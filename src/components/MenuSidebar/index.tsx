import { MdPlayArrow } from "react-icons/md"

import styles from './styles.module.scss'

export function MenuSidebar() {

  return (
    <aside className={styles.menuContainer}>
      <h2>Menu</h2>

      <nav>
        <a href="">Principal<MdPlayArrow /><div></div></a>
        <a href="">Rodadas<MdPlayArrow /><div></div></a>
        <a href="">Níveis<MdPlayArrow /><div></div></a>
        <a href="">Premiações<MdPlayArrow /><div></div></a>
        <a href="">Ranking<MdPlayArrow /><div></div></a>
        <a href="">Regras<MdPlayArrow /><div></div></a>
        <a href="">Dúvidas<MdPlayArrow /><div></div></a>
        <a href="">Divisão de Acesso<MdPlayArrow /><div></div></a>
        <a href="">Divisão de Jogadores<MdPlayArrow /><div></div></a>
        <a href="">Movimentações<MdPlayArrow /><div></div></a>
        <a href="">Vips<MdPlayArrow /><div></div></a>
        <a href="">Confirmar VIP<MdPlayArrow /><div></div></a>
      </nav>
    </aside>
  )
}