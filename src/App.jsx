import { useEffect, useState } from 'react'
import ListaUsuarios from './ListaUsuarios'

function App() {
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => {
    async function buscarUsuarios() {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      )

      const data = await response.json()

      setUsuarios(data)
    }

    buscarUsuarios()
  }, [])

  return (
    <main>
      <h1>Usuários</h1>

      <ListaUsuarios usuarios={usuarios} />
    </main>
  )
}

export default App