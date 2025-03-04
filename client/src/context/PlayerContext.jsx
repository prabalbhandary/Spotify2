import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../components/URL";
import { toast } from "react-toastify";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };
  const playWithId = async (id) => {
    await songsData.map((item) => {
      if(id === item._id){
        setTrack(item)
      }
    })
    await audioRef.current.play()
    setPlayStatus(true)
  };
  const previous = async () => {
    await songsData.map(async(item, index) => {
      if(track._id === item._id && index > 0){
       await setTrack(songsData[index - 1])
       await audioRef.current.play()
       setPlayStatus(true)
      }
    })
  };
  const next = async () => {
    await songsData.map(async(item, index) => {
      if(track._id === item._id && index < songsData.length){
       await setTrack(songsData[index + 1])
       await audioRef.current.play()
       setPlayStatus(true)
      }
    })
  };
  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };
  const getSongsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/songs/list`);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setSongsData(res?.data?.songs);
        setTrack(res?.data?.songs[0]);
      }
    } catch (error) {
      if (error?.response?.data || error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
    setLoading(false);
  };

  const getAlbumsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/albums/list`)
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setAlbumsData(res?.data?.albums);
        setTrack(res?.data?.songs[0]);
      }
    } catch (error) {
      if (error?.response?.data || error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error("Internal Server Error");
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getAlbumsData();
    getSongsData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);
  const contextValue = {
    songsData,
    albumsData,
    loading,
    seekSong,
    previous,
    next,
    playWithId,
    play,
    pause,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    audioRef,
    seekBg,
    seekBar,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
