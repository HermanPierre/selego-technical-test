import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import api from "../../services/api";

export function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  date.setHours(0, 0, 0, 0);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export async function handleExportExcel(project) {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data: activities } = await api.get(`/activity?dateFrom=${firstDay.getTime()}&dateTo=${lastDay.getTime()}&projectId=${encodeURIComponent(project._id)}`);
    const { data: users } = await api.get(`/user`);

    console.log({ activities, users });

    const days = getDaysInMonth(now.getMonth(), now.getFullYear());

    const headers = [
      "User",
      "Total Days",
      ...days.map((date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
    ];

    const mappedActivities = activities.map((activity) => {
      console.log({ activity });
      const user = users.find((u) => u._id === activity.userId);
      return {
        ...activity,
        user: user?.name || "No name",
      };
    });

    const rows = mappedActivities.map((activity) => {
      return [
        activity.user,
        (activity.total / 8).toFixed(2),
        ...days.map((_, index) => {
          return activity.detail[index]?.value || 0;
        }),
      ];
    });

    const totalsRow = [
      "TOTAL",
      (mappedActivities.reduce((acc, curr) => acc + curr.total, 0) / 8).toFixed(2),
      ...days.map((_, index) => {
        return mappedActivities.reduce((acc, curr) => {
          return acc + (curr.detail[index]?.value || 0);
        }, 0);
      }),
    ];

    const exportData = [headers, ...rows, totalsRow];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    ws["!cols"] = [{ width: 20 }, { width: 10 }, ...days.map(() => ({ width: 8 }))];

    XLSX.utils.book_append_sheet(wb, ws, "Activities");
    XLSX.writeFile(wb, `${project.name}_activities_${now.toISOString().split("T")[0]}.xlsx`);
  } catch (error) {
    console.error("Error when exporting to excel:", error);
    toast.error("Failed to export excel");
  }
}
