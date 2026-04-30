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
    width: "320px",
    padding: "18px",
    borderRadius: "24px",

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
    height: "230px",
    objectFit: "cover",
    borderRadius: "18px",
    marginBottom: "18px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.85)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  playBtn: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.18)",

    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",

    color: "white",
    fontSize: "22px",
    cursor: "pointer",

    transition: "all 0.25s ease",
  },
};

export default SongCard;