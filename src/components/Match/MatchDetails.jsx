import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import MatchEditModal from "./EditMatchModal";
import { Pencil, Trash2 } from 'lucide-react';


const MatchDetails = ({ matches = [], isLoading, onUpdateMatch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
   
  }, [matches]);

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleSaveMatch = (updatedMatch) => {
    onUpdateMatch(updatedMatch);
    setIsModalOpen(false);
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => row.MatchPhoto,
      cell: (row) => (
        row.MatchPhoto ? (
          <img src={row.MatchPhoto} alt="Match" className="object-cover w-16 h-16 py-2 rounded" />
        ) : (
          <span className="text-gray-500">No Image</span>
        )
      ),
      sortable: false,
    },
    {
      name: "Match Name",
      selector: (row) => row.MatchName || "No Name",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.StartDate || "No Date",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.EndDate || "No Date",
      sortable: true,
    },
    {
      name: "Link",
      selector: (row) => row.Weblink,
      cell: (row) => (
        row.Weblink ? (
          <a href={row.Weblink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Apply online
          </a>
        ) : (
          <span className="text-gray-500">No Link</span>
        )
      ),
    },
    {
      name: 'Edit',
      cell: (row) => (
          <div className="flex justify-center w-full">
              <button
                  className="flex items-center justify-center w-10 h-10 font-bold text-blue-500 duration-300 ease-in-out transform rounded hover:bg-blue-100 hover:scale-105"
                  onClick={() => handleEditClick(row)}
              >
                  <Pencil size={18} />
              </button>
          </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
  },
   
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1e3a8a',
        color: 'white',
        //fontWeight: 'bold',
        justifyContent: 'center', // Center header text
        textAlign: 'center',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
          padding: '0.5rem',
          justifyContent: 'center',
      },
  },
  };

  return (
    <div className="items-center justify-center w-full px-24 auto">
      <div className="overflow-hidden rounded-lg shadow-xl">
        <DataTable
          columns={columns}
          data={matches}
          progressPending={isLoading}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles} // Apply custom styles to the table
        />
        {selectedMatch && (
          <MatchEditModal
            match={selectedMatch}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveMatch}
          />
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
