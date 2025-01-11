import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const data = {
    labels: [
      `${t("analytics.membersAnalytics.Admin.title")}`,
      `${t("analytics.membersAnalytics.Member.title")}`,
      `${t("analytics.membersAnalytics.Other.title")}`,
    ],
    datasets: [
      {
        label: `${t("analytics.membersAnalytics.memberCount")}`,
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
      className="w-full h-full flex  flex-col justify-between  mx-auto "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="text-2xl p-6  font-bold  " variants={itemVariants}>
        {t("analytics.membersAnalytics.title")}
      </motion.h2>

      <div className="p-6 w-full h-full  justify-center flex items-center">
        <div className=" flex max-w-lg lg:max-w-2xl  sm:w-full  md:flex-row justify-center items-center p-4">
          <motion.div
            variants={chartVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 },
            }}
            className="w-[500px] md:w-[300px] lg:w-[400px]  hidden md:flex"
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
            className="flex flex-col gap-3  w-full md:flex-1 px-2 md:px-0"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center gap-x-2 p-3 md:p-2 rounded-lg bg-[rgba(75,192,192,0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-3 h-3 rounded-full bg-[rgb(75,192,192)]" />
              <div className="flex justify-between flex-row w-full">
                <div className="font-medium text-sm md:text-base">
                  {t("analytics.membersAnalytics.Admin.title")}
                </div>
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
                <div className="font-medium text-sm md:text-base">
                  {t("analytics.membersAnalytics.Member.title")}
                </div>
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
                <div className="font-medium text-sm md:text-base">
                  {t("analytics.membersAnalytics.Other.title")}
                </div>
                <div className="font-bold text-[rgb(255,206,86)] px-2">
                  {totalMembers - (adminCount + memberCount)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembersPieChart;
