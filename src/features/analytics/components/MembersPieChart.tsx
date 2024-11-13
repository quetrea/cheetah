import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MembersPieChartProps {
  totalMembers: number;
  adminCount: number;
  memberCount: number;
}

const MembersPieChart: React.FC<MembersPieChartProps> = ({
  totalMembers,
  adminCount,
  memberCount,
}) => {
  const data = {
    labels: ["Admin", "Member", "Other"],
    datasets: [
      {
        label: "Member Count",
        data: [
          adminCount,
          memberCount,
          totalMembers - (adminCount + memberCount),
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Admin
          "rgba(255, 99, 132, 0.6)", // Member
          "rgba(255, 206, 86, 0.6)", // Other
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Admin
          "rgba(255, 99, 132, 1)", // Member
          "rgba(255, 206, 86, 1)", // Other
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col gap-y-4">
      <h2 className="text-center text-2xl">Members Analytics</h2>
      <Pie data={data} />
    </div>
  );
};

export default MembersPieChart;
