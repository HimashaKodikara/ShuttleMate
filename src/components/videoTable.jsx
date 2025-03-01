// VideoTable.js
import React from 'react';
import { useTable } from 'react-table';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

const VideoTable = ({ videos, fetchVideos }) => {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Thumbnail',
                accessor: 'Thumbnail',
                Cell: ({ row }) => (
                    <img
                        src={row.original.imgUrl}
                        alt={row.original.ShopName}
                        className="object-cover w-12 h-12 mx-auto rounded-full"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                    />
                )},
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
                accessor: 'createdAt',
            },
            {
                Header: 'Edit',
                Cell: ({ row }) => (
                    <button className="px-4 py-1 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 rounded hover:bg-blue-600 hover:scale-105">
                          <Pencil size={18} />
                    </button>
                ),
            },
            {
                Header: 'Delete',
                Cell: ({ row }) => (
                    <button
                        className="px-4 py-1 font-bold text-white transition duration-300 ease-in-out transform bg-red-500 rounded hover:bg-red-600 hover:scale-105"
                        onClick={() => handleDeleteVideo(row.original._id, fetchVideos)}
                    >
                    <Trash2 size={18} />
                    </button>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: videos });

    const handleDeleteVideo = async (id, fetchVideos) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/videos/${id}`);
                fetchVideos(); // Refresh video list after deletion
                Swal.fire({
                    title: "Deleted!",
                    text: "Video has been deleted.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete the video.",
                icon: "error",
            });
        }
    };

    return (
        <div className="mx-20 overflow-x-auto">
            <table {...getTableProps()} className="min-w-full text-center rounded-lg shadow-lg table-auto bg-slate-800">
                <thead className="text-white bg-blue-900">
                    {headerGroups.map(headerGroup => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th key={column.id} {...column.getHeaderProps()} className="px-1 py-4">
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="text-slate-300">
                    {rows.map(row => {
                        prepareRow(row);
                        const { key, ...rowProps } = row.getRowProps();
                        return (
                            <tr key={key} {...rowProps} className="transition duration-300 ease-in-out border-b bg-slate-900 border-slate-700 hover:bg-slate-800">
                                {row.cells.map(cell => (
                                    <td key={cell.column.id} {...cell.getCellProps()} className="px-1 py-4">{cell.render('Cell')}</td>
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
