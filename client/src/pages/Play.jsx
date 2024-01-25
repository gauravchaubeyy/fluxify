import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";
import { useParams } from "react-router-dom";

export default function Play() {
  const videoRef = useRef();
  const { dashUrl } = useParams();
  //console.log(dashUrl)

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, decodeURIComponent(dashUrl), true);
    //player.initialize(videoRef.current, dashUrl, true);
    return () => {
      player.reset();
    };
  }, [dashUrl]);

  return <video ref={videoRef} controls autoPlay />;
}
