import type { NextPage } from 'next'
import Link from 'next/link'
import styles from './styles.module.scss';

export const Navbar: NextPage = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/" >
          <img src='/images/logo.svg' alt="market" style={{ width: '9rem', cursor: 'pointer' }} />
        </Link>
        <nav>
          <Link className={styles.active} href="/" >
            <a> Home </a>
          </Link>
          <Link className={styles.active} href='/clients'>
            <a > Clientes </a>
          </Link>
          <Link className={styles.active} href='/products'>
            <a > Produtos </a>
          </Link>
          <Link className={styles.active} href='/purchases'>
            <a > Compras </a>
          </Link>
        </nav>
      </div>
    </div>
  )
}


