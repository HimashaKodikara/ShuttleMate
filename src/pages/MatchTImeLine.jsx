import React, { useState, useEffect } from "react";
import MatchDetails from "../components/Match/MatchDetails";
import MatchesModal from "../components/Match/MatchesModal";
import Navbar from "../components/Navbar";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseconfig";
import Swal from "sweetalert2";
import axios from "axios";

const MatchTimeLine = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/matches/");
      console.log("✅ API Response:", response.data);

      setMatches(response.data.matches || response.data);

    } catch (error) {
      console.error("❌ Error fetching matches:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch matches.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAddMatch = () => {
    setCurrentMatch(null);
    setIsModalOpen(true);
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/matches/${matchId}`);
      
      if (response.data.success) {
        setMatches(matches.filter(match => match._id !== matchId));
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Match has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error("Failed to delete match");
      }
    } catch (error) {
      console.error("❌ Error deleting match:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete match'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const uploadFileToFirebase = async (file) => {
    if (!file) return null;

    try {
      setUploading(true);
      const fileName = `match_photos/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`⬆ Upload Progress: ${progress}%`);
          },
          (error) => {
            console.error("❌ Upload Error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMatch = async (matchData) => {
    try {
      setUploading(true);
      let photoURL = matchData.MatchPhoto;

      if (matchData.MatchPhotoFile && matchData.MatchPhotoFile instanceof File) {
        photoURL = await uploadFileToFirebase(matchData.MatchPhotoFile);
        if (!photoURL) throw new Error("Failed to upload image");
      }

      const matchDataToSave = {
        ...matchData,
        MatchPhoto: photoURL,
      };

      let response;
      let successMessage;

      if (currentMatch?._id) {
        response = await axios.put(
          `http://localhost:5000/api/matches/match/${currentMatch._id}`,
          matchDataToSave
        );
        successMessage = "Match updated successfully!";
      } else {
        response = await axios.post("http://localhost:5000/api/matches/", matchDataToSave);
        successMessage = "Match created successfully!";
      }

      if (response.status === 200 || response.status === 201) {
        fetchMatches(); 
        Swal.fire({ icon: "success", title: "Success", text: successMessage });
        handleCloseModal();
      } else {
        throw new Error("Failed to save match");
      }
    } catch (error) {
      console.error("❌ Error saving match:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong. Please try again!" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditMatch = (match) => {
    setCurrentMatch(match);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <h2 className="mt-10 mb-8 text-3xl font-bold text-center">Matches Timeline</h2>

      <div className="flex justify-end mx-20">
        <button
          onClick={handleAddMatch}
          className="px-4 py-2 mb-4 text-white rounded bg-amber-500 hover:bg-yellow-400"
          disabled={uploading}
        >
          Add New Match
        </button>
      </div>

      {/* Pass Matches to MatchDetails */}
      <MatchDetails 
        matches={matches} 
        isLoading={isLoading} 
        onUpdateMatch={handleEditMatch} 
        onDeleteMatch={handleDeleteMatch}
      />

      {/* Match Modal for Adding & Editing */}
      <MatchesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMatch}
        match={currentMatch}
        uploading={uploading}
      />
    </div>
  );
};

export default MatchTimeLine;