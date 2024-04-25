import React, { useRef, useState, useEffect } from 'react';
import MidiPlayer from 'midi-player-js';

const MidiPlayerComponent = ({ midiBlob }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef(new MidiPlayer.Player());

  useEffect(() => {
    // Set up event listener for the MIDI player
    player.current.on('endOfFile', () => {
      setIsPlaying(false);
      //stopMidi();
    });

    // Cleanup function for useEffect
    return () => {
      player.current.stop();
    };
  }, []);

  useEffect(() => {
    if (midiBlob && !isPlaying) {
      loadAndPlayMidi();
    }
  }, [midiBlob, isPlaying]); // React to changes in midiBlob and isPlaying

  const loadAndPlayMidi = () => {
    if (!player.current.isPlaying) {
      const reader = new FileReader();
      reader.onload = function(e) {
        console.log('MIDI file loaded successfully:', e.target.result);
        player.current.loadDataUri(e.target.result);
        player.current.play();
        setIsPlaying(true);
      };
      reader.onerror = function(error) {
        console.error('Error loading MIDI file:', error);
      };
      reader.readAsDataURL(midiBlob); // Converts blob to data URL
    }
  };

  const stopMidi = () => {
    player.current.stop();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying); // Update state based on previous state
  };

  useEffect(() => {
    console.log('Component rendered. isPlaying:', isPlaying);
  }, [isPlaying]); // Log whenever isPlaying changes

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Stop' : 'Play'} MIDI
      </button>
    </div>
  );
};

export default React.memo(MidiPlayerComponent);