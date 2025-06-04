import Dashboard from "./pages/Dashboard";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
