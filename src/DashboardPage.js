import React from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, Card, CardContent, CardMedia } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
     zIndex: {
        drawer: 1200,
     },
     spacing: 4,
      drawer: {
         width: 240
     }
});

const useStyles = makeStyles((theme) => ({
     root: {
         display: 'flex',
     },
     appBar: {
         zIndex: theme.zIndex.drawer + 1,
     },
     title: {
         flexGrow: 1,
     },
     drawer: {
         width: theme.drawer.width,
         flexShrink: 0,
     },
     drawerPaper: {
         width: theme.drawer.width,
     },
     content: {
         flexGrow: 1,
         padding: theme.spacing(3),
     },
     cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: theme.spacing(5),
        marginTop: theme.spacing(2),
    },
     card: {
         display: 'flex',
         flexDirection: 'column',
         minHeight: '200px',
     },
     cardMedia: { 
        height: 150,
        objectFit: 'cover',
      },
     sidebarTitle: {
         padding: theme.spacing(2, 0, 1),
         fontWeight: "bold"
     },
 }));

const DashboardPage = () => {
    const classes = useStyles(); 

    const navLinks = [
        { text: 'Главная', to: '/' },
        { text: 'Оставить отзыв', to: '/review' },
        { text: 'Рейтинг', to: '/rating' },
        { text: 'Поиск', to: '/search' },
    ];

    const filters = {
        sort: [
            'Сложность',
            'Интересность',
            'Временязатратность',
            'Общий рейтинг'
        ],
        categories: [
            'Анализ данных',
            'Бизнес и менеджмент',
            'Естествознание, математика',
            'История и философия',
            'Культорология, регионоведение',
            'Медиа и коммуникации',
            'Филология и языкознание'
        ],
        dates: ['2024', '2023', '2022']
    }

    const cards = [
        { id: 1, title: 'Майнор 1', description: 'Описание майнора 1', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 2, title: 'Майнор 2', description: 'Описание майнора 2', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 3, title: 'Майнор 3', description: 'Описание майнора 3', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 4, title: 'Майнор 4', description: 'Описание майнора 4', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 5, title: 'Майнор 5', description: 'Описание майнора 5', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 6, title: 'Майнор 6', description: 'Описание майнора 6', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 7, title: 'Майнор 7', description: 'Описание майнора 7', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 8, title: 'Майнор 8', description: 'Описание майнора 8', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
        { id: 9, title: 'Майнор 9', description: 'Описание майнора 9', image: 'https://www.hse.ru/images/fb/hse_ru_thumb.jpg' },
    ];

    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Все майноры
                    </Typography>
                    {navLinks.map((link, index) => (
                        <Button color="inherit" key={index} href={link.to}>{link.text}</Button>
                    ))}
                    <Button color="inherit">👤</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                  paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <Typography variant="subtitle1" className={classes.sidebarTitle}>Сортировать</Typography>
                    <List>
                        {filters.sort.map((text, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="subtitle1" className={classes.sidebarTitle}>Категории</Typography>
                    <List>
                        {filters.categories.map((text, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="subtitle1" className={classes.sidebarTitle}>Дата отзыва</Typography>
                    <List>
                        {filters.dates.map((text, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                <div className={classes.cardContainer}>
                    {cards.map((card) => (
                        <Card key={card.id} className={classes.card}>
                            <CardContent>
                                <Typography variant="h6" component="h2">{card.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{card.description}</Typography>
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
    )
 }
export default App;