import { Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface TaskItemProps {
  title: string;
  baseDuration: number;
  isActive: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  baseDuration,
  isActive,
}) => {
  const [displayDuration, setDisplayDuration] = useState(baseDuration);

  useEffect(() => {
    setDisplayDuration(baseDuration); // sincroniza si cambia desde fuera
  }, [baseDuration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setDisplayDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <Paper
      sx={{
        height: 50,
        minHeight: 50,
        borderRadius: 2,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: isActive ? "#e3f2fd" : "white", // opcional: fondo distinto si está activa
        border: isActive ? "2px solid #1976d2" : "1px solid #ddd",
      }}
    >
      <Typography
        fontSize={14}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </Typography>

      <Typography fontSize={14} fontWeight="bold">
        {formatTime(displayDuration)}
      </Typography>
    </Paper>
  );
};

export default TaskItem;
