import styles from './styles.module.scss'

export function MyAccountSidebar() {

  return (
    <aside className={styles.menuContainer}>
      <h2>Menu</h2>

      <nav>
        <a href="">Principal<div></div></a>
        <a href="">Rodadas<div></div></a>
        <a href="">Níveis<div></div></a>
        <a href="">Premiações<div></div></a>
        <a href="">Ranking<div></div></a>
        <a href="">Regras<div></div></a>
        <a href="">Dúvidas<div></div></a>
        <a href="">Divisão de Acesso<div></div></a>
        <a href="">Divisão de Jogadores<div></div></a>
        <a href="">Movimentações<div></div></a>
        <a href="">Vips<div></div></a>
        <a href="">Confirmar VIP<div></div></a>
      </nav>
    </aside>
  )
}