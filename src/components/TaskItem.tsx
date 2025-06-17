import { Paper, Typography } from "@mui/material";

interface TaskItemProps {
  title: string;
  baseDuration: number;
  isActive: boolean;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const TaskItem: React.FC<TaskItemProps> = ({ title, baseDuration, isActive }) => {
  return (
    <Paper
      sx={{
        height: 50,
        borderRadius: 2,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: isActive ? "#c8e6c9" : "#f5f5f5",
        minHeight : 50
      }}
    >
      <Typography
        fontSize={14}
        sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {title}
      </Typography>

      <Typography fontSize={14} fontWeight="bold">
        {formatDuration(baseDuration)}
      </Typography>
    </Paper>
  );
};

export default TaskItem;
