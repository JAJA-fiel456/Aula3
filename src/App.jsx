import React, { useState } from 'react'
import './App.css'

function formatarValor(valor) {
  if (valor !== null && typeof valor === 'object') {
    return JSON.stringify(valor)
  }

  return String(valor)
}

function App() {
  const [url, setUrl] = useState(import.meta.env.VITE_API_URL ?? '')
  const [itens, setItens] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function buscarItens(event) {
    event.preventDefault()
    setCarregando(true)
    setErro('')
    setItens(null)

    try {
      const resposta = await fetch(url)
      if (!resposta.ok) {
        throw new Error(`A API respondeu com status ${resposta.status}.`)
      }

      const dados = await resposta.json()
      if (!Array.isArray(dados)) {
        throw new Error('A resposta da API precisa ser uma lista JSON.')
      }

      setItens(dados)
    } catch (error) {
      setErro(error instanceof TypeError
        ? 'Não foi possível acessar a API. Verifique a URL, a conexão e o CORS.'
        : error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">Aula 11 · SQL e NoSQL</p>
        <h1>Documentos da API</h1>
        <p>Consulte uma rota Express e inspecione os documentos retornados.</p>
      </header>

      <form className="api-form" onSubmit={buscarItens}>
        <label htmlFor="api-url">URL completa da listagem</label>
        <div className="api-controls">
          <input
            id="api-url"
            onChange={event => setUrl(event.target.value)}
            placeholder="http://localhost:PORTA/caminho"
            required
            type="url"
            value={url}
          />
          <button disabled={carregando} type="submit">
            {carregando ? 'Consultando...' : 'Consultar API'}
          </button>
        </div>
      </form>

      <section className="results" aria-live="polite" aria-busy={carregando}>
        <div className="results-heading">
          <h2>Resultados</h2>
          {itens !== null && <span>{itens.length} documentos</span>}
        </div>

        {carregando && <p className="status">Carregando documentos...</p>}
        {!carregando && erro && <p className="error" role="alert">{erro}</p>}
        {!carregando && !erro && itens === null && (
          <p className="status">Informe a URL da rota de listagem para começar.</p>
        )}
        {!carregando && !erro && itens?.length === 0 && (
          <p className="status">A API não retornou documentos.</p>
        )}
        {!carregando && !erro && itens?.length > 0 && (
          <ul className="document-list">
            {itens.map(item => (
              <li className="document" key={item._id ?? item.id}>
                {Object.entries(item).map(([campo, valor]) => (
                  <div className="document-field" key={campo}>
                    <strong>{campo}</strong>
                    <span>{formatarValor(valor)}</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App