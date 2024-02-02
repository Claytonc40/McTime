import React, { useState } from "react";
import Time from "./components/time";

interface TableRow {
  name: string;
  clock: React.ReactNode;
}

export default function BreakTables() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [newClockName, setNewClockName] = useState("");

  const handleAddRow = () => {
    if (!newClockName) {
      alert("Por favor, forneça um nome para o relógio.");
      return;
    }

    setTableData((prevData) => [
      ...prevData,
      { name: newClockName, clock: <Time key={new Date().getTime()} /> },
    ]);

    setNewClockName("");
  };

  return (
    <div>
      <div className="mb-4">
        <input
          className="text-black p-2 w-96"
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
            className="w-10 h-10 bg-transparent"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Nome</th>
              <th className=" pl-52 text-center">Relógio</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="text-center p-2">{row.name}</td>
                <td className="text-center pl-52">{row.clock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
