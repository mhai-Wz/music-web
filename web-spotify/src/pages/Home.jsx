import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongCard from "../components/SongCard";

function Home() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  /* ======================
      FETCH FROM BACKEND
  ====================== */
  useEffect(() => {
    fetch("https://music-web-3.onrender.com/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.page}>
      {/* Video Background - Sửa ở đây */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        style={styles.videoBg}
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={styles.glassPage}>
        {/* Header */}
        <div style={styles.topBar}>
          <h2 style={styles.title}>List nhạc Trung chữa lành</h2>

          <button
            style={styles.addBtn}
            onClick={() => navigate("/add-song")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.10)";
            }}
          >
            + Add Song
          </button>
        </div>

        {/* List Song */}
        <div style={styles.list}>
          {songs.map((song) => (
            <SongCard
              key={song._id || song.id}
              song={song}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },

  videoBg: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2,
  },

  glassPage: {
    minHeight: "90vh",
    width: "90%",
    margin: "30px auto",
    padding: "40px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(4px)",
    borderRadius: "25px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },

  title: {
    color: "white",
    fontSize: "32px",
    margin: 0,
  },

  addBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(10px)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.25s ease",
  },

  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
  },
};

export default Home;