import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

const DropDownPlaylist = ({
  procitajMojuDecu,
  nazivFoldera,
  pronadjiImeRoditelja,
  seturlAdresa,
  prikaziVideo,
  setprikaziVideo,
}) => {
  const ucitaniKorisnik = localStorage.getItem("username");
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [tree, setTree] = React.useState(null);

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

  const clickHandler = (urlAdresa) => {
    //  console.log("kliknuio sam na ", urlAdresa);
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
          label={`Playlist: ${playlist.naziv}`}
          onClick={clickHandler}
        >
          {playlist.pesme.map((pesma, index) => (
            <TreeItem key={index} nodeId={index} label={pesma} />
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
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
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
    </Box>
  );
};

export default DropDownPlaylist;
