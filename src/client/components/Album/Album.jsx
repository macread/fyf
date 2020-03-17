import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import UploadDialog from '../UploadDialog';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';
import _ from 'lodash';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        James 'Mac' Read
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Album() {
  const classes = useStyles();

  const [editTitle, setEditTitle] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [originalPictures, setOriginalPictures] = useState([]);
  const [search, setSearch] = useState();
  const [sortColumn, setSortColumn] = useState('title')

  useEffect(() => {
    axios.get('/getAllPictures').then((result) => {
      setPictures(result.data);
      setOriginalPictures(result.data);
    });
  }, []);

  const handleEditTitle = (pictureId) => {
    if (editTitle) {
      axios.put('/updateTitle',
        {
          pictureId,
          title: _.find(pictures, ['id', pictureId]).title
        }
      );
    }
    setEditTitle(!editTitle);
  }

  const handleSearchClick = () => {
    setPictures(_.filter(pictures, (picture) => {
      if (picture.title.indexOf(search) >= 0) {
        return picture;
      }
    }));
  }
  const handleClearSearch = () => {
    setSearch('');
    setPictures(originalPictures);
  }

  const handleSort = (e) => {
    setSortColumn(e.target.value);
    if (e.target.value === 'title') {
      setPictures(_.sortBy(pictures, ['title', 'uploaded']));
    } else {
      setPictures(_.sortBy(pictures, ['uploaded', 'title']));
    }
  }

  const handleTitleChange = (value, pictureId) => {
    const updatedPictures = _.map(pictures, (picture) => {
      if (picture.id === pictureId) {
        picture.title = value;
      };
      return picture;
    })
    setPictures(updatedPictures)
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Album layout
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <FormControl className={classes.formControl}>
            <TextField id="filled-search" label="Search" type="search" onChange={(e) => setSearch(e.target.value)} />
            <Button size="small" color="secondart" onClick={handleClearSearch}>
              Clear Search
            </Button>
            <Button size="small" color="primary" onClick={handleSearchClick}>
              Search
            </Button>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink id="sort-select-label">
              Sort By
            </InputLabel>
            <Select
              labelId='sort-select'
              id='sort-select'
              value={sortColumn}
              onChange={handleSort}
            >
              <MenuItem value={'title'}>Title</MenuItem>
              <MenuItem value={'uploaded'}>Uploaded Date</MenuItem>
            </Select>
          </FormControl>
          <UploadDialog />
          <Grid container spacing={4}>
            {pictures.map(picture => (
              <Grid item key={picture.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`data:image/jpeg;base64,${picture.base64pict}`}
                    title={picture.title}
                  />
                  <CardContent className={classes.cardContent}>
                    {editTitle ?
                      <TextField
                        id="title-field"
                        label="Title"
                        value={picture.title}
                        onChange={(e) => handleTitleChange(e.target.value, picture.id)}
                      />
                      :
                      <Typography gutterBottom variant="h5" component="h2">
                        {picture.title}
                      </Typography>
                    }

                    <Typography>
                      {picture.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" >
                      View
                    </Button>
                    <Button size="small" color="primary" onClick={() => handleEditTitle(picture.id)}>
                      {editTitle ? 'Save' : 'Edit'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}