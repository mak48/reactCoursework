import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Rating,
  Grid,
  Container,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBarMain from "./AppBarMain";

const theme = createTheme({
  palette: {
    primary: {
      main: "#29b6f6",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const navLinks = [
  { text: "Главная", to: "/" },
  { text: "Оставить отзыв", to: "/review" },
  { text: "Рейтинг", to: "/rating" },
  { text: "Поиск", to: "/search" },
  { text: "Профиль", to: "/profile" },
];

const CardDetailPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [reviews, setReviews] = useState([]);

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

    fetchCardDetails();
    fetchReviews();
  }, [cardId]);

  const renderStarRating = (value) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Rating
          value={value === null ? 0 : value}
          readOnly
          precision={0.1}
          size="small"
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography component="span" ml={0.5}>
          {value === null ? "N/A" : value}
        </Typography>
      </Box>
    );
  };

  const ReviewCard = ({ review }) => {
    return (
      <Box
        sx={{
          bgcolor: "#e1f5fe",
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          width: "100%",
          maxWidth: 350,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="subtitle1">{review.userName}</Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {review.body}
        </Typography>
        <Typography variant="caption">
          Создано: {review.createDate} <br />
        </Typography>
        <Typography variant="subtitle2">
          Общая оценка: {review.totalMark}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <ThumbUpAltIcon sx={{ mr: 0.5 }} />
          <Typography variant="body2">{review.likesCount}</Typography>
          <ThumbDownAltIcon sx={{ ml: 1, mr: 0.5 }} />
          <Typography variant="body2">{review.dislikesCount}</Typography>
          <ChatBubbleOutlineIcon sx={{ ml: 1, mr: 0.5 }} />
          <Typography variant="body2">{review.commentsCount}</Typography>
        </Box>
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
                bgcolor: "#e1f5fe",
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
                      style={{ width: "100%", height: "auto", borderRadius: 1 }}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="No Image Available"
                      style={{ width: "100%", height: "auto", borderRadius: 1 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="subtitle1">Оценки</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {renderStarRating(card.difficultyRating)}
                    {renderStarRating(card.interestRating)}
                    {renderStarRating(card.timeConsumptionRating)}
                    {renderStarRating(card.totalRating)}
                  </Box>
                  <Box mt={2}>
                    <Button variant="contained">Сравнить</Button>
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
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Сортировать по:</Typography>
          </Box>

          <Grid container spacing={2} justifyContent="flex-start">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Grid item key={review.id} xs={12} sm={6} md={4}>
                  <ReviewCard review={review} />
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
