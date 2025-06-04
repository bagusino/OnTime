import {
  Box,
  Paper,
  Modal,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import { useRef } from "react";
type Task = {
  id: string;
  title: string;
  duration: number; // en segundos
  isActive: boolean;
  startTime: Date; // hora de inicio
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const startTimer = (taskId: string) => {
    if (intervalId) clearInterval(intervalId);

    const newInterval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId && task.isActive
            ? { ...task, duration: task.duration + 1 }
            : task
        )
      );
    }, 1000);

    setIntervalId(newInterval);
  };
  const addTask = () => {
    if (newTaskTitle.trim() === "") return;

    const id = crypto.randomUUID();

    // Detener tareas anteriores
    setTasks((prev) => prev.map((t) => ({ ...t, isActive: false })));

    const newTask: Task = {
      id,
      title: newTaskTitle,
      duration: 0,
      isActive: true,
      startTime: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setModalOpen(false);
    setIsRunning(true);
    startTimer(id);
  };
  const stopTask = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setTasks((prev) => prev.map((t) => ({ ...t, isActive: false })));
    setIsRunning(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => {
    setModalOpen(true);

    // Esperar al render del modal
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  const handleExportCSV = () => {
    const formattedDate = currentDate.toISOString().split("T")[0];

    const header = "Fecha,Título,Duración (s),¿Activa?,Hora de inicio\n";
    const rows = tasks.map((task) => {
      const startTimeStr = task.startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return `${formattedDate},"${task.title}",${task.duration},${
        task.isActive ? "Sí" : "No"
      },${startTimeStr}`;
    });

    const csvContent = header + rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tareas_${formattedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#f3e8fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 0,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: {
            xs: "100%",
            sm: "90%",
            md: "35vw",
          },
          height: {
            xs: "100%",
            md: "95vh",
          },
          maxWidth: 480,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // importante
        }}
      >
        {/* Encabezado con fecha y hora */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
            borderBottom: "1px solid #ccc",
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          {/* Fecha */}
          <Box>
            <Typography variant="h4">{currentDate.getDate()}</Typography>
            <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
              {currentDate.toLocaleString("default", { month: "short" })}{" "}
              {currentDate.getFullYear()}
            </Typography>
          </Box>

          {/* Hora */}
          <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "gray" }}>
            {currentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Typography>
        </Box>

        {/* Lista de tareas */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              title={task.title}
              isActive={task.isActive}
              baseDuration={task.duration}
            />
          ))}
        </Box>

        {/* Botones + y Stop */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: 56,
            backgroundColor: "white",
            borderTop: "1px solid #ccc",
            display: "flex",
            borderBottomLeftRadius: "inherit",
            borderBottomRightRadius: "inherit",
            zIndex: 1,
          }}
        >
          <Button
            onClick={handleExportCSV}
            sx={{ flex: 1, borderRight: "1px solid #ccc", borderRadius: 0 }}
          >
            IMPORTAR
          </Button>

          <Button
            onClick={openModal}
            sx={{ flex: 1, borderRight: "1px solid #ccc", borderRadius: 0 }}
          >
            +
          </Button>

          <Button
            onClick={stopTask}
            disabled={!isRunning}
            sx={{ flex: 1, borderRadius: 0 }}
          >
            STOP
          </Button>
        </Box>
      </Paper>

      {/* Modal de nueva tarea */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            minWidth: 300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Nueva tarea
          </Typography>
          <TextField
            inputRef={inputRef}
            fullWidth
            label="Nombre de la tarea"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
            sx={{ mb: 2 }}
          />

          <Button variant="contained" fullWidth onClick={addTask}>
            Iniciar tarea
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
