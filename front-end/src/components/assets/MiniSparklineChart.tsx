// // src/components/assets/MiniSparklineChart.tsx
// import { LineChart, Line, ResponsiveContainer } from "recharts";

// interface Props {
//   data: number[];
// }

// export default function MiniSparklineChart({ data }: Props) {
//   const isPositive = data[data.length - 1] >= data[0];

//   return (
//     <ResponsiveContainer width="100%" height={40}>
//       <LineChart data={data.map((y, i) => ({ i, y }))}>
//         <Line
//           type="monotone"
//           dataKey="y"
//           stroke={isPositive ? "#22C55E" : "#EF4444"}
//           strokeWidth={2}
//           dot={false}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }
