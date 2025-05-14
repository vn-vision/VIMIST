import { MdDeleteForever, MdEdit } from "react-icons/md";

interface DataTableProps {
  headers: string[];
  data: Record<string, any>[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}
function DynamicTable({ headers, data, onDelete, onEdit }: DataTableProps) {
  // callback function to delete an Item
  const handleDelete = (id: number) => {
    // ACCESS TOKEN
    const role = sessionStorage.getItem("role");
    if (role === "Admin") {
      // Pass the ID to the parent handler
      alert(`Are you sure you want to delete this item? ${id}`);
      onDelete(id);
    } else {
      alert(`You are not authorized to perform this action ${id}, ${role}`);
    }
  };

  // callback function to edit an item
  const handleEdit = (id: number) => {
    alert(`Editing item with ID: ${id}`);
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
                <button
                  className="vn-border vn-rounded-lg vn-bg-green-200"
                  onClick={() => handleEdit(row.id)}
                >
                  <MdEdit />
                </button>
                <button
                  className="vn-border vn-rounded-lg vn-bg-red-200"
                  onClick={() => handleDelete(row.id)}
                >
                  <MdDeleteForever />
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
