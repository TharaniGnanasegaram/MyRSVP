import React, { useEffect, useRef } from 'react';
import Vimeo from '@vimeo/player';

const VimeoPlayer = ({ videoUrl }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    let player;

    try {
      player = new Vimeo(playerRef.current, {
        url: videoUrl,
      });
    } catch (error) {
      console.error('Invalid Vimeo URL:', error);
      // Perform any necessary error handling or display error messages to the user
      // ...

      // Return early or set the player to null if desired
      return;
    }

    return () => {
      player.unload();
    };
  }, [videoUrl]);

  return (
    <div className="vimeo-container">
      <div ref={playerRef} />
    </div>
  );
};

export default VimeoPlayer;