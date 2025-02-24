import { useState } from "react";
import "./App.css";
import CustomDynamicTable from "./components/CustomDynamicTable";
import { employees } from "./data/employee";

function App() {
  const [selected, setSelected] = useState<typeof employees>([]);

  const toggleSelection = (row: (typeof employees)[0]) => {
    setSelected((prev) =>
      prev.includes(row) ? prev.filter((item) => item !== row) : [...prev, row]
    );
  };

  const handleRowClick = (row: (typeof employees)[0]) => {
    console.log("Row clicked:", row);
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Employee Table</h2>

      <CustomDynamicTable
        tableData={employees}
        tableColumns={["name", "age", "email", "department"]}
        excludeColumns={["department"]} // Excluding "department"
        selectedItems={selected}
        onRowClick={handleRowClick}
        customBodyRender={(row, col) => {
          if (col === "name") {
            return (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(row)}
                  onChange={() => toggleSelection(row)}
                  onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
                />
                {row.name}
              </div>
            );
          }
          return row[col];
        }}
      />
    </div>
  );
}

export default App;
