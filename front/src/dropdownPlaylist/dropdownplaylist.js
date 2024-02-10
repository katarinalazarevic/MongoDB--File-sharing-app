import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import PlayListDialog from "../PlayListaDialog/PlayListaDialog";


const DropDownPlaylist = ({
  
  seturlAdresa,
  postaviNazivPlaylisteGdeDodajemoPesmu,
 
}) => {
  const ucitaniKorisnik = localStorage.getItem("username");
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [tree, setTree] = React.useState(null);
  const ulogovaniKorisnik=localStorage.getItem('username');

  const [editMode, setEditMode] = useState(false);
  const [newNamePlaylist, setNewPlaylistName]= useState('');


  useEffect(() => {
    console.log(ucitaniKorisnik);
    axios
      .get(`http://127.0.0.1:5000/vratiPlayliste/${ucitaniKorisnik}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        console.log("vrednsot za rsponse data je ", response.data);

        setTree(response.data);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });
  }, [selected]);

  const clickHandler = (imePlayListe) => {
      console.log("kliknuio sam na ", imePlayListe);
      postaviNazivPlaylisteGdeDodajemoPesmu(imePlayListe); 
    //let id = extractVideoId(urlAdresa);
    //console.log("postavljam  ", id);
    //seturlAdresa(id);
    //setprikaziVideo(!prikaziVideo);
  };

  function extractVideoId(url) {
    console.log(url);
    const regex =
      /(?:youtu\.be\/|youtube\.com(?:\/(?:[^\/]+\.))?[^\s?&]+(?:[\?\&]v=|\/embed\/|\/watch\?v=))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  const handleDeletePesma= async (URLpesma)=>
  {
    console.log("Url pesme je ",URLpesma);

    try {
      const response = await axios.delete("http://127.0.0.1:5000/ObrisiPesmu", {
  data: {
    url: URLpesma,
    email: ulogovaniKorisnik
  },
  headers: {
    "Content-Type": "application/json"
  }
});

    
      if (response.status === 200) {
        window.confirm(response.message);
      } else {
        window.confirm("Neuspesno brisanje!");
      }
    } catch (error) {
      console.error("Greška prilikom brisanja playliste:", error);
      window.confirm("Došlo je do greške prilikom brisanja playliste. Molimo vas pokušajte ponovo.");
    }

  };


  const handleUpdatePlayListName= async  ( email,novoIme,staroIme)=>
  {
     
     
      
     

    try {
      const response = await axios.put("http://127.0.0.1:5000/IzmeniPlaylistu", {
        vlasnik: email,
    trenutno_ime: staroIme,
    novo_ime: novoIme
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      });
    
      if (response.status === 200) {
        window.confirm("Uspesno ste update playlistu: " + staroIme);
      } else {
        window.confirm("Neuspesno brisanje!");
      }
    } catch (error) {
      console.error("Greška prilikom brisanja playliste:", error);
      window.confirm("Došlo je do greške prilikom brisanja playliste. Molimo vas pokušajte ponovo.");
    }
    
      

  };


  const handleDeletePlaylist = async (event, imeplayliste) => {
    event.stopPropagation(); // Zaustavi dalje širenje događaja klika
    console.log("Pozivam fju")
    
    try {
      const response = await axios.delete("http://127.0.0.1:5000/ObrisiPlaylistu", {
        data: {
          vlasnik: ulogovaniKorisnik,
          naziv: imeplayliste
        },
        headers: {
          "Content-Type": "application/json",
        }
      });
    
      if (response.status === 200) {
        window.confirm("Uspesno ste obrisali playlistu: " + imeplayliste);
      } else {
        window.confirm("Neuspesno brisanje!");
      }
    } catch (error) {
      console.error("Greška prilikom brisanja playliste:", error);
      window.confirm("Došlo je do greške prilikom brisanja playliste. Molimo vas pokušajte ponovo.");
    }
    

    //ovde cemo da pozovemo metodu koja ce da obrise playlistu


    // Implementirajte logiku za brisanje playliste
  };
  

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    setSelected(nodeId);
    // console.log(event.target.textContent);
    const idVidea = extractVideoId(event.target.textContent);
    console.log(idVidea);
    seturlAdresa(idVidea);
  };

  const getTreeLeaf = (playlists) => {
    console.log(playlists);

    if (Array.isArray(playlists)) {
      return playlists.map((playlist) => (
        <TreeItem
  key={playlist._id}
  nodeId={playlist._id}
  label={
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{`Playlista: ${playlist.naziv}`}</span>
      <DeleteIcon onClick={(event) => handleDeletePlaylist(event, playlist.naziv)} />
      {/* <CreateIcon onClick={(event) => handleUpdatePlayList(event, playlist.naziv)} >   </CreateIcon> */}
      <PlayListDialog
    playlistNameprop={playlist.naziv}
    handleUpdatePlayListName={( a, b, c) => handleUpdatePlayListName( a, b, c)}
/>
    </div>
    
  }
  onClick={() => clickHandler(playlist.naziv)}
>
{playlist.pesme.map((pesma, index) => (
  <TreeItem key={index} nodeId={`${playlist._id}-${index}`} label={
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{pesma}</span>
      <DeleteIcon onClick={() => handleDeletePesma(pesma, index)} />
    </div>
  } />
))}

</TreeItem>
      ));
    } else {
      console.error("playlists nije niz");
      return null;
    }
  };

  //   const renderTree = () => {
  //     if (!tree) return null;
  //     return tree.map((playlist) => renderPlaylist(playlist));
  //   };

  return (
    <Box sx={{ minHeight: 250, flexGrow: 1, maxWidth: 270 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={() => setExpanded([])}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
        <Button onClick={() => setSelected([])}>
          {selected.length === 0 ? "Select all" : "Unselect all"}
        </Button>
      </Box>
      <TreeView
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {getTreeLeaf(tree)}
      </TreeView>

      {editMode && (
        <div>
          <input
            type="text"
            value={newNamePlaylist}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          {/* <Button onClick={() => handleSaveEdit(playlist.naziv)}>Sačuvaj</Button>
          <Button onClick={() => handleCancelEdit()}>Otkaži</Button> */}
          <Button>Pryaer </Button>
        </div>
      )}


    </Box>
  );
};

export default DropDownPlaylist;
