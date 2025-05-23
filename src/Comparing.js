import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import config from "./config";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ListItemIcon,
  Checkbox,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import AppBarMain from "./AppBarMain";

const theme = createTheme({
  zIndex: {
    drawer: 1000,
  },
  spacing: 4,
  palette: {
    primary: {
      main: "#94B4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ABC4FF",
    },
    gradient: {
      main: "#4563DD",
    },
  },
  typography: {
    button: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 300,
    flexShrink: 0,
    "& .MuiListItemText-root": {
      fontSize: "1rem",
      width: "100%",
    },
    "& .MuiListItem-root": {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      width: "100%",
      boxSizing: "border-box",
    },
    "& .MuiButton-root": {
      width: "95%",
      margin: "0 auto",
      display: "block",
      boxSizing: "border-box",
    },
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(3),
  },
  sidebarTitle: {
    padding: theme.spacing(2, 0, 1),
    fontWeight: "bold",
  },
  "custom-table": {
    "& .MuiTableCell-root": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Comparing = () => {
  const classes = useStyles();
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/minors`)
      .then((response) => {
        setMinors(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о майнорах:", error);
      });
  }, []);
  const [minors, setMinors] = useState([]);
  const [openMinors, setOpenMinors] = useState(true);
  const [checkedMinors, setCheckedMinors] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMinorsToggle = (value) => () => {
    const currentIndex = checkedMinors.indexOf(value);
    const newChecked = [...checkedMinors];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedMinors(newChecked);
  };

  const handleSortButtonClick = async () => {
    if (checkedMinors.length < 2 || checkedMinors.length > 5) {
      setErrorMessage("Выберите от 2 до 5 майноров для сравнения.");
      setComparisonData(null);
      return;
    }
    setErrorMessage("");
    try {
      const idsString = checkedMinors.map((id) => `ids=${id}`).join("&");
      const response = await fetch(
        `${config.apiUrl}/comparison_table?${idsString}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error("Ошибка при получении данных для сравнения:", error);
      setErrorMessage("Произошла ошибка при получении данных для сравнения.");
      setComparisonData(null);
    }
  };
  const renderComparisonTable = () => {
    if (errorMessage) {
      return (
        <Typography color="error" style={{ marginLeft: theme.spacing(4) }}>
          {errorMessage}
        </Typography>
      );
    }
    if (!comparisonData) {
      return (
        <Typography style={{ marginLeft: theme.spacing(4) }}>
          Выберите майноры для сравнения и нажмите кнопку "Сравнить".
        </Typography>
      );
    }

    if (comparisonData.length === 0) {
      return <Typography>Нет данных для отображения.</Typography>;
    }

    const characteristics = [
      "categoryTitle",
      "title",
      "difficultyRating",
      "interestRating",
      "timeConsumptionRating",
      "totalRating",
    ];

    const characteristicLabels = {
      categoryTitle: "Категория майнора",
      title: "Название майнора",
      difficultyRating: "Сложность",
      interestRating: "Интересность",
      timeConsumptionRating: "Времязатратность",
      totalRating: "Общая оценка",
    };
    const displayRating = (rating) => {
      return rating === 0 ? "—" : rating.toFixed(2);
    };
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="comparison table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ borderColor: theme.palette.secondary.main }}
              ></TableCell>
              {comparisonData.map((minor) => (
                <TableCell
                  key={minor.id}
                  align="center"
                  sx={{ borderColor: theme.palette.secondary.main }}
                >
                  <Avatar
                    alt={minor.title}
                    src={minor.link}
                    sx={{ width: 64, height: 64, margin: "0 auto" }}
                  />
                  <Typography variant="subtitle1">{minor.title}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {characteristics.map((characteristic) => (
              <TableRow key={characteristic}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ borderColor: theme.palette.secondary.main }}
                >
                  {characteristicLabels[characteristic]}
                </TableCell>
                {comparisonData.map((minor) => (
                  <TableCell
                    key={minor.id}
                    align="center"
                    sx={{ borderColor: theme.palette.secondary.main }}
                  >
                    {characteristic === "title"
                      ? minor.title
                      : characteristic === "categoryTitle"
                      ? minor[characteristic]
                      : displayRating(minor[characteristic])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  return (
    <div className={classes.root}>
      <AppBarMain />
      <Drawer className={classes.drawer} variant="permanent">
        <Toolbar />
        <div className={classes.drawer}>
          <Typography variant="subtitle1" className={classes.sidebarTitle}>
            <ListItemButton onClick={() => setOpenMinors(!openMinors)}>
              <ListItemText
                primary="Майноры"
                slotProps={{
                  primary: {
                    fontWeight: "bold",
                  },
                }}
              />
              {openMinors ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </Typography>
          <Collapse in={openMinors} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {minors.map((minor) => (
                <ListItem
                  button
                  key={minor.id}
                  sx={{ pl: 4 }}
                  onClick={handleMinorsToggle(minor.id)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedMinors.indexOf(minor.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={minor.title} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
            }}
            onClick={handleSortButtonClick}
          >
            Сравнить
          </Button>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {renderComparisonTable()}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Comparing />
    </ThemeProvider>
  );
}
export default App;
