import React from 'react';
import { useTable } from 'react-table';
import propTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';

const CourtTable = ({ courts = [],onDelete }) => {
    const columns = React.useMemo(() => [
        {
            Header: 'Court Photo',
            accessor: 'CourtPhoto',
            Cell: ({ row }) => (
                <img
                    src={row.original.CourtPhoto}
                    alt={row.original.CourtName}
                    className="object-cover w-12 h-12 mx-auto rounded-full"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
            )},
        {
            Header: 'Name Of the Court',
            accessor: 'CourtName',
        },
        {
            Header: 'Place',
            accessor: 'place',
        },
        {
            Header: 'Tel',
            accessor: 'Tel',
        },
        {
            Header: 'Edit',
            accessor: 'edit',
            Cell: ({ row }) => (
                <button className="px-4 py-1 font-bold text-blue-500 rounded hover:bg-blue-600">
                    <Pencil size={18}/>
                </button>
            ),
        },
        { Header: 'Delete',
            Cell: ({ row }) => (
                <button
                    className="px-4 py-1 font-bold text-red-500 text hover:bg-red-600"
                    onClick={() => row.original && row.original._id && onDelete(row.original._id)}
                >
                    <Trash2 size={18}/>
                </button>
            ),
        },
    ], [onDelete]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: courts });

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-1 py-4">{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-slate-300">
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className=" bg-slate-900 hover:bg-slate-800">
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-1 py-4 ">{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


export default CourtTable;
