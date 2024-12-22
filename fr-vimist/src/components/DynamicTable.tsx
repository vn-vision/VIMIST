import React from 'react'

  interface DataTableProps {
    headers: string[];
    data: Record<string, any>[];
  }

function DynamicTable({headers, data }: DataTableProps) {
  return (
    <div className='vn-overflow-x-auto vn-shadow-md vn-rounded-lg'>
        <table className='vn-min-w-full vn-table-auto vn-border-collapse'>
            <thead>
            <tr>
                {headers.map((header, index) => (
                <th
                key={index}
                className='vn-border-b vn-px-4 vn-py-2 vn-text-left vn-uppercase vn-font-bold vn-text-sm'
                >
                    {header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
                {data.map((row, rowId)=>(
                    <tr key={rowId}>
                        {headers.map((header, ColId)=>(
                            <td key={ColId}
                            className='vn-border-b vn-px-4 vn-py-2 vn-text-left'
                            >
                                {row[header.toLowerCase() || '-']}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default DynamicTable
