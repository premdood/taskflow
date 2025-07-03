import {
  Bar,
  BarChart,
  CartesianGrid,
  // Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Chart({ data }) {
  const renderBarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        width={150}
        height={40}
        className="border-none outline-none"
        style={{ outline: "none", border: "none" }}
      >
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis allowDecimals={false} />
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
        {/* <Legend
          width={100}
          wrapperStyle={{
            top: 40,
            right: 20,
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
          }}
        /> */}
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar
          dataKey="total"
          fill="#8884d8"
          barSize={75}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return renderBarChart;
}

export default Chart;
