import React, { useEffect, useState } from 'react'
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from './api'
import ListaUsuarios from './ListaUsuarios'
import './App.css'

function obterMensagemErro(error) {
  if (error instanceof ApiError && error.status === 404) {
    return 'Recurso não encontrado'
  }

  if (error instanceof ApiError && error.status === 500) {
    return 'Erro no servidor'
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Falha de rede'
  }

  return 'Não foi possível concluir a operação.'
}

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function buscarUsuarios() {
      try {
        const data = await apiGet('/users', { signal: controller.signal })
        setUsuarios(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErro(obterMensagemErro(error))
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    buscarUsuarios()

    return () => {
      controller.abort()
    }
  }, [])

  function limparFormulario() {
    setNome('')
    setEmail('')
    setUsuarioEditando(null)
  }

  function editarUsuario(usuario) {
    setUsuarioEditando(usuario)
    setNome(usuario.name)
    setEmail(usuario.email)
    setErro('')
  }

  async function salvarUsuario(event) {
    event.preventDefault()
    setErro('')

    const dados = { name: nome.trim(), email: email.trim() }

    try {
      if (usuarioEditando) {
        const atualizado = await apiPut(`/users/${usuarioEditando.id}`, {
          ...usuarioEditando,
          ...dados,
        })
        setUsuarios(lista =>
          lista.map(usuario =>
            usuario.id === usuarioEditando.id
              ? { ...usuario, ...atualizado, ...dados }
              : usuario
          )
        )
      } else {
        const criado = await apiPost('/users', dados)
        setUsuarios(lista => [
          ...lista,
          { ...dados, ...criado, id: Date.now() },
        ])
      }

      limparFormulario()
    } catch (error) {
      setErro(obterMensagemErro(error))
    }
  }

  async function excluirUsuario(usuario) {
    setErro('')

    try {
      await apiDelete(`/users/${usuario.id}`)
      setUsuarios(lista => lista.filter(item => item.id !== usuario.id))

      if (usuarioEditando?.id === usuario.id) {
        limparFormulario()
      }
    } catch (error) {
      setErro(obterMensagemErro(error))
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Aula 07 · Exercícios</p>
        <h1>Usuários</h1>
        <p>Gerencie os usuários cadastrados.</p>
      </header>

      <section className="editor" aria-labelledby="form-title">
        <h2 id="form-title">
          {usuarioEditando ? 'Editar usuário' : 'Novo usuário'}
        </h2>
        <form onSubmit={salvarUsuario}>
          <label>
            Nome
            <input
              autoComplete="name"
              onChange={event => setNome(event.target.value)}
              required
              value={nome}
            />
          </label>
          <label>
            E-mail
            <input
              autoComplete="email"
              onChange={event => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <div className="form-actions">
            <button className="primary-button" type="submit">
              {usuarioEditando ? 'Salvar alterações' : 'Adicionar usuário'}
            </button>
            {usuarioEditando && (
              <button className="text-button" onClick={limparFormulario} type="button">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="user-section" aria-labelledby="users-title">
        <div className="section-heading">
          <h2 id="users-title">Lista de usuários</h2>
          {!carregando && <span>{usuarios.length} usuários</span>}
        </div>

        {erro && <p className="error-message" role="alert">{erro}</p>}
        {carregando ? (
          <p className="status-message">Carregando usuários...</p>
        ) : (
          <ListaUsuarios
            usuarios={usuarios}
            onEditar={editarUsuario}
            onExcluir={excluirUsuario}
          />
        )}
      </section>
    </main>
  )
}

export default App