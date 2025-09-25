import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

const AttendanceSummaryChart = () => {
  const [data, setData] = useState([]);
  const [meetingTypes, setMeetingTypes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/churchapp/attendance/summary")
      .then((res) => {
        const chartData = res.data || [];

        // Detect unique meeting types from the first few rows
        const types = new Set();
        chartData.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (key !== "month") types.add(key);
          });
        });

        setData(chartData);
        setMeetingTypes(Array.from(types));
      });
  }, []);

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
        <Legend />
        {meetingTypes.map((type, index) => (
          <Bar key={type} dataKey={type} stackId='a' fill={getColor(index)} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const getColor = (index) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#d0743c", "#a05d56"];
  return colors[index % colors.length];
};

export default AttendanceSummaryChart;
