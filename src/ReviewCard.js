import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import config from "./config";
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
const ReviewCard = ({ review, handleDeleteDialogOpen }) => {
  const lineHeight = 1.5;
  const rows = 5;
  const minHeight = `calc(${rows} * ${lineHeight}em)`;
  const minorTitleRows = 2;
  const minorTitleMaxHeight = `calc(${minorTitleRows} * ${lineHeight}em)`;
  const markOptions = [1, 2, 3, 4, 5];
  const overflow = "hidden";
  const textOverflow = "ellipsis";
  const wordWrap = "break-word";
  const [likesCount, setLikesCount] = useState(review?.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(
    review?.dislikesCount || 0
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [liked, setLiked] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState("");
  const [editedReview, setEditedReview] = useState({
    body: review?.body || "",
    difficultyMark: review?.difficultyMark || 0,
    interestMark: review?.interestMark || 0,
    timeConsumptionMark: review?.timeConsumptionMark || 0,
    totalMark: review?.totalMark || 0,
  });
  const handleMarkEditChange = (event) => {
    const { name, value } = event.target;
    setEditedReview({
      ...editedReview,
      [name]: parseInt(value, 10),
    });
  };
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputEditChange = (event) => {
    const { name, value } = event.target;
    setEditedReview({ ...editedReview, [name]: value });
  };
  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };
  const handleSaveEdit = async () => {
    try {
      const patchData = {
        body: editedReview.body,
        difficultyMark: parseInt(editedReview.difficultyMark, 10),
        interestMark: parseInt(editedReview.interestMark, 10),
        timeConsumptionMark: parseInt(editedReview.timeConsumptionMark, 10),
        totalMark: parseInt(editedReview.totalMark, 10),
      };

      const requestBody = {
        reviewId: review.id,
        email: localStorage.getItem("userEmail"),
        patch: patchData,
      };

      const response = await fetch(`${config.apiUrl}/minor/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Review updated successfully");
        handleCloseEditDialog();
      } else {
        console.error("Failed to update review:", response.status);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/minor/review/comment?reviewId=${review.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
    }
  };
  useEffect(() => {
    setLikesCount(review.likesCount);
    setDislikesCount(review.dislikesCount);
    if (openReviewDialog && review.id) {
      fetchComments();
    }
    const fetchInitialLikeStatus = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await fetch(
          `${config.apiUrl}/minor/review/like?reviewId=${review.id}`
        );
        if (response.ok) {
          const data = await response.json();
          const userLike = data.find((item) => item.email === email);
          if (userLike) {
            setLiked(userLike.value);
          } else {
            setLiked(null);
          }
        } else {
          console.error(
            "Failed to fetch initial like status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching initial like status:", error);
      }
    };
    fetchInitialLikeStatus();
  }, [openReviewDialog, review.id, review.id]);

  const handleLike = async (value) => {
    const email = localStorage.getItem("userEmail");
    try {
      const response = await fetch(
        `${config.apiUrl}/minor/review/like?reviewId=${review.id}`
      );
      if (!response.ok) {
        console.error("Failed to fetch like status:", response.status);
        return;
      }
      const data = await response.json();
      const userLike = data.find((item) => item.email === email);
      if (userLike) {
        if (userLike.value === value) {
          await handleDeleteLike(value, userLike.id);
        } else {
          await handleDeleteLike(userLike.value, userLike.id);
          await handleAddLike(value);
        }
      } else {
        await handleAddLike(value);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddLike = async (value) => {
    const email = localStorage.getItem("userEmail");
    try {
      const requestBody = {
        reviewId: review.id,
        email: email,
        value: value,
      };
      const response = await fetch(`${config.apiUrl}/minor/review/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        if (value) {
          setLikesCount(likesCount + 1);
          setDislikesCount(
            Math.max(0, dislikesCount - (liked === false ? 1 : 0))
          );
        } else {
          setDislikesCount(dislikesCount + 1);
          setLikesCount(Math.max(0, likesCount - (liked === true ? 1 : 0)));
        }
        setLiked(value);
      } else {
        console.error(
          `Failed to ${value ? "like" : "dislike"} review:`,
          response.status
        );
      }
    } catch (error) {
      console.error(`Error ${value ? "liking" : "disliking"} review:`, error);
    }
  };

  const handleDeleteLike = async (value, likeId) => {
    try {
      const requestBody = {
        id: likeId,
        email: localStorage.getItem("userEmail"),
      };

      const response = await fetch(`${config.apiUrl}/minor/review/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        if (value) {
          setLikesCount(Math.max(0, likesCount - 1));
        } else {
          setDislikesCount(Math.max(0, dislikesCount - 1));
        }
        setLiked(null);
      } else {
        console.error(
          `Failed to delete ${value ? "like" : "dislike"} review:`,
          response.status
        );
      }
    } catch (error) {
      console.error(`Error`, error);
    }
  };
  const handleAddComment = async () => {
    const email = localStorage.getItem("userEmail");
    if (newCommentBody.trim() === "") return;

    try {
      const requestBody = {
        reviewId: review.id,
        email: email,
        body: newCommentBody,
        parentId: 0,
      };

      const response = await fetch(`${config.apiUrl}/minor/review/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setNewCommentBody("");
      } else {
        console.error("Failed to add comment:", response.status);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const email = localStorage.getItem("userEmail");

    try {
      const requestBody = {
        id: commentId,
        email: email,
      };

      const response = await fetch(`${config.apiUrl}/minor/review/comment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error("Failed to delete comment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleStartEditComment = (commentId, body) => {
    setEditingCommentId(commentId);
    setEditingCommentBody(body);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentBody("");
  };

  const handleEditComment = async (commentId) => {
    const email = localStorage.getItem("userEmail");
    if (editingCommentBody.trim() === "") return;

    try {
      const requestBody = {
        id: commentId,
        email: email,
        body: editingCommentBody,
      };

      const response = await fetch(`${config.apiUrl}/minor/review/comment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(
          comments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
          )
        );
        setEditingCommentId(null);
        setEditingCommentBody("");
      } else {
        console.error("Failed to edit comment:", response.status);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          borderRadius: 2,
          padding: 2,
          boxShadow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxSizing: "border-box",
          cursor: "pointer",
        }}
        onClick={handleOpenReviewDialog}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0}
        >
          <Typography
            variant="h6"
            color="gradient.main"
            sx={{
              overflow: overflow,
              textOverflow: textOverflow,
              whiteSpace: "nowrap",
              flexGrow: 1,
              pr: 1,
            }}
          >
            {review.userName}
          </Typography>
          {handleDeleteDialogOpen && (
            <Box sx={{ flexShrink: 0, display: "flex" }}>
              <IconButton
                aria-label="edit"
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenEditDialog();
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteDialogOpen(review.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            minHeight: minorTitleMaxHeight,
            maxHeight: minorTitleMaxHeight,
            overflow: overflow,
            textOverflow: textOverflow,
            wordWrap: wordWrap,
            margin: 0,
          }}
        >
          {review.minorTitle}
        </Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <StarIcon sx={{ color: "royalblue" }} />
          <Typography variant="body2">{review.difficultyMark}</Typography>
          <StarIcon sx={{ color: "skyblue" }} />
          <Typography variant="body2">{review.interestMark}</Typography>
          <StarIcon sx={{ color: "rebeccapurple" }} />
          <Typography variant="body2">{review.timeConsumptionMark}</Typography>
          <StarIcon sx={{ color: "goldenrod" }} />
          <Typography variant="body2">{review.totalMark}</Typography>
        </Box>

        <Typography
          variant="body1"
          mt={1}
          sx={{
            minHeight: minHeight,
            maxHeight: minHeight,
            overflow: overflow,
            textOverflow: textOverflow,
            wordWrap: wordWrap,
            lineHeight: lineHeight,
            margin: 0,
          }}
        >
          {review.body}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption">{review.createDate}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleLike(true);
                }}
                color={liked === true ? "primary" : "default"}
              >
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body2">{likesCount}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleLike(false);
                }}
                color={liked === false ? "primary" : "default"}
              >
                <ThumbDownIcon />
              </IconButton>
              <Typography variant="body2">{dislikesCount}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <ChatBubbleOutlineIcon />
              <Typography variant="body2">{review.commentsCount}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Редактировать отзыв</DialogTitle>
        <DialogContent>
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
            value={review.minorTitle}
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
            value={editedReview.body}
            onChange={handleInputEditChange}
          />
          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel id="difficultyMark-label">Сложность</InputLabel>
            <Select
              labelId="difficultyMark-label"
              id="difficultyMark"
              name="difficultyMark"
              value={editedReview.difficultyMark}
              onChange={handleMarkEditChange}
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
            <InputLabel id="interestMark-label">Интересность</InputLabel>
            <Select
              labelId="interestMark-label"
              id="interestMark"
              name="interestMark"
              value={editedReview.interestMark}
              onChange={handleMarkEditChange}
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
              Времязатратность
            </InputLabel>
            <Select
              labelId="timeConsumptionMark-label"
              id="timeConsumptionMark"
              name="timeConsumptionMark"
              value={editedReview.timeConsumptionMark}
              onChange={handleMarkEditChange}
              label="Времязатратность"
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
              value={editedReview.totalMark}
              onChange={handleMarkEditChange}
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
          <Button onClick={handleCloseEditDialog}>Отменить</Button>
          <Button onClick={handleSaveEdit}>Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Отзыв</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={0}
            >
              <Typography
                variant="h6"
                color="gradient.main"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {review.userName}
              </Typography>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "medium",
                color: "text.secondary",
              }}
            >
              {review.minorTitle}
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
              <StarIcon sx={{ color: "royalblue" }} />
              <Typography variant="body2">{review.difficultyMark}</Typography>
              <StarIcon sx={{ color: "skyblue" }} />
              <Typography variant="body2">{review.interestMark}</Typography>
              <StarIcon sx={{ color: "rebeccapurple" }} />
              <Typography variant="body2">
                {review.timeConsumptionMark}
              </Typography>
              <StarIcon sx={{ color: "goldenrod" }} />
              <Typography variant="body2">{review.totalMark}</Typography>
            </Box>

            <Typography variant="body1" mt={1} wordBreak="break-word">
              {review.body}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="caption">{review.createDate}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => handleLike(true)}
                    color={liked === true ? "primary" : "default"}
                  >
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2">{likesCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => handleLike(false)}
                    color={liked === false ? "primary" : "default"}
                  >
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2">{dislikesCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <ChatBubbleOutlineIcon />
                  <Typography variant="body2">
                    {review.commentsCount}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Typography variant="h6">Комментарии</Typography>
            <List>
              {comments.map((comment) => (
                <ListItem key={comment.id}>
                  {editingCommentId === comment.id ? (
                    <TextField
                      fullWidth
                      value={editingCommentBody}
                      onChange={(e) => setEditingCommentBody(e.target.value)}
                      onBlur={handleCancelEditComment}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditComment(comment.id);
                        }
                      }}
                    />
                  ) : (
                    <ListItemText
                      wordBreak="break-word"
                      primary={comment.userName}
                      secondary={comment.body}
                    />
                  )}
                  <ListItemSecondaryAction>
                    {editingCommentId === comment.id ? (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="save"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="cancel"
                          onClick={handleCancelEditComment}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() =>
                          handleStartEditComment(comment.id, comment.body)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <TextField
              label="Новый комментарий"
              fullWidth
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
            />
            <Button onClick={handleAddComment}>Отправить</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ReviewCard;
