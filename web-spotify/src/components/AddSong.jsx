import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt, FaMusic } from "react-icons/fa";

function AddSong() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================
      UPLOAD FILE
  ====================== */
  const uploadFile = async (file) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.url;
  };

  /* ======================
      SAVE SONG
  ====================== */
  const saveSong = async () => {
    if (!title || !image || !video || !audio) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadFile(image);
      const videoUrl = await uploadFile(video);
      const audioUrl = await uploadFile(audio);

      await fetch("http://localhost:5000/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image: imageUrl,
          video: videoUrl,
          audio: audioUrl,
        }),
      });

      alert("Thêm bài hát thành công");
      navigate("/");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Lỗi upload");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <FaMusic style={styles.icon} />

        <h2 style={styles.title}>Add New Song</h2>

        <input
          style={styles.input}
          placeholder="Tên bài hát..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={styles.fileBox}>
  {image ? image.name : "Ảnh bìa"}
  <input
    type="file"
    hidden
    onChange={(e) => setImage(e.target.files[0])}
  />
</label>

<label style={styles.fileBox}>
  {video ? video.name : "Video nền"}
  <input
    type="file"
    hidden
    onChange={(e) => setVideo(e.target.files[0])}
  />
</label>

<label style={styles.fileBox}>
  {audio ? audio.name : "Audio nhạc"}
  <input
    type="file"
    hidden
    onChange={(e) => setAudio(e.target.files[0])}
  />
</label>

        <button style={styles.btn} onClick={saveSong}>
          {loading ? "Đang upload..." : "Save Song"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,rgb(16,22,45),rgb(28,55,88),rgb(18,17,42))",
    padding: "30px",
  },

  card: {
    width: "430px",
    padding: "35px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    color: "white",
    textAlign: "center",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "12px",
    color: "#60a5fa",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    marginBottom: "18px",
    fontSize: "16px",
  },

  fileBox: {
    display: "block",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "14px",
    background: "rgba(255,255,255,0.12)",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "15px",
  },

  btn: {
    marginTop: "12px",
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "700",
    color: "white",
    background: "linear-gradient(90deg,#3b82f6,#8b5cf6)",
    boxShadow: "0 10px 25px rgba(59,130,246,0.35)",
  },
};

export default AddSong;