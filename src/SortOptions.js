import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Radio, // Radio!
  ListItemButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  // Ваши стили
}));

const SortOptions = ({ filters, checkedSortOptions, handleSortToggle }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography
        variant="subtitle1"
        className={classes.sidebarTitle}
      ></Typography>
      <List component="div" disablePadding>
        {filters.sort.map((text, index) => (
          <ListItem
            button
            key={index}
            sx={{ pl: 4 }}
            onClick={handleSortToggle(index)} // Передаем index в handleSortToggle
          >
            <ListItemIcon>
              <Radio // Radio!
                edge="start"
                checked={checkedSortOptions === index} // Сравниваем с checkedSortOptions
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SortOptions;
