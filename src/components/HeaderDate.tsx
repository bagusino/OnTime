// components/HeaderDate.tsx
import { Box, Typography } from "@mui/material";

interface HeaderDateProps {
  currentDate: Date;
}

const HeaderDate: React.FC<HeaderDateProps> = ({ currentDate }) => (
  <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1, borderBottom: "1px solid #ccc", position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
    <Box>
      <Typography variant="h4">{currentDate.getDate()}</Typography>
      <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
        {currentDate.toLocaleString("default", { month: "short" })} {currentDate.getFullYear()}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: "1rem", fontWeight: 500, color: "gray" }}>
      {currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </Typography>
  </Box>
);

export default HeaderDate;