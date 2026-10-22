import React from 'react'

function ListaUsuarios({ usuarios, onEditar, onExcluir }) {
  if (usuarios.length === 0) {
    return <p className="status-message">Nenhum usuário cadastrado.</p>
  }

  return (
    <ul>
      {usuarios.map(usuario => (
        <li key={usuario.id}>
          <div className="user-details">
            <strong>{usuario.name}</strong>
            <span>{usuario.email}</span>
          </div>
          <div className="user-actions">
            <button className="text-button" onClick={() => onEditar(usuario)} type="button">
              Editar
            </button>
            <button className="delete-button" onClick={() => onExcluir(usuario)} type="button">
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ListaUsuarios