import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Button,
  Avatar,
  Divider,
  Grid,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router";
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
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
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
  const [user, setUser] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [minors, setMinors] = useState([]);
  const [minor, setMinor] = useState([]);
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
    email: localStorage.getItem("userEmail"),
    body: "",
    difficultyMark: 0,
    interestMark: 0,
    timeConsumptionMark: 0,
    totalMark: 0,
  });
  const markOptions = [1, 2, 3, 4, 5];

  const handleCreateDialogOpen = () => {
    setNewReview((prevReview) => ({
      ...prevReview,
      minorTitle: user?.minorTitle || "",
    }));
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
  const handleMarkChange = (event) => {
    setNewReview({
      ...newReview,
      [event.target.name]: parseInt(event.target.value, 10),
    });
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
        minorTitle: user.minorTitle,
        email: localStorage.getItem("userEmail"),
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

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchUserData(storedEmail);
    } else {
      navigate("/login");
    }
    const fetchMinors = async () => {
      try {
        const response = await fetch("http://localhost:8080/minors");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const titles = data.map((minor) => minor.title);
        setMinors(titles);
      } catch (error) {
        console.error("Ошибка при получении списка майноров:", error);
      }
    };

    fetchMinors();
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
  const handleExit = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
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
      passwordData.login = localStorage.getItem("userEmail");
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
      if (response.ok) {
        handlePasswordDialogClose();
      } else {
        const errorPassword = await response.text();
        setErrorPassword(errorPassword || "Не удалось сменить пароль");
      }
    } catch (error) {
      setErrorPassword("Не удалось сменить пароль");
      console.error("Error updating password:", error);
    }
  };

  const handleEditProfileDialogOpen = () => {
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
  const handleMinorChange = (event) => {
    setEditProfileData({
      ...editProfileData,
      minorTitle: event.target.value,
    });
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
          email: user.email,
          patch: editProfileData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Update profile failed: ${response.status}`);
      }
      setUser({ ...user, ...editProfileData });
      handleEditProfileDialogClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBarMain />
        <Container sx={{ paddingTop: theme.spacing(8) }}>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 140, height: 140, bgcolor: "primary.main", mr: 2 }}
              >
                <PersonIcon sx={{ fontSize: 100 }} />
              </Avatar>
              <Box>
                {user ? (
                  <>
                    <Typography
                      variant="h4"
                      color="gradient"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="subtitle2">
                      Образовательная программа: {user.courseTitle}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Майнор: {user.minorTitle}
                    </Typography>
                  </>
                ) : (
                  <Typography>Загрузка...</Typography>
                )}
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleEditProfileDialogOpen}
                  sx={{
                    backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
                    mr: 2,
                  }}
                >
                  Редактировать профиль
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handlePasswordDialogOpen}
                  sx={{
                    backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
                    mr: 2,
                  }}
                >
                  Изменить пароль
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleExit}
                  sx={{
                    backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
                  }}
                >
                  Выйти из аккаунта
                </Button>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" color="gradient" sx={{ mb: 1 }}>
                Мои отзывы
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundImage: `linear-gradient(to right, ${theme.palette.gradient.main}, ${theme.palette.primary.main})`,
                    mr: 1,
                  }}
                  onClick={handleCreateDialogOpen}
                >
                  Добавить
                </Button>
              </Box>

              <Grid container spacing={2}>
                {reviews.map((review) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={review.id}
                    sx={{ height: "100%" }}
                  >
                    <ReviewCard
                      review={review}
                      handleDeleteDialogOpen={handleDeleteDialogOpen}
                    />
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
          {errorPassword && (
            <Typography variant="body2" color="error">
              {errorPassword}
            </Typography>
          )}
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
            id="courseTitle"
            name="courseTitle"
            label="Образовательная программа"
            type="text"
            fullWidth
            variant="standard"
            value={editProfileData.courseTitle}
            onChange={handleEditProfileInputChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="minor-label">Майнор</InputLabel>
            <Select
              labelId="minor-label"
              fullWidth
              id="minorTitle"
              value={editProfileData.minorTitle}
              onChange={handleMinorChange}
              label="Майнор"
              MenuProps={{
                MenuListProps: {
                  style: {
                    maxheight: "200px",
                    overflowy: "scroll",
                  },
                },
              }}
            >
              {minors.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            readOnly={true}
            onKeyDown={(e) => e.preventDefault()}
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
            id="body"
            name="body"
            label="Отзыв"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="standard"
            value={newReview.body}
            onChange={handleInputChange}
          />
          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="difficultyMark-label">Сложность</InputLabel>
            <Select
              labelId="difficultyMark-label"
              id="difficultyMark"
              name="difficultyMark"
              value={newReview.difficultyMark}
              onChange={handleMarkChange}
              label="Сложность"
            >
              {markOptions.map((mark) => (
                <MenuItem key={mark} value={mark}>
                  {mark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="interestMark-label">Интерес</InputLabel>
            <Select
              labelId="interestMark-label"
              id="interestMark"
              name="interestMark"
              value={newReview.interestMark}
              onChange={handleMarkChange}
              label="Интерес"
            >
              {markOptions.map((mark) => (
                <MenuItem key={mark} value={mark}>
                  {mark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="timeConsumptionMark-label">
              Затраты по времени
            </InputLabel>
            <Select
              labelId="timeConsumptionMark-label"
              id="timeConsumptionMark"
              name="timeConsumptionMark"
              value={newReview.timeConsumptionMark}
              onChange={handleMarkChange}
              label="Затраты по времени"
            >
              {markOptions.map((mark) => (
                <MenuItem key={mark} value={mark}>
                  {mark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="totalMark-label">Общая оценка</InputLabel>
            <Select
              labelId="totalMark-label"
              id="totalMark"
              name="totalMark"
              value={newReview.totalMark}
              onChange={handleMarkChange}
              label="Общая оценка"
            >
              {markOptions.map((mark) => (
                <MenuItem key={mark} value={mark}>
                  {mark}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
