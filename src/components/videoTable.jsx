import React from 'react';
import { useTable } from 'react-table';
import { Pencil, Trash2 } from 'lucide-react';

const VideoTable = ({ videos, onDeleteVideo, onEditVideo }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Thumbnail',
                accessor: 'imgUrl',
                Cell: ({ row }) => (
                    <img
                        src={row.original.imgUrl}
                        alt={row.original.videoName}
                        className="object-cover w-12 h-12 mx-auto rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                )
            },
            {
                Header: 'Name of Video',
                accessor: 'videoName',
            },
            {
                Header: 'Video By',
                accessor: 'videoCreator',
            },
            {
                Header: 'Created',
                accessor: 'createdAt'
            },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                    <button 
                        onClick={() => onEditVideo(row.original)} 
                        className="px-4 py-1 font-bold text-blue-500 duration-300 ease-in-out transform rounded hover:bg-blue-600 hover:scale-105"
                    >
                        <Pencil size={18} />
                    </button>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button
                        onClick={() => onDeleteVideo(row.original._id)}
                        className="px-4 py-1 font-bold text-red-500 transition duration-300 ease-in-out transform rounded hover:bg-red-600 hover:scale-105"
                    >
                        <Trash2 size={18} />
                    </button>
                ),
            },
        ],
        [onDeleteVideo, onEditVideo]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: videos });

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg table-auto bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-1 py-4" key={column.id}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-slate-300">
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} className="transition duration-300 ease-in-out border-b bg-slate-900 border-slate-700 hover:bg-slate-800" key={row.id}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-1 py-4" key={cell.column.id}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VideoTable;