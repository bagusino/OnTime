import { Box, Paper} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import TaskControls from "../components/TaskControls";
import HeaderDate from "../components/HeaderDate";
import type { Task } from "../types";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("taskList");
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          setTasks(
            parsed.map((t: any) => ({
              ...t,
              startTime: new Date(t.startTime),
            }))
          );
        }
      }
    } catch (e) {
      console.error("Error al cargar tareas", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      setTasks((prev) =>
        prev.map((task) => {
          if (task.isActive) {
            const secondsElapsed = Math.floor(
              (new Date().getTime() - new Date(task.startTime).getTime()) / 1000
            );
            return { ...task, duration: secondsElapsed };
          }
          return task;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const id = crypto.randomUUID();
    const newTask: Task = {
      id,
      title: newTaskTitle.trim(),
      duration: 0,
      isActive: true,
      startTime: new Date(),
    };

    setTasks((prev) => {
      const updated = prev.map((t) => ({ ...t, isActive: false }));
      return [...updated, newTask];
    });

    setNewTaskTitle("");
    setModalOpen(false);
    setIsRunning(true);
  };

  const stopTask = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, isActive: false })));
    setIsRunning(false);
  };

  const openModal = () => {
    setModalOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
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
      return `${formattedDate},"${task.title}",${task.duration},${task.isActive ? "Sí" : "No"},${startTimeStr}`;
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
    <Box sx={{ height: "100vh", width: "100vw", bgcolor: "#f3e8fd", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", p: 0 }}>
      <Paper elevation={3} sx={{ width: { xs: "100%", sm: "90%", md: "35vw" }, height: { xs: "100%", md: "95vh" }, maxWidth: 480, borderRadius: 4, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <HeaderDate currentDate={currentDate} />
        <TaskList tasks={tasks} listRef={listRef} />
        <TaskControls onExport={handleExportCSV} onOpenModal={openModal} onStop={stopTask} isRunning={isRunning} />
      </Paper>
      <TaskModal
        open={modalOpen}
        inputRef={inputRef}
        title={newTaskTitle}
        onChangeTitle={setNewTaskTitle}
        onAdd={addTask}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
