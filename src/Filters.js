import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  ListItemButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();
const useStyles = makeStyles(() => ({
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  drawerContainer: {
    overflow: "auto",
    padding: theme.spacing(2),
  },
  sidebarTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
}));
const filters = {
  sort: ["Сложность", "Интересность", "Временязатратность", "Общий рейтинг"],
  categories: [
    "Анализ данных",
    "Бизнес и менеджмент",
    "Естествознание, математика",
    "История и философия",
    "Культорология, регионоведение",
    "Медиа и коммуникации",
    "Филология и языкознание",
  ],
  dates: ["2024", "2023", "2022"],
};
function MyDrawer() {
  const classes = useStyles();
  const [openSort, setOpenSort] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openDates, setOpenDates] = useState(false);

  const [checkedCategories, setCheckedCategories] = useState([]);
  const [checkedDates, setCheckedDates] = useState([]);

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

  const handleDateToggle = (value) => () => {
    const currentIndex = checkedDates.indexOf(value);
    const newChecked = [...checkedDates];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedDates(newChecked);
    console.log("Selected Dates:", newChecked);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <Typography variant="subtitle1" className={classes.sidebarTitle}>
          <ListItemButton onClick={() => setOpenSort(!openSort)}>
            <ListItemText primary="Сортировать" />
            {openSort ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </Typography>
        <Collapse in={openSort} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {filters.sort.map((text, index) => (
              <ListItem button key={index} sx={{ pl: 4 }}>
                <ListItemText primary={text} />
                {/**/}
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Typography variant="subtitle1" className={classes.sidebarTitle}>
          <ListItemButton onClick={() => setOpenCategories(!openCategories)}>
            <ListItemText primary="Категории" />
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
                onClick={handleCategoryToggle(text)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedCategories.indexOf(text) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Collapse>

        <Typography variant="subtitle1" className={classes.sidebarTitle}>
          <ListItemButton onClick={() => setOpenDates(!openDates)}>
            <ListItemText primary="Дата отзыва" />
            {openDates ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </Typography>
        <Collapse in={openDates} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {filters.dates.map((text, index) => (
              <ListItem
                button
                key={text}
                sx={{ pl: 4 }}
                onClick={handleDateToggle(text)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedDates.indexOf(text) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </div>
    </Drawer>
  );
}

export default MyDrawer;
