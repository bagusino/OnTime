// components/TaskModal.tsx
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

interface TaskModalProps {
  open: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  title: string;
  onChangeTitle: (val: string) => void;
  onAdd: () => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, inputRef, title, onChangeTitle, onAdd, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 24, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>Nueva tarea</Typography>
      <TextField
        inputRef={inputRef}
        fullWidth
        label="Nombre de la tarea"
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
        error={!title.trim()}
        helperText={!title.trim() ? "El título no puede estar vacío." : ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          }
        }}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={onAdd} disabled={!title.trim()}>
        Iniciar tarea
      </Button>
    </Box>
  </Modal>
);

export default TaskModal;