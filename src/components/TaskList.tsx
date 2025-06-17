// components/TaskList.tsx
import { Box } from "@mui/material";
import TaskItem from "./TaskItem";
import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  listRef: React.RefObject<HTMLDivElement | null>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, listRef }) => (
  <Box ref={listRef} sx={{ flex: 1, overflowY: "auto", padding: 2, display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
    {tasks.map((task) => (
      <TaskItem key={task.id} title={task.title} isActive={task.isActive} baseDuration={task.duration} />
    ))}
  </Box>
);

export default TaskList;