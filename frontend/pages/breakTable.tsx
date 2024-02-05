import React, { useState, useEffect } from "react";
import Time from "./components/time";

interface Cronometro {
  _id: React.Key | null | undefined;
  nome: string;
  tempo: number;
  pausado: boolean;
}
// Importações e outras partes do código...

interface TableRow {
  name: string;
  clock: JSX.Element;
  initialStartTime: Date;
  cronometroId: React.Key | null | undefined;
}

export default function BreakTables() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [newClockName, setNewClockName] = useState<string>("");

  const handleAddRow = async () => {
    if (!newClockName) {
      alert("Por favor, forneça um nome para o relógio.");
      return;
    }

    try {
      const response = await fetch("https://apitime.editecsistema.com.br/api/cronometros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: newClockName, tempo: 65 * 60 }),
      });

      const novoCronometro = await response.json();

      setTableData((prevData) => [
        ...prevData,
        {
          name: novoCronometro.nome,
          clock: (
            <Time
              key={novoCronometro._id}
              initialTime={novoCronometro.tempo}
              cronometroId={novoCronometro._id}
            />
          ),
          initialStartTime: new Date(novoCronometro.startTime),
          cronometroId: novoCronometro._id,
        },
      ]);

      setNewClockName("");
    } catch (error) {
      console.error("Erro ao adicionar cronômetro:", error);
    }
  };

  const handleDeleteRow = async (
    cronometroId: React.Key | null | undefined
  ) => {
    try {
      await fetch(`http://localhost:3001/api/cronometros/${cronometroId}`, {
        method: "DELETE",
      });

      setTableData((prevData) =>
        prevData.filter((row) => row.cronometroId !== cronometroId)
      );
    } catch (error) {
      console.error("Erro ao excluir cronômetro:", error);
    }
  };

  useEffect(() => {
    const fetchCronometros = async () => {
      try {
        const response = await fetch("https://apitime.editecsistema.com.br/api/cronometros");
        const cronometros = await response.json();

        const cronometrosData = cronometros.map(
          (cronometro: {
            nome: any;
            _id: React.Key | null | undefined;
            tempo: number;
            startTime: string;
            initialStartTime: string;
          }) => ({
            name: cronometro.nome,
            clock: (
              <Time
                key={cronometro._id}
                initialTime={cronometro.tempo}
                cronometroId={cronometro._id}
              />
            ),
            initialStartTime: new Date(cronometro.initialStartTime),
            cronometroId: cronometro._id,
          })
        );

        setTableData(cronometrosData);
      } catch (error) {
        console.error("Erro ao buscar cronômetros:", error);
      }
    };

    fetchCronometros();
  }, []);

  return (
    <div className="w-max">
      <div className="mb-4">
        <input
          className="text-black p-2"
          type="text"
          placeholder="Nome"
          value={newClockName}
          onChange={(e) => setNewClockName(e.target.value)}
        />
        <button
          className="bg-transparent p-5 align-middle"
          onClick={handleAddRow}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-20 transition-all duration-300 hover:text-green-700 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300">Nome</th>
            <th className="p-3 border border-gray-300">Relógio</th>
            <th className="p-3 border border-gray-300">Hora Inical</th>
            <th className="p-2 border border-gray-300">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td className="text-center border border-gray-300 p-2">
                {row.name}
              </td>
              <td className="text-center border border-gray-300 p-2">
                {row.clock}
              </td>
              <td className="text-center border border-gray-300 p-2">
                {row.initialStartTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td className="text-center border border-gray-300 p-2">
                <button onClick={() => handleDeleteRow(row.cronometroId)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor" // Cor padrão
                    className="w-10 h-8 transition-all duration-300 hover:text-red-400" // Adiciona uma transição suave e define a cor de hover
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
