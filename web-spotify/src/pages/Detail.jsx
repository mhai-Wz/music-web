import { useParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRedoAlt,
  FaHeart,
  FaArrowLeft,
  FaVolumeUp,
  FaVolumeDown,
} from "react-icons/fa";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  /* LOAD SONG */
  useEffect(() => {
    fetch(`https://music-web-3.onrender.com/songs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);

        const fav = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorite(fav.includes(data._id));
      });
  }, [id]);

  /* PLAY */
  useEffect(() => {
    if (!song || !audioRef.current || !videoRef.current) return;

    const audio = audioRef.current;
    const video = videoRef.current;

    const update = () => setCurrent(audio.currentTime || 0);
    const load = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", load);

    audio.volume = volume;
    video.muted = true;

    audio.play().then(() => setPlaying(true)).catch(() => {});
    video.play().catch(() => {});

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", load);
    };
  }, [song]);

  /* ===== LYRICS STRING -> ARRAY ===== */
  const lyricLines =
    typeof song?.lyrics === "string"
      ? song.lyrics.split("\n").filter((line) => line.trim() !== "")
      : [];

  const activeIndex = Math.floor(current / 5);

  /* AUTO SCROLL */
  useEffect(() => {
    const active = document.getElementById(`lyric-${activeIndex}`);
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  const togglePlay = async () => {
    if (playing) {
      audioRef.current.pause();
      videoRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      await videoRef.current.play();
      setPlaying(true);
    }
  };

  const replay = () => {
    audioRef.current.currentTime = 0;
    videoRef.current.currentTime = 0;
    audioRef.current.play();
    videoRef.current.play();
    setPlaying(true);
  };

  const back5 = () => {
    audioRef.current.currentTime -= 5;
    videoRef.current.currentTime -= 5;
  };

  const next5 = () => {
    audioRef.current.currentTime += 5;
    videoRef.current.currentTime += 5;
  };

  const toggleFavorite = () => {
    let fav = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {
      fav = fav.filter((item) => item !== song._id);
    } else {
      fav.push(song._id);
    }

    localStorage.setItem("favorites", JSON.stringify(fav));
    setFavorite(!favorite);
  };

  const changeVolume = (value) => {
    setVolume(value);
    audioRef.current.volume = value;
  };

  const format = (t = 0) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!song) return <h2 style={{ color: "white" }}>Loading...</h2>;

  return (
    <div style={styles.page}>
      <video
        ref={videoRef}
        src={song.video}
        autoPlay
        muted
        loop
        playsInline
        style={styles.video}
      />

      <audio ref={audioRef} src={song.audio} />

      <div style={styles.overlay}></div>

      <div style={styles.layout}>
        {/* LEFT */}
        <div style={styles.card}>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            <FaArrowLeft />
          </button>

          <img src={song.image} style={styles.cover} />
          <h2 style={styles.title}>{song.title}</h2>

          <div style={styles.controls}>
            <button style={styles.smallBtn} onClick={replay}>
              <FaRedoAlt />
            </button>

            <button style={styles.smallBtn} onClick={back5}>
              <FaStepBackward />
            </button>

            <button style={styles.playBtn} onClick={togglePlay}>
              {playing ? <FaPause /> : <FaPlay />}
            </button>

            <button style={styles.smallBtn} onClick={next5}>
              <FaStepForward />
            </button>

            <button
              style={{
                ...styles.smallBtn,
                color: favorite ? "#ff4d6d" : "white",
              }}
              onClick={toggleFavorite}
            >
              <FaHeart />
            </button>
          </div>

          <div style={styles.progressRow}>
            <span>{format(current)}</span>

            <input
              type="range"
              min="0"
              max={duration}
              value={current}
              onChange={(e) => {
                const time = Number(e.target.value);
                audioRef.current.currentTime = time;
                videoRef.current.currentTime = time;
                setCurrent(time);
              }}
              style={styles.progress}
            />

            <span>{format(duration)}</span>
          </div>

          <div style={styles.volumeRow}>
            <FaVolumeDown />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              style={styles.volume}
            />

            <FaVolumeUp />
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.lyricsBox}>
          {lyricLines.length > 0 ? (
            lyricLines.map((line, index) => (
              <p
                key={index}
                id={`lyric-${index}`}
                style={{
                  ...styles.lyricLine,
                  color:
                    activeIndex === index
                      ? "#fff"
                      : "rgba(255,255,255,0.45)",
                  fontSize: activeIndex === index ? "28px" : "20px",
                  transform:
                    activeIndex === index
                      ? "scale(1.06)"
                      : "scale(1)",
                }}
              >
                {line}
              </p>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>Chưa có lyrics</p>
          )}
        </div>
      </div>
    </div>
  );
}

const glass = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  backdropFilter: "blur(20px)",
};

const styles = {
  page: {
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
  },

  layout: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "20px",
    padding: "20px 15px",
    overflowY: "auto",
  },

  card: {
    ...glass,
    width: "100%",
    maxWidth: "460px",
    padding: "24px 20px",
    borderRadius: "28px",
  },

  backBtn: {
    position: "absolute",
    top: "16px",
    left: "16px",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    cursor: "pointer",
    zIndex: 10,
  },

  cover: {
    width: "160px",
    height: "160px",
    borderRadius: "20px",
    objectFit: "cover",
    marginBottom: "16px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },

  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
  },

  smallBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    cursor: "pointer",
  },

  playBtn: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    border: "none",
    background: "white",
    color: "#000",
    cursor: "pointer",
  },

  progressRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "15px",
    color: "white",
  },

  progress: { 
    flex: 1 
  },

  volumeRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    color: "white",
  },

  volume: {
    width: "150px",
  },

  lyricsBox: {
    ...glass,
    width: "100%",
    maxWidth: "520px",
    height: "auto",
    minHeight: "320px",
    maxHeight: "520px",
    padding: "30px 24px",
    borderRadius: "28px",
    overflowY: "auto",
    scrollbarWidth: "none",
  },

  lyricLine: {
    textAlign: "center",
    marginBottom: "24px",
    transition: "0.35s",
    fontWeight: "600",
    lineHeight: "1.75",
  },

  // ================= MOBILE RESPONSIVE =================
  "@media (max-width: 768px)": {
    layout: {
      padding: "15px 10px",
      gap: "16px",
    },
    card: {
      padding: "20px 16px",
    },
    cover: {
      width: "140px",
      height: "140px",
    },
    title: {
      fontSize: "26px",
    },
    lyricsBox: {
      padding: "24px 20px",
    },
  },

  "@media (max-width: 480px)": {
    card: {
      padding: "18px 14px",
    },
    playBtn: {
      width: "66px",
      height: "66px",
    },
    title: {
      fontSize: "24px",
    },
    // Không dùng activeIndex ở đây
  },
};
export default Detail;