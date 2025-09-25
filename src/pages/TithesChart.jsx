import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const TithesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://afg-churchbackend.onrender.com/churchapp/tithes/summary")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch chart data", err));
  }, []);

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3>📈 Monthly Tithes Summary</h3>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='totalAmount' fill='#4CAF50' />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TithesChart;
