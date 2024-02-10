import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CreateIcon from "@mui/icons-material/Create";

export default function FolderDialog({ playlistNameprop, updateNameHandler }) {
  const [open, setOpen] = React.useState(false);
  const [playlistName, setPlaylistName] = React.useState("");
  const ulogovaniKorisnik = localStorage.getItem("username");

  const handleClickOpen = () => {
    setOpen(true);
    console.log(playlistNameprop);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <React.Fragment>
      <CreateIcon onClick={handleClickOpen}>Kreiraj playlistu</CreateIcon>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            const novoIme = formJson.text;

            console.log(formJson);
            //handleUpdatePlayListName(ulogovaniKorisnik,novoIme,playlistNameprop);
            //  createFolderHandler(formJson.text);
            updateNameHandler(formJson.text);

            console.log("pozivam createPlkatlist handler ");
            //  createPlaylistHandler(formJson.text);
            handleClose();
          },
        }}
      >
        <DialogTitle>Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unesite novo ime foldera koji biste zeleli da promenite
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="text"
            label="Novo ime foldera"
            type="text"
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Izadji</Button>
          <Button type="submit">Promeni</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
