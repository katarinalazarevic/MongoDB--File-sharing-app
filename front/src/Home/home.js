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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FolderIcon from "@mui/icons-material/Folder";
import axios from "axios";
import { DropDown } from "../dropdown/dropdown";
import DropMenu from '../dropdown/dropdown';


const DrawerComponent = () => {
  const drawerWidth = 240;
  const [openFolders, setOpenFolders] = useState([]);

  const ulogovaniKorisnik = localStorage.getItem("username");
  const [userChildren, setUserChildren] = useState([]);

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
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => handleTrashClick(text)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          
        </List>
        <Divider />
        <List>
        <ListItem disablePadding>
        <DropMenu procitajMojuDecu={procitajMojuDecu}   nazivFoldera={ulogovaniKorisnik} />
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
      </Box>
    </Box>
  );
};

export default DrawerComponent;
