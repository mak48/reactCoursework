import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Radio,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({}));

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
            onClick={handleSortToggle(index)}
          >
            <ListItemIcon>
              <Radio
                edge="start"
                checked={checkedSortOptions === index}
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
