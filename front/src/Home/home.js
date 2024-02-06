import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";
import { DropDown } from "../dropdown/dropdown";
import DropMenu from "../dropdown/dropdown";
import FormDialog from "../Dialog/dialog";
import ImageUploading from 'react-images-uploading';
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from '@mui/icons-material/Add';
import { App1 } from "../UploadFolder/upload";
import PlayListDialog from "../api/PlayListaDialog/PlayListaDialog";

const DrawerComponent = () => {
  const drawerWidth = 240;
  const [openFolders, setOpenFolders] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [ImeRoditelja, setImeRoditelja] = React.useState("");
  const [file,setFileName]= React.useState('');

  const ulogovaniKorisnik = localStorage.getItem("username");
  const [userChildren, setUserChildren] = useState([]);

  const createFolderHandler = async (imeDeteta) => {
    console.log(imeDeteta);
    // napraviFolder
    napraviFolder(ImeRoditelja, imeDeteta);
  };

  const openDialogHandler= ()=>
  {
    setOpen(!open);
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0].name);
    setFileName(event.target.files[0].name);
   // const files = event.target.files;
   // setSelectedFiles(files);
  };

  const uploadFileHandler = async () => {
    try {
      console.log('Ulogovani korisnik:', ulogovaniKorisnik);
      console.log('Ime roditelja:', ImeRoditelja);
      console.log('File:', file);
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', ulogovaniKorisnik);
      formData.append('folder', ImeRoditelja);
  
      console.log('FormData:', formData);
  
      const response = await axios.post(
        "http://127.0.0.1:5000/UploadSliku",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          mode:"no-cors"
        }
      );
  
      console.log("Server Response:", response.data);
  
      if (response.status === 201) {
        if (response.data.message === "Image uploaded successfully") {
          console.log("Uspesno dodat folder:", response.data.message);
        } else {
          console.log("Neuspesno dodat folder:", response.data.message);
          // Možete dodati dodatnu logiku za neuspeh, na primer, prikazivanje poruke korisniku
        }
      } else {
        console.log("Neuspešna prijava! Status kod nije 201.");
        // Možete dodati dodatnu logiku za neuspeh, na primer, prikazivanje poruke korisniku
      }
    } catch (error) {
      console.error("Greška prilikom dohvatanja podfoldera", error);
      // Možete dodati dodatnu logiku za grešku, na primer, prikazivanje poruke korisniku
    }};
  
  


  const pronadjiImeRoditelja = async (imeRoditelja) => {
    setImeRoditelja(imeRoditelja);
    console.log(imeRoditelja);
  };

  const napraviFolder = async (imeRoditelja, imeDeteta) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/NapraviFolder",
        {
          roditelj: imeRoditelja,
          naziv: imeDeteta,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Dodajte dodatne zaglavlja ovde ako je potrebno
            // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          },
        }
      );

      if (response.status === 201) {
        if (response.data.message === "SUCCESS") {
          console.log("Uspesno dodat folder:", response.data.message);

          // navigate("/");
        } else {
          console.log(
            "Neuspesno dodat folder! Status kod 201, ali prijava neuspešna."
          );
          window.confirm("Neuspešna prijava!");
        }
      } else {
        console.log("Neuspešna prijava! Status kod nije 200.");
        window.confirm("Neuspešna prijava!");
      }
    } catch (error) {
      console.error("Greška prilikom dohvatanja podfoldera", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const procitajMojuDecu = async (folder) => {
    console.log(folder);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/ProcitajDecuFolder",
        {
          naziv: folder,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Dodajte dodatne zaglavlja ovde ako je potrebno
            // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;
      return data.subfolders;
    } catch (error) {
      console.error("Greška prilikom dohvatanja podfoldera", error);
    }
  };

  const handleTrashClick = async (folder) => {
    if (openFolders.includes(folder)) {
      setOpenFolders(openFolders.filter((openFolder) => openFolder !== folder));
    } else {
      setOpenFolders([...openFolders, folder]);

      console.log("openFolders:", openFolders);
      console.log("userChildren:", userChildren);

      // Pozivamo procitajMojuDecu i postavljamo podfoldere
      await procitajMojuDecu(folder);
    }
  };

  const renderSubfolders = (subfolders) => {
    return (
      <List>
        {subfolders.map((subfolder) => (
          <ListItem key={subfolder.naziv} disablePadding>
            <ListItemButton onClick={() => handleTrashClick(subfolder.naziv)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={subfolder.naziv} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
      {["Playliste"].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={() => handleTrashClick(text)}>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={text} />
              <AddIcon   onClick={openDialogHandler}/> {/* Dodaj ovde željenu ikonicu */}
              
          </ListItemButton>
        </ListItem>
      ))}
    </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <DropMenu
              procitajMojuDecu={procitajMojuDecu}
              nazivFoldera={ulogovaniKorisnik}
              pronadjiImeRoditelja={pronadjiImeRoditelja}
            />
            {/* <ListItemButton onClick={() => handleTrashClick(ulogovaniKorisnik)}>
          <DropMenu procitajMojuDecu={procitajMojuDecu}   nazivFoldera={ulogovaniKorisnik} />
    <ListItemIcon>
      <FolderIcon />
    </ListItemIcon>
    <ListItemText primary={ulogovaniKorisnik} />
    {openFolders.includes(ulogovaniKorisnik) && (
      <>
        {console.log("Open folder:", ulogovaniKorisnik)}
        {userChildren.length === 0 ? (
          <p>No subfolders found.</p>
        ) : (
          <List>
            {userChildren.map((subfolder) => (
              <ListItem key={subfolder.naziv} disablePadding>
                <ListItemButton
                  onClick={() => handleTrashClick(subfolder.naziv)}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary={subfolder.naziv} />
                  {openFolders.includes(subfolder.naziv) &&
                    renderSubfolders(subfolder.podfoldere)}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </>
    )}
  </ListItemButton> */}
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <div>
          <Button variant="contained" onClick={uploadFileHandler}>
            Upload File{" "}
          </Button>

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
           
            multiple // Ako želite podršku za više fajlova
          />
          <FormDialog createFolderHandler={createFolderHandler}> </FormDialog>
          {open && <PlayListDialog> </PlayListDialog>}
          
        </div>
      </Box>
    </Box>
  );
};

export default DrawerComponent;
