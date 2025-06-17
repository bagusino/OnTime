// components/TaskControls.tsx
import { Box, Button } from "@mui/material";

interface TaskControlsProps {
  onExport: () => void;
  onOpenModal: () => void;
  onStop: () => void;
  isRunning: boolean;
}

const TaskControls: React.FC<TaskControlsProps> = ({ onExport, onOpenModal, onStop, isRunning }) => (
  <Box sx={{ position: "sticky", bottom: 0, left: 0, right: 0, width: "100%", height: 56, backgroundColor: "white", borderTop: "1px solid #ccc", display: "flex", borderBottomLeftRadius: "inherit", borderBottomRightRadius: "inherit", zIndex: 1 }}>
    <Button onClick={onExport} sx={{ flex: 1, borderRight: "1px solid #ccc", borderRadius: 0 }}>EXPORTAR</Button>
    <Button onClick={onOpenModal} sx={{ flex: 1, borderRight: "1px solid #ccc", borderRadius: 0 }}>+</Button>
    <Button onClick={onStop} disabled={!isRunning} sx={{ flex: 1, borderRadius: 0 }}>STOP</Button>
  </Box>
);

export default TaskControls;