import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Typography,
  Box,
  Rating,
  Grid,
  Container,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBarMain from "./AppBarMain";
import ReviewCard from "./ReviewCard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#94B4FF",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e",
    },
    gradient: {
      main: "#4563DD",
    },
    backColor: {
      main: "#EDF2FA",
    },
    buttonColor: {
      main: "#4563DD",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
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

const CardDetailPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/comparison_table?ids=${cardId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.length > 0) {
          setCard(data[0]);
        } else {
          console.warn("No card data found for ID:", cardId);
          setCard(null);
        }
      } catch (error) {
        console.error("Error fetching card details:", error);
      }
    };

    fetchCardDetails();
    fetchReviews();
  }, [cardId]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        minorId: cardId,
      });

      const response = await fetch(
        `http://localhost:8080/minor/review?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortByDate = async () => {
    handleClose();

    try {
      const params = new URLSearchParams({
        minorId: cardId,
      });
      const response = await fetch(
        `http://localhost:8080/minor/review/sortByDate?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error sorting reviews by date:", error);
    }
  };
  const handleAddReviewClick = () => {
    navigate("/profile");
  };
  const renderStarRating = (value, type) => {
    let color;

    switch (type) {
      case "difficultyRating":
        color = "royalblue";
        break;
      case "interestRating":
        color = "skyblue";
        break;
      case "timeConsumptionRating":
        color = "rebeccapurple";
        break;
      case "totalRating":
        color = "goldenrod";
        break;
      default:
        color = "#ffc107";
        break;
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Rating
          value={value === null ? 0 : value}
          readOnly
          precision={0.1}
          size="small"
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="medium" />}
          icon={<StarIcon style={{ color: color }} fontSize="medium" />}
        />
        <Typography component="span" ml={0.5}>
          {value === null ? "N/A" : value.toFixed(2)}
        </Typography>
      </Box>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBarMain />
        <Container sx={{ paddingTop: "64px" }}>
          {card ? (
            <Box
              sx={{
                bgcolor: "backColor.main",
                padding: 3,
                borderRadius: 2,
                mb: 3,
                mt: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  {card.link ? (
                    <img
                      src={card.link}
                      alt={card.title}
                      style={{
                        width: "100%",
                        borderRadius: 1,
                        height: "250px",
                        marginBottom: theme.spacing(1),
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="No Image Available"
                      style={{ width: "100%", height: "auto", borderRadius: 1 }}
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    color="gradient.main"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.75rem",
                      marginBottom: (theme) => theme.spacing(1),
                    }}
                  >
                    {card.title || ""}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      marginBottom: (theme) => theme.spacing(2),
                    }}
                  >
                    Категория: {card.categoryTitle || ""}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      {renderStarRating(
                        card.difficultyRating,
                        "difficultyRating"
                      )}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          marginLeft: (theme) => theme.spacing(2),
                          color: (theme) => theme.palette.text.secondary,
                        }}
                      >
                        Сложность
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      {renderStarRating(card.interestRating, "interestRating")}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          marginLeft: (theme) => theme.spacing(2),
                          color: (theme) => theme.palette.text.secondary,
                        }}
                      >
                        Интересность
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      {renderStarRating(
                        card.timeConsumptionRating,
                        "timeConsumptionRating"
                      )}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          marginLeft: (theme) => theme.spacing(2),
                          color: (theme) => theme.palette.text.secondary,
                        }}
                      >
                        Времязатратность
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      {renderStarRating(card.totalRating, "totalRating")}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          marginLeft: (theme) => theme.spacing(2),
                          color: (theme) => theme.palette.text.secondary,
                        }}
                      >
                        Общая
                      </Typography>
                    </Box>
                  </Box>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      onClick={handleAddReviewClick}
                      sx={{
                        marginBottom: theme.spacing(2),
                        backgroundImage: `linear-gradient(to right, ${theme.palette.buttonColor.main}, ${theme.palette.primary.main})`,
                      }}
                    >
                      Добавить отзыв
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography variant="body1">Loading card details...</Typography>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: (theme) => theme.spacing(2),
              marginTop: (theme) => theme.spacing(4),
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: (theme) => theme.palette.text.primary,
                marginRight: (theme) => theme.spacing(2),
              }}
            >
              Все отзывы
            </Typography>
            <Button
              aria-controls={open ? "sort-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              variant="contained"
              sx={{
                backgroundImage: `linear-gradient(to right, ${theme.palette.buttonColor.main}, ${theme.palette.primary.main})`,
              }}
            >
              Сортировать по:
            </Button>
            <Menu
              id="sort-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  fetchReviews();
                  handleClose();
                }}
              >
                По популярности
              </MenuItem>
              <MenuItem onClick={handleSortByDate}>По дате создания</MenuItem>
            </Menu>
          </Box>

          <Grid container spacing={2} justifyContent="flex-start">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Grid item key={review.id} xs={12} sm={6} md={4}>
                  <ReviewCard review={review} handleDeleteDialogOpen={null} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1">Отзывов пока нет.</Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CardDetailPage;
