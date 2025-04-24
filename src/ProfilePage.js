// ProfilePage.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  Avatar,
  Divider,
  Grid,
  AppBar,
  Toolbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
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
];

const ProfilePage = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null); // User data from API
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    login: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({
    minorTitle: "",
    email: "",
    body: "",
    difficultyMark: 0,
    interestMark: 0,
    timeConsumptionMark: 0,
    totalMark: 0,
  });

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  const handleDeleteDialogOpen = (id) => {
    setReviewToDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setReviewToDeleteId(null);
  };

  const handleInputChange = (event) => {
    setNewReview({ ...newReview, [event.target.name]: event.target.value });
  };

  const handleCreateReview = async () => {
    try {
      const response = await fetch("http://localhost:8080/minor/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error(`Create review failed: ${response.status}`);
      }

      const createdReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, createdReview]);
      handleCreateDialogClose();
      setNewReview({
        minorTitle: "",
        email: "",
        body: "",
        difficultyMark: 0,
        interestMark: 0,
        timeConsumptionMark: 0,
        totalMark: 0,
      });
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const storedEmail = localStorage.getItem("userEmail");
      const response = await fetch("http://localhost:8080/minor/review", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: reviewToDeleteId, email: storedEmail }),
      });

      if (!response.ok) {
        throw new Error(`Delete review failed: ${response.status}`);
      }

      const success = await response.json();
      if (success) {
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewToDeleteId)
        );
      }
      handleDeleteDialogClose();
      setReviewToDeleteId(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Fetch user data and reviews on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchUserData(storedEmail);
    } else {
      // Redirect to login using React Router's navigate function
      navigate("/login");
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const userResponse = await fetch(
        `http://localhost:8080/user?email=${email}`
      );
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user: ${userResponse.status}`);
      }
      const userData = await userResponse.json();
      setUser(userData);

      const reviewsResponse = await fetch(
        `http://localhost:8080/user/reviews?email=${email}`
      );
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.status}`);
      }
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setPasswordData({
      login: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handlePasswordInputChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/auth/update_password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        throw new Error(`Update password failed: ${response.status}`);
      }

      // Handle successful password update (e.g., show a success message)
      console.log("Password updated successfully!");
      handlePasswordDialogClose();
    } catch (error) {
      console.error("Error updating password:", error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleEditProfileDialogOpen = () => {
    // Initialize editProfileData with current user data
    setEditProfileData({
      name: user?.name || "",
      minorTitle: user?.minorTitle || "",
      email: user?.email || "",
      courseTitle: user?.courseTitle || "",
    });
    setOpenEditProfileDialog(true);
  };

  const handleEditProfileDialogClose = () => {
    setOpenEditProfileDialog(false);
  };

  const handleEditProfileInputChange = (event) => {
    setEditProfileData({
      ...editProfileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email, // Use current user email
          patch: editProfileData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Update profile failed: ${response.status}`);
      }

      // Update user data in state
      setUser({ ...user, ...editProfileData }); // Optimistically update
      handleEditProfileDialogClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBarMain />
        <Container sx={{ paddingTop: "64px" }}>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 70, height: 70, bgcolor: "primary.main", mr: 2 }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                {user ? (
                  <>
                    <Typography variant="h5">{user.name}</Typography>
                    <Typography variant="subtitle2">{user.email}</Typography>
                    <Typography variant="body2">
                      {user.minorTitle}, {user.courseTitle}
                    </Typography>
                  </>
                ) : (
                  <Typography>Загрузка...</Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleEditProfileDialogOpen}
                  sx={{ mr: 1 }}
                >
                  Редактировать профиль
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handlePasswordDialogOpen}
                >
                  Изменить пароль
                </Button>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Мои отзывы
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={handleCreateDialogOpen}
                >
                  Добавить
                </Button>
              </Box>

              <Grid container spacing={2}>
                {reviews.map((review) => (
                  <Grid item xs={12} sm={6} md={4} key={review.id}>
                    <Box
                      sx={{
                        bgcolor: "#e1f5fe",
                        borderRadius: 2,
                        padding: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="subtitle1">{review.body}</Typography>{" "}
                      {/* Changed review.comment to review.body */}
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption">
                        {review.createDate} <br />{" "}
                        {/* Changed review.date to review.createDate */}
                        {review.minorTitle}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDeleteDialogOpen(review.id)}
                      >
                        Удалить
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Password Update Dialog */}
      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
        <DialogTitle>Изменить пароль</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="login"
            name="login"
            label="Логин"
            type="text"
            fullWidth
            variant="standard"
            value={passwordData.login}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            id="currentPassword"
            name="currentPassword"
            label="Текущий пароль"
            type="password"
            fullWidth
            variant="standard"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            id="newPassword"
            name="newPassword"
            label="Новый пароль"
            type="password"
            fullWidth
            variant="standard"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            id="confirmNewPassword"
            name="confirmNewPassword"
            label="Подтвердите новый пароль"
            type="password"
            fullWidth
            variant="standard"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Отмена</Button>
          <Button onClick={handleUpdatePassword}>Обновить</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEditProfileDialog}
        onClose={handleEditProfileDialogClose}
      >
        <DialogTitle>Редактировать профиль</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Имя"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.name}
            onChange={handleEditProfileInputChange}
          />
          <TextField
            margin="dense"
            id="minorTitle"
            name="minorTitle"
            label="Майнор"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.minorTitle}
            onChange={handleEditProfileInputChange}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={editProfileData.email}
            onChange={handleEditProfileInputChange}
          />
          <TextField
            margin="dense"
            id="courseTitle"
            name="courseTitle"
            label="Курс"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.courseTitle}
            onChange={handleEditProfileInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditProfileDialogClose}>Отмена</Button>
          <Button onClick={handleUpdateProfile}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreateDialog} onClose={handleCreateDialogClose}>
        <DialogTitle>Создать отзыв</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Заполните форму, чтобы создать новый отзыв.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="minorTitle"
            name="minorTitle"
            label="Название майнора"
            type="text"
            fullWidth
            variant="standard"
            value={newReview.minorTitle}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={newReview.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="body"
            name="body"
            label="Отзыв"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={newReview.body}
            onChange={handleInputChange}
          />
          {/* Add difficultyMark, interestMark, timeConsumptionMark, totalMark inputs if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Отмена</Button>
          <Button onClick={handleCreateReview}>Создать</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Удалить отзыв?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить этот отзыв?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Отмена</Button>
          <Button onClick={handleDeleteReview} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ProfilePage;
