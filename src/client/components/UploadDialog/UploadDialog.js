import React, { useState } from 'react';

import { DropzoneArea } from 'material-ui-dropzone';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from 'axios';

export default function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [pictureDescription, setPictureDescription] = useState();
  const [pictureTitle, setPictureTitle] = useState();
  const [picture, setPicture] = useState();
  const [disableShowButton, setDisableSaveButton] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePictureDescription = (e) => {
    setPictureDescription(e.target.value);
  }
  const handlePictureTitle = (e) => {
    setPictureTitle(e.target.value);
  }

  const handleDrop = (picture) => {
    setPicture(picture);
    setDisableSaveButton(false);
  }

  const loadPicture = () => {
    picture.forEach(pict => {
      const reader = new FileReader();
      reader.onload = () => {
        const picture = new Uint8Array(reader.result);
        axios.post("/addPicture", {
          uploadDate: new Date(),
          title: pictureTitle,
          description: pictureDescription,
          picture: picture,
        }).then((result) => {
          if (result.ok) {
            handleClose();
          }
        });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      try {
        reader.readAsArrayBuffer(pict);
      } catch (err) {
        console.log(err);
      }
    });
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Upload Picture
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Upload Picture</DialogTitle>
        <DialogContent>

          <DropzoneArea
            acceptedFiles={['image/jpg',
              'image/jpeg',
              'image/png',
              'image/tif',
              'image/tiff',
              'image/gif',
              'image/bmp']}
            dropzoneText='Drop your picture here'
            filesLimit={1}
            onChange={(droppedFiles) => handleDrop(droppedFiles)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Picture Title"
            type="text"
            fullWidth
            onChange={handlePictureTitle}
            value={pictureTitle}
          />
          <TextField
            margin="dense"
            id="name"
            label="Picture Description"
            multiline={true}
            rows='5'
            type="text"
            fullWidth
            onChange={handlePictureDescription}
            value={pictureDescription}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={loadPicture} color="primary" disabled={disableShowButton} >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}