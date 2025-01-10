import { useNavigate } from "react-router-dom";
interface DataTableProps {
  headers: string[];
  data: Record<string, any>[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

function DynamicTable({ headers, data, onDelete, onEdit }: DataTableProps) {
  const navigate = useNavigate();
  
  // callback function to delete an Item
  const handleDelete = (id: number) => {
    onDelete(id); // Pass the ID to the parent handler
    navigate(0);
  };

  // callback function to edit an item
  const handleEdit = (id: number) => {
    onEdit(id);
  };
  return (
    <div className="vn-overflow-x-auto vn-shadow-md vn-rounded-lg">
      <table className="vn-min-w-full vn-table-auto vn-border-collapse">
        <thead>
          <tr>
            {headers?.map((header, index) => (
              <th
                key={index}
                className="vn-border-b vn-px-4 vn-py-2 vn-text-left vn-uppercase vn-font-bold vn-text-sm"
              >
                {header}
              </th>
            ))}
            <th className="vn-border-b vn-px-4 vn-py-2 vn-text-left vn-uppercase vn-font-bold vn-text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowId) => (
            <tr key={rowId}>
              {headers.map((header, ColId) => (
                <td
                  key={ColId}
                  className="vn-border-b vn-px-4 vn-py-2 vn-text-left"
                >
                  {row[header.toLowerCase() || "-"]}
                </td>
              ))}
              <td className="vn-flex vn-gap-2">
                <button className="vn-border vn-border-green-500"
                onClick={() => handleEdit(row.id)}
                >Edit</button>
                <button
                  className="vn-border vn-border-red-500"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DynamicTable;
