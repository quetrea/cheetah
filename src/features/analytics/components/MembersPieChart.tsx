import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="w-full max-w-lg mx-auto p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl bg-gradient-to-r text-center from-foreground to-foreground/70 bg-clip-text text-transparent mb-8"
        variants={itemVariants}
      >
        Members Analytics
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <motion.div
          variants={chartVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="w-[250px] md:w-[300px]"
        >
          <Pie
            data={data}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              responsive: true,
              maintainAspectRatio: true,
            }}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 w-full md:flex-1 px-2 md:px-0"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center gap-x-2 p-3 md:p-2 rounded-lg bg-[rgba(75,192,192,0.1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-3 h-3 rounded-full bg-[rgb(75,192,192)]" />
            <div className="flex justify-between flex-row w-full">
              <div className="font-medium text-sm md:text-base">Admin</div>
              <div className="font-bold text-[rgb(75,192,192)] px-2">
                {adminCount}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-x-2 p-3 md:p-2 rounded-lg bg-[rgba(255,99,132,0.1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-3 h-3 rounded-full bg-[rgb(255,99,132)]" />
            <div className="flex justify-between flex-row w-full">
              <div className="font-medium text-sm md:text-base">Member</div>
              <div className="font-bold text-[rgb(255,99,132)] px-2">
                {memberCount}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-x-2 p-3 md:p-2 rounded-lg bg-[rgba(255,206,86,0.1)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-3 h-3 rounded-full bg-[rgb(255,206,86)]" />
            <div className="flex justify-between flex-row w-full">
              <div className="font-medium text-sm md:text-base">Other</div>
              <div className="font-bold text-[rgb(255,206,86)] px-2">
                {totalMembers - (adminCount + memberCount)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MembersPieChart;
