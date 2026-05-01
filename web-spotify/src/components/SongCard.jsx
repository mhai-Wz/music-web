import { useNavigate } from "react-router-dom";

function SongCard({ song }) {
  const navigate = useNavigate();

  const getDetail = () => {
    navigate(`/song/${song._id}`);
  };

  return (
    <div
      style={styles.card}
      onClick={getDetail}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow =
          "0 18px 40px rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow =
          "0 8px 30px rgba(0,0,0,0.18)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
      }}
    >
      <img src={song.image} style={styles.img} />

      <h3 style={styles.title}>{song.title}</h3>

      <div style={styles.bottom}>
        <p style={styles.status}>
          <span
            style={{
              ...styles.dot,
              background: song.video ? "#22c55e" : "#facc15",
            }}
          ></span>

          {song.video ? "Có video edit" : "Chưa có video edit"}
        </p>

        <button
          style={styles.playBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.background =
              "rgba(255,255,255,0.28)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background =
              "rgba(255,255,255,0.18)";
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "320px",
    padding: "16px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
    color: "white",
    transition: "all 0.28s ease",
    cursor: "pointer",
  },

  img: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "16px",
    marginBottom: "14px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "14px",
    lineHeight: "1.3",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.85)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
  },

  playBtn: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  // Mobile
  "@media (max-width: 480px)": {
    card: {
      maxWidth: "100%",
      padding: "14px",
    },
    img: {
      height: "180px",
    },
    title: {
      fontSize: "22px",
    },
    playBtn: {
      width: "48px",
      height: "48px",
      fontSize: "18px",
    },
  },
};

export default SongCard;