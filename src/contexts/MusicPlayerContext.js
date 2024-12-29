import React, { createContext, useEffect, useRef, useState } from "react";
import { fetchUserProfile } from "../services/profileService";

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [adPlayed, setAdPlayed] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(null);

  const updateSubscriptionType = (newType) => {
    setSubscriptionType(newType);
  };

  const adAudioRef = useRef(
    new Audio(
      "https://www.dropbox.com/scl/fi/3nq1ry540yzt01i46r1qq/Spotify_premium_ad_-_YouConvert.net_.mp3?rlkey=7gwza2f7hetcmfjirplg50jue&st=822qcbrw&raw=1"
    )
  );
  const audioRef = useRef(new Audio());

  // Fetch subscription type from user profile
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setSubscriptionType(userProfile.subscriptionType);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchSubscription();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.URL || currentSong.audioURL || "";
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      setAdPlayed(false);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);

      if (
        subscriptionType !== "Premium" &&
        !adPlayed &&
        !isAdPlaying &&
        audio.currentTime >= 60
      ) {
        playAd();
      }
    };

    const handleEnded = () => handleNextSong();

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionType, adPlayed, isAdPlaying]);

  const playAd = () => {
    const adAudio = adAudioRef.current;
    audioRef.current.pause();
    setIsAdPlaying(true);

    adAudio.volume = volume / 100;
    adAudio.play().then(() => {
      adAudio.addEventListener("ended", () => {
        setIsAdPlaying(false);
        setAdPlayed(true);
        audioRef.current.play();
      });
    });
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (isAdPlaying && subscriptionType !== "Premium") {
      console.log("Ad is playing. Cannot toggle play/pause.");
      return;
    }

    if (!currentSong) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleNextSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong?._id
      );
      const nextIndex = (currentIndex + 1) % playlist.length;

      if (isAdPlaying) {
        adAudioRef.current.pause();
        setIsAdPlaying(false);
      }

      setCurrentSong(playlist[nextIndex]);
    } else {
      console.warn("Playlist is empty.");
      setIsPlaying(false);
    }
  };

  const handlePreviousSong = () => {
    if (playlist && playlist.length > 0) {
      const currentIndex = playlist.findIndex(
        (song) => song._id === currentSong?._id
      );
      const previousIndex =
        (currentIndex - 1 + playlist.length) % playlist.length;

      if (isAdPlaying) {
        adAudioRef.current.pause();
        setIsAdPlaying(false);
      }

      setCurrentSong(playlist[previousIndex]);
    } else {
      console.warn("Playlist is empty.");
    }
  };

  const setCurrentSongWithAdStop = (song) => {
    if (isAdPlaying) {
      adAudioRef.current.pause();
      setIsAdPlaying(false);
    }

    setCurrentSong(song);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    adAudioRef.current.volume = newVolume / 100;
  };

  const handleSeekChange = (newTime) => {
    if (isAdPlaying && subscriptionType !== "Premium") {
      console.log("Ad is playing. Cannot seek.");
      return;
    }

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const resetPlayer = () => {
    console.log("Resetting player...");

    if (isAdPlaying) {
      adAudioRef.current.pause();
      adAudioRef.current.currentTime = 0;
      setIsAdPlaying(false);
      console.log("Ad playback paused and reset.");
    }

    setAdPlayed(false);
    console.log("Ad played state reset.");

    audioRef.current.pause();
    setIsPlaying(false);
    setCurrentSong(null);
    setPlaylist([]);
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
    console.log("Audio playback paused and current time reset.");
  };
  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong: setCurrentSongWithAdStop,
        playlist,
        setPlaylist,
        isPlaying,
        togglePlayPause,
        handleNextSong,
        handlePreviousSong,
        volume,
        handleVolumeChange,
        currentTime,
        duration,
        handleSeekChange,
        subscriptionType,
        updateSubscriptionType,
        adAudioRef,
        isAdPlaying,
        setIsAdPlaying,
        adPlayed,
        setAdPlayed,
        resetPlayer,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
