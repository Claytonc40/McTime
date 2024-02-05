// components/Lojas.tsx

import React, { useState, useEffect } from "react";

interface LojasProps {
  setSelectedLoja: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Loja {
  _id: string;
  nome: string;
}

const Lojas: React.FC<LojasProps> = ({ setSelectedLoja }) => {
  const [lojas, setLojas] = useState<Loja[]>([]);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const response = await fetch("https://projetomcd-api-mc-time.zrpb1z.easypanel.host/api/lojas");
        
        if (!response.ok) {
          console.error("Erro ao buscar lojas. Resposta não OK.");
          return;
        }

        const lojasData = await response.json();
        
        if (!Array.isArray(lojasData)) {
          console.error("Erro ao buscar lojas. A resposta não é um array.");
          return;
        }

        setLojas(lojasData);
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      }
    };

    fetchLojas();
  }, []);

  return (
    <select onChange={(e) => setSelectedLoja(e.target.value)}>
      <option value="">Selecione uma loja</option>
      {lojas.map((loja) => (
        <option key={loja._id} value={loja._id}>
          {loja.nome}
        </option>
      ))}
    </select>
  );
};

export default Lojas;
