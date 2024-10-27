import { Box, Typography, Card, CardContent, useTheme } from "@mui/material";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{
        width: "80%",
        margin: "20px auto",
        borderRadius: theme.shape.borderRadius, // Use theme-defined border radius
        border: `2px solid ${theme.palette.secondary.main}`, // Use theme primary color for border
        transition: "transform 0.3s, border 0.3s",
        '&:hover': {
          transform: "translateY(-5px) scale(1.02)", // Scale effect on hover
         // Change to secondary color on hover
          boxShadow: `${theme.shadows[5]}`, // Increase shadow on hover
        },
        boxShadow: theme.shadows[3], // Use theme-defined shadow
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box mr={2}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ color: theme.palette.secondary.main }}>
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatBox;
