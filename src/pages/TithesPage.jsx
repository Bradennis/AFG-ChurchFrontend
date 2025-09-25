// TithesPage.jsx
import { useNavigate } from "react-router-dom";
import TithesChart from "./TithesChart";
import TithesHistory from "./TitheHistory";

const TithesPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Tithes Overview</h2>

      <div style={{ marginBottom: "20px", textAlign: "right" }}>
        <button
          style={{
            background: "#284268",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            border: "none",
          }}
          onClick={() => navigate("/tithes/record")}
        >
          ➕ Add New Tithe
        </button>
      </div>

      <section style={{ marginBottom: "40px" }}>
        <TithesChart />
      </section>

      <section>
        <TithesHistory />
      </section>
    </div>
  );
};

export default TithesPage;
