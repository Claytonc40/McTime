// Lojas.tsx

import React, { useState, useEffect } from "react";

interface Loja {
  _id: string;
  nome: string;
}

const Lojas: React.FC = () => {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [newLojaName, setNewLojaName] = useState("");

  const fetchLojas = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/lojas");
      const data = await response.json();
      setLojas(data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
    }
  };

  const handleAddLoja = async () => {
    if (!newLojaName) {
      alert("Por favor, forneça um nome para a loja.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/lojas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: newLojaName }),
      });

      const novaLoja = await response.json();

      setLojas((prevLojas) => [...prevLojas, novaLoja]);
      setNewLojaName("");
    } catch (error) {
      console.error("Erro ao adicionar loja:", error);
    }
  };

  const handleDeleteLoja = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/lojas/${id}`, {
        method: "DELETE",
      });

      setLojas((prevLojas) => prevLojas.filter((loja) => loja._id !== id));
    } catch (error) {
      console.error("Erro ao excluir loja:", error);
    }
  };

  useEffect(() => {
    fetchLojas();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <input
          className="text-black p-2"
          type="text"
          placeholder="Nome da Loja"
          value={newLojaName}
          onChange={(e) => setNewLojaName(e.target.value)}
        />
        <button className="bg-transparent p-5 align-middle" onClick={handleAddLoja}>
          Adicionar Loja
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">Nome</th>
            <th className="p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {lojas.map((loja) => (
            <tr key={loja._id}>
              <td className="text-center p-2">{loja.nome}</td>
              <td className="text-center p-2">
                <button onClick={() => handleDeleteLoja(loja._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lojas;
