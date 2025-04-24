import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  ListItemIcon,
  Checkbox,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import SortOptions from "./SortOptions";
import { useNavigate } from "react-router-dom";
import AppBarMain from "./AppBarMain";

const theme = createTheme({
  zIndex: {
    drawer: 1000,
  },
  spacing: 4,
  drawer: {
    width: 300,
  },
  palette: {
    primary: {
      main: "#94B4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e",
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
  appBar: {
    //zIndex: theme.zIndex.drawer + 300,
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: theme.drawer.width,
    flexShrink: 0,
  },
  cardImage: {
    width: "100%",
    height: "150px",
    marginBottom: theme.spacing(1),
    objectFit: "cover",
    objectPosition: "center",
  },
  drawerPaper: {
    width: theme.drawer.width,
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
      width: "100%",
    },
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(3), //  Добавляем прокрутку к контенту
  },
  button: {
    marginTop: "auto", // Прижимаем кнопку к низу
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: theme.spacing(5),
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
  card: {
    display: "flex",
    flexDirection: "column",
    minHeight: "200px",
    cursor: "pointer",
  },
  cardMedia: {
    height: "150px",
    objectFit: "cover",
  },
  sidebarTitle: {
    padding: theme.spacing(2, 0, 1),
    fontWeight: "bold",
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const navLinks = [
    { text: "Главная", to: "/" },
    { text: "Оставить отзыв", to: "/review" },
    { text: "Рейтинг", to: "/rating" },
    { text: "Поиск", to: "/search" },
    { text: "Профиль", to: "/profile" },
  ];

  const filters = {
    sort: ["Сложность", "Интересность", "Времязатратность", "Общий рейтинг"],
    categories: [
      "Анализ данных",
      "Бизнес и менеджмент",
      "Естествознание, математика и программирование",
      "История и философия",
      "Культурология, религиоведение и антропология",
      "Медиа, коммуникации и soft skills",
      "Международные отношения, аналитика и безопасность",
      "Политология, государственное и муниципальное управление, градостроительство",
      "Право и комплаенс",
      "Регионоведение",
      "Социальные науки, психология и педагогика",
      "Филология и языкознание",
      "Экономика, финансы и инвестирование",
    ],
    categoryNameToId: {
      "Анализ данных": 1,
      "Бизнес и менеджмент": 2,
      "Естествознание, математика и программирование": 3,
      "История и философия": 4,
      "Культурология, религиоведение и антропология": 5,
      "Медиа, коммуникации и soft skills": 6,
      "Международные отношения, аналитика и безопасность": 7,
      "Политология, государственное и муниципальное управление, градостроительство": 8,
      "Право и комплаенс": 9,
      Регионоведение: 10,
      "Социальные науки, психология и педагогика": 11,
      "Филология и языкознание": 12,
      "Экономика, финансы и инвестирование": 13,
    },
  };
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/minors")
      .then((response) => {
        const fetchedCards = response.data.map((minor) => ({
          id: minor.id,
          title: minor.title,
          description: "minor.description",
          image: minor.link,
          stars: "⭐⭐⭐⭐⭐",
        }));
        setCards(fetchedCards);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных о майнорах:", error);
      });
  }, []);

  const [openSort, setOpenSort] = useState(true);
  const [openCategories, setOpenCategories] = useState(true);
  const [checkedSortOptions, setCheckedSortOptions] = useState(null);
  const [checkedCategories, setCheckedCategories] = useState([]);

  const handleCategoryToggle = (value) => () => {
    const currentIndex = checkedCategories.indexOf(value);
    const newChecked = [...checkedCategories];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedCategories(newChecked);

    console.log("Selected Categories:", newChecked);
  };

  const handleSortToggle = (index) => () => {
    setCheckedSortOptions(index === checkedSortOptions ? null : index);
  };
  const handleCardClick = (cardId) => {
    navigate(`/card/${cardId}`);
  };
  const handleSortButtonClick = async () => {
    const categoryIds = checkedCategories.map((index) => {
      const categoryName = filters.categories[index];
      return getCategoryIdByName(categoryName);
    });

    const comparatorIndex = checkedSortOptions;
    const comparatorMap = {
      0: "DIFFICULTY_SORT",
      1: "INTEREST_SORT",
      2: "TIME_CONSUMPTION_SORT",
      3: "TOTAL_SORT",
    };

    const comparator = comparatorMap[comparatorIndex];

    if (categoryIds.length === 0 && !comparator) {
      try {
        const response = await axios.get("http://localhost:8080/minors");

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedCards = response.data.map((minor) => ({
          id: minor.id,
          title: minor.title,
          description: minor.description,
          image: minor.link,
          stars: "⭐⭐⭐⭐⭐",
        }));
        setCards(fetchedCards);
      } catch (error) {
        console.error("Ошибка при получении данных о майнорах:", error);
      }
      return;
    }

    const params = {};
    let url = "";
    if (categoryIds.length === 0) {
      url = "http://localhost:8080/minors_sort";
      params.comparator = comparator;
    } else if (!comparator) {
      url = "http://localhost:8080/categories";
      params.categoryIds = categoryIds.join(",");
    } else {
      url = "http://localhost:8080/categories_sort";
      params.categoryIds = categoryIds.join(",");
      params.comparator = comparator;
    }

    try {
      const response = await axios.get(url, {
        params: params,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const fetchedCards = response.data.map((minor) => ({
          id: minor.id,
          title: minor.title,
          image: minor.link,
          stars: "⭐⭐⭐⭐⭐",
        }));
        setCards(fetchedCards);
        console.log("Майноры успешно отсортированы:", response.data);
      } else {
        console.error(
          "Не удалось отсортировать майноры. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Ошибка при сортировке майноров:", error);
    }
  };

  const getCategoryIdByName = (categoryName) => {
    return filters.categoryNameToId[categoryName] || 0;
  };

  return (
    <div className={classes.root}>
      <AppBarMain />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawer}>
          <Typography variant="subtitle1" className={classes.sidebarTitle}>
            <ListItemButton onClick={() => setOpenSort(!openSort)}>
              <ListItemText
                primary="Сортировать"
                slotProps={{
                  primary: {
                    fontWeight: "bold",
                  },
                }}
              />
              {openSort ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </Typography>
          <Collapse in={openSort} timeout="auto" unmountOnExit>
            <SortOptions
              filters={filters}
              checkedSortOptions={checkedSortOptions}
              handleSortToggle={handleSortToggle}
            />
          </Collapse>

          <Typography variant="subtitle1" className={classes.sidebarTitle}>
            <ListItemButton onClick={() => setOpenCategories(!openCategories)}>
              <ListItemText
                primary="Категории"
                slotProps={{
                  primary: {
                    fontWeight: "bold",
                  },
                }}
              />
              {openCategories ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </Typography>
          <Collapse in={openCategories} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {filters.categories.map((text, index) => (
                <ListItem
                  button
                  key={text}
                  sx={{ pl: 4 }}
                  onClick={handleCategoryToggle(index)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedCategories.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSortButtonClick}
          >
            Сортировать
          </Button>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <div className={classes.cardContainer}>
          {cards.map((card) => (
            <Card
              key={card.id}
              className={classes.card}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent>
                <img
                  src={card.image}
                  alt={card.title}
                  className={classes.cardImage}
                />
                <Typography variant="h6" component="h2">
                  {card.stars}
                </Typography>
                <Typography variant="h6" component="h2">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <DashboardPage />
    </ThemeProvider>
  );
}
export default App;
