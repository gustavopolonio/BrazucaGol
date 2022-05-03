import styles from './styles.module.scss'

export function MenuSidebar() {

  return (
    <aside className={styles.menuContainer}>
      <h2>Menu</h2>

      <nav>
        <a href="">Principal</a>
        <a href="">Rodadas</a>
        <a href="">Níveis</a>
        <a href="">Premiações</a>
        <a href="">Ranking</a>
        <a href="">Regras</a>
        <a href="">Dúvidas</a>
        <a href="">Divisão de Acesso</a>
        <a href="">Divisão de Jogadores</a>
        <a href="">Movimentações</a>
        <a href="">Vips</a>
        <a href="">Confirmar VIP</a>
      </nav>
    </aside>
  )
}