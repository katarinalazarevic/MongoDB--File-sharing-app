import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function PlayListDialog ({createFolderHandler, }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="contained" onClick={handleClickOpen}>
       Kreiraj playlistu 
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.text;
            console.log(formJson);

            createFolderHandler(formJson.text);
            
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Kreiranje playliste</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unesite naziv playliste koju biste zeleli da dodate
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="text"
            label="Naziv playliste"
            type="text"
           // onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Exit</Button>
          <Button type="submit">Dodaj</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
