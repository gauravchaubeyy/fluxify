import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Thumbnail({ video, imageUrl }) {
  const [dashUrl, setDashUrl] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Store the selected uuid in state
    const selectedUuid = video.uuid;

    // Now you can use the selected uuid to construct dashUrl
    const newDashUrl = `http://localhost:3000/stream/${selectedUuid}/playlist.mpd`;

    // Set the dashUrl state
    setDashUrl(newDashUrl);

    // Navigate to the Play component with the dashUrl parameter
    navigate(`/play/${encodeURIComponent(newDashUrl)}`);
    //navigate(`/play/${newDashUrl}`);
  };

  return (
    <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
      <img
        src={imageUrl}
        alt={video.title}
        className="object-cover w-80 h-56 p-4"
        loading="lazy"
      />

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div>
          <h3 className="text-red-700 text-lg font-bold">{video.title}</h3>
          <p className="text-yellow-400 text-sm">{video.description}</p>
        </div>

        <div className="flex items-start">
          <button
            onClick={handleButtonClick}
            className="w-8 h-8 rounded-full flex items-center justify-center border text-white hover:bg-black hover:text-red-700 text-lg font-bold"
          >
            P
          </button>
        </div>
      </div>
    </div>
  );
}
