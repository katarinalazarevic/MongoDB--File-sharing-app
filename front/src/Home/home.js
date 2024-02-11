import React, { useEffect, useState } from "react";
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
import ImageUploading from "react-images-uploading";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { App1 } from "../UploadFolder/upload";
import PlayListDialog from "../PlayListaDialog/PlayListaDialog";
import DropDownPlaylist from "../dropdownPlaylist/dropdownplaylist";
import YouTube from "react-youtube";
import "./home.css";
<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
</style>;

const DrawerComponent = () => {
  const drawerWidth = 350;
  const [openFolders, setOpenFolders] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [ImeRoditelja, setImeRoditelja] = React.useState("");
  const [file, setFileName] = React.useState({ name: "pufla" });
  const [nazivPlayliste1, setnazivPlayliste] = React.useState("");

  const ulogovaniKorisnik = localStorage.getItem("username");
  const [userChildren, setUserChildren] = useState([]);
  const [urlAdresa, seturlAdresa] = useState("");
  const [prikaziVideo, setprikaziVideo] = useState(false);
  const [sadrzajFoldera, setSadrzajFodlera] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [showDodavanjePesme, setShowDodavanjePesme] = useState(false);
  const [urlNovePesme, setUrlNovePesme] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [showDivVideo, setShowDivVideo] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isShown, setIsShown]= useState(false);

  const [treePlaylist, setTreePlaylist] = React.useState(null);
  //const [tree, setTree] = React.useState({});

  const [tree, setTree] = React.useState({
    naziv: "Meni",
    subfolders: [],
  });


  // const [postaviTrenutnoImeFoldera, setPostaviTrenutnoImeFoldera]= useState('');


  // Callback funkcija koja će postaviti novu vrednost tree
  const handleSetTree = (newTree) => {
    setTree(newTree);
  };

  const ucitajPlayListe= async ()=>
  {
    axios
    .get(`http://127.0.0.1:5000/vratiPlayliste/${ulogovaniKorisnik}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      console.log("vrednsot za rsponse data je ", response.data);

      setTreePlaylist(response.data);
    })
    .catch((error) => {
      console.error("Error fetching playlists:", error);
    });

  };



  const handlePreuzmi = (element) => {
    console.log(element);

    axios.get(`http://127.0.0.1:5000/DownloadSliku/${element}`, {
      responseType: 'blob', // Postavljanje tipa odgovora na blob (binarni podaci)
    })
    .then(response => {
      // Kreiranje URL-a za preuzimanje binarnih podataka
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Kreiranje linka za preuzimanje
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', element); // Postavljanje naziva fajla za preuzimanje
      document.body.appendChild(link);
      link.click();
    })
    .catch(error => {
      console.error('Greška prilikom preuzimanja slike:', error);
    });



  };



  const handleDelete = async (element) => {
    // Logika za brisanje slike
    console.log(element);
    try {
      const response = await axios.delete("http://127.0.0.1:5000/ObrisiSliku", {
        data: {
          email: ulogovaniKorisnik,
          folder: ImeRoditelja,
          fajl: element,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        vratiSadrzajFoldera(ImeRoditelja);
        window.confirm("Uspesno obrisan fajl :", element);
      }
    } catch (error) {
      console.error("greska je", error);
    }
  };

  const handleShow = (element) => {
    // Logika za prikazivanje slike (možete implementirati zoom funkcionalnost)
    console.log(element);
    setShowOptions(false);
  };

  // const handleItemClick = (element) => {
  //   setSelectedElement(element);
  //   setShowOptions(true);
  // };

  const headingStyle = {
    fontFamily: "Roboto, sans-serif",
  };

  const toggleDiv = (vrednost) => {
    setShowDivVideo(vrednost);
  };

  const postaviUvekNaTrue = () => {
    setShowDivVideo(true);
  };

  const showVideoHandler = () => {
    setShowVideo(!showVideo);
  };
  const createFolderHandler = async (imeDeteta) => {
    console.log(imeDeteta);
    // napraviFolder
    napraviFolder(ImeRoditelja, imeDeteta);
   
  };

  const createPlaylistHandler = async (nazivPlayliste) => {
    console.log(nazivPlayliste);

    kreirajPlayListu(nazivPlayliste1);
  };

  const procitajSveFoldereZaKorisnika= async ()=>
  {

    axios
    .post(
      "http://127.0.0.1:5000/ProcitajSveFoldereZaKorisnika",
      {
        naziv: ulogovaniKorisnik,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Dodajte dodatne zaglavlja ovde ako je potrebno
          // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        },
      }
    ).then((p) => {
      //console.log(p);
      setTree(p.data);
     // onSetTree(p.data);
    });
  };

  const kreirajPlayListu = async (nazivPlayliste) => {
    console.log("usli smo u platlist fju ");
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/NapraviPlaylistu",
        {
          vlasnik: ulogovaniKorisnik,
          naziv: nazivPlayliste,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.status === 201) {
        if (response.data.message === "SUCCESS") {
          //OVDE CEMO DA POZOVEMO setTreePlaylist
          ucitajPlayListe();

          console.log("Uspesno dodata playlista:", response.data.message);
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
    }
  };

  const dodajPesmuPlaylistiHandler = async () => {
    //ovo se poziva kad se klikne na dugme  UploadPesmu

    try {
      const formData = new FormData();
      formData.append("roditelj", ulogovaniKorisnik);
      formData.append("playlist", playlistName);
      formData.append("url", urlNovePesme);

      console.log("FormData:", formData);

      const response = await axios.post(
        "http://127.0.0.1:5000/UploadPesmu",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.status === 201) {
        
        window.confirm("Uspesno dodata pesma u playlisti!");

        ucitajPlayListe();
          

          console.log("Uspesno dodat folder:", response.data.message);
        
      } else {
        console.log("Neuspešna prijava! Status kod nije 201.");
        // Možete dodati dodatnu logiku za neuspeh, na primer, prikazivanje poruke korisniku
      }
    } catch (error) {
      console.error("Greška prilikom dohvatanja podfoldera", error);
      // Možete dodati dodatnu logiku za grešku, na primer, prikazivanje poruke korisniku
    }
  };

  const postaviNazivPlaylisteGdeDodajemoPesmu = (imePlayliste) => {
    setPlaylistName(imePlayliste);
    console.log("U home sam i primio postavio sam ime playliste", imePlayliste);
  };

  const openDialogHandler = () => {
    setOpen(!open);
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0].name);
    setFileName(event.target.files[0]);
    // const files = event.target.files;
    // setSelectedFiles(files);
  };

  const handleDodavanjePesme = () => {
    setShowDodavanjePesme(!showDodavanjePesme);
  };

  useEffect(() => {
    // Implementirajte logiku koja će se izvršiti svaki put kada se promeni urlAdresa
    console.log("Promenjena je vrednost urlAdresa:", urlAdresa);
    console.log("Usao sam u useeffect");
    //nizSlika.push(novaSlika)
    //setNizSlika(nizSlika) //ovo ne radi
    // setNizSlika([...nizSlika, novataSlikata])  ovo je
    //nizSlika = [...nizSlika, novataSlikata]
  }, [urlAdresa]);

  const vratiSadrzajFoldera = async (imeFoldera) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/vratiSadrzajFoldera",
        {
          naziv: imeFoldera,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Dobijen sadržaj foldera", response.data);
        setSadrzajFodlera(response.data.files);
      } else {
        console.log("Neuspešna prijava! Status kod nije 200.");
        // Dodatna logika za neuspeh, npr. prikazivanje poruke korisniku
      }
    } catch (error) {
      console.error("Greška", error);
      // Dodatna logika za neuspeh, npr. prikazivanje poruke korisniku
    }
  };

  const uploadFileHandler = async () => {
    try {
      console.log("Ulogovani korisnik:", ulogovaniKorisnik);
      console.log("Ime roditelja:", ImeRoditelja);
      console.log("File:", file);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("email", ulogovaniKorisnik);
      formData.append("folder", ImeRoditelja);

      console.log("FormData:", formData);

      const response = await axios.post(
        "http://127.0.0.1:5000/UploadSliku",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server Response:", response.data);

      if (response.status === 201) {
        if (response.data.message === "Image uploaded successfully") {
          vratiSadrzajFoldera(ImeRoditelja);

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
    }
  };

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

          
          procitajSveFoldereZaKorisnika();
          console.log("Uspesno dodat folder:", response.data.message);
          window.confirm("Uspesno dodat folder!");
          // navigate("/");
        } else {
          console.log(
            "Neuspesno dodat folder! Status kod 201, ali prijava neuspešna."
          );
          window.confirm("Neuspešna dodat folder !");
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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            File sharing application 
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
              <ListItemButton>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary={text} />
                <AddIcon onClick={openDialogHandler} />{" "}
                {/* Dodaj ovde željenu ikonicu */}
              </ListItemButton>
            </ListItem>
          ))}
          <DropDownPlaylist
            seturlAdresa={seturlAdresa}
            setprikaziVideo={setprikaziVideo}
            prikaziVideo={prikaziVideo}
            handleDodavanjePesme={handleDodavanjePesme}
            postaviNazivPlaylisteGdeDodajemoPesmu={
              postaviNazivPlaylisteGdeDodajemoPesmu
            }
            toggleDiv={toggleDiv}
            postaviUvekNaTrue={postaviUvekNaTrue}
            setTreePlaylist={setTreePlaylist}
            treePlaylist={treePlaylist}
            ucitajPlayListe={ucitajPlayListe}

          ></DropDownPlaylist>
        </List>
        <Divider />
        <List>
          <p style={{ marginLeft: "80px", size: "25" }}> Folderi</p>
          <ListItem disablePadding>
            <DropMenu
              procitajMojuDecu={procitajMojuDecu}
              nazivFoldera={ulogovaniKorisnik}
              pronadjiImeRoditelja={pronadjiImeRoditelja}
              vratiSadrzajFoldera={vratiSadrzajFoldera}
              setShowDivVideo={setShowDivVideo}
              setIsShown={setIsShown}
              tree={tree}
              setTree={setTree}
              procitajSveFoldereZaKorisnika={procitajSveFoldereZaKorisnika}
            />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="divUploadFile">
            <FormDialog createFolderHandler={createFolderHandler} >
               </FormDialog>

            <Button
              variant="contained"
              onClick={uploadFileHandler}
              style={{ marginLeft: "55px" }}
            >
              Upload File{" "}
            </Button>

            <input
              style={{ margin: "5px" }}
              type="file"
              name="file"
              onChange={handleFileChange}
              multiple // Ako želite podršku za više fajlova
            />
          </div>
          <div style={{}} className="DivKojiseuvekprikazuje">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: "15px",
                borderBottom: "2px solid",
                height: "120px",
              }}
            >
              {/* <PlayListDialog createPlaylistHandler={createPlaylistHandler}>
              {" "}
            </PlayListDialog> */}

              <div className="kreiraj" style={{ display: "block" }}>
                <Button variant="contained" onClick={createPlaylistHandler}>
                  {" "}
                  Kreiraj Playlistu{" "}
                </Button>

                <div>
                  <TextField
                    id="standard-basic"
                    label="Naziv playliste"
                    variant="standard"
                    style={{ marginLeft: "15px" }}
                    onChange={(e) => setnazivPlayliste(e.target.value)}
                  />
                </div>
              </div>

              <div className="dodaj" style={{ display: "block" }}>
                <Button
                  variant="contained"
                  onClick={dodajPesmuPlaylistiHandler}
                >
                  {" "}
                  Dodaj pesmu playlisti{" "}
                </Button>

                <div>
                  <TextField
                    id="standard-basic"
                    label="Unesite url adresu"
                    variant="standard"
                    style={{ marginLeft: "15px" }}
                    onChange={(e) => setUrlNovePesme(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* <img  style={{width:'200px', height:'200px'}} src="http://127.0.0.1:5000/ajax.jpg"></img> */}
          </div>

          <div
            style={{ display: "block", flexWrap: "wrap", alignItems: "center" }}
          >
            {showDivVideo && (
              <div
                className="sayt"
                style={{
                  display: "block",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h1
                    style={{ marginRight: "50px" }}
                    onClick={showVideoHandler}
                    className="heading"
                  >
                    Ovde možete prikazati video
                  </h1>
                  <Button
                    variant="contained"
                    style={{ height: "50px", marginTop: "25px" }}
                    onClick={() => toggleDiv(false)}
                  >
                    Ugasi video player{" "}
                  </Button>
                </div>
                {showVideo && <YouTube videoId={urlAdresa} />}
              </div>
            )}
            <div
              className="probni"
              style={{ display: "flex", flexDirection: "column" }}
            >
               {isShown &&(<div  >
                <h1>Sadržaj foldera:</h1>
              </div>)}
              <div
                className="probni"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {Array.isArray(sadrzajFoldera) &&
                  sadrzajFoldera.map((element, index) => (
                    <div
                      className="proba"
                      key={index}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "200px",
                        height: "200px",
                        margin: "10px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div className="imageContainer">
                        {/* Dodajte ovde dodatnu logiku za prikaz slike ili linka na osnovu ekstenzije */}
                        {element.endsWith(".jpg") ||
                        element.endsWith(".jpeg") ||
                        element.endsWith(".png") ||
                        element.endsWith(".gif") ? (
                          <img
                            src={`http://127.0.0.1:5000/${element}`}
                            alt={`Slika ${index}`}
                            className="image"
                          />
                        ) : element.endsWith(".pdf") ? (
                          // Prikaži link za preuzimanje PDF-a
                          <div className="folderContainer">
                            <FolderIcon /> {element}
                          </div>
                        ) : (
                          <p>
                            Nepoznata ekstenzija:{" "}
                            {element.split(".").pop().toLowerCase()}
                          </p>
                        )}
                        <div className="overlay">
                          <a
                            href={`http://127.0.0.1:5000/${element}`}
                            className="showButton"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Prikaži
                          </a>
                          <button
                            onClick={() => handlePreuzmi(element)}
                            className="showButton"
                          >
                            Preuzmi
                          </button>
                          <button
                            onClick={() => handleDelete(element)}
                            className="deleteButton"
                          >
                            Obriši
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default DrawerComponent;
