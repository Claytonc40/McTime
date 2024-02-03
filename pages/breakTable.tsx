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
  const currentDate = new Date().toLocaleDateString();
  return (
    <div className="w-max"> 
      <div className="mb-4">
      <div className="text-lg font-bold mb-2">Data: {currentDate}</div>
        
        <input
          className="text-black p-2 w-72 rounded-md border border-gray-300"
            type="text"
            placeholder="Nome"
            value={newClockName}
            onChange={(e) => setNewClockName(e.target.value)}
          />
        <button className="bg-gray-700 p-1 border ml-2 rounded-md align-middle" onClick={handleAddRow}>
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
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300">Nome</th>
            <th className="p-2 border border-gray-300">Relógio</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td className="text-center p-2 border border-gray-300 ">{row.name}</td>
              <td className="text-center p-2 border border-gray-300">{row.clock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
