// DropMenu.jsucitaniKorisnik

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import FolderDialog from "../FolderDialog/folderdialog";

const DropDown = ({
  pronadjiImeRoditelja,
  vratiSadrzajFoldera,
  setShowDivVideo,
  setIsShown
}) => {
  const ucitaniKorisnik = localStorage.getItem("username");
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState(0);

  const [treutnoImeFoldera, setTrenutnoimeFoldera] = React.useState("");

  const [tree, setTree] = React.useState({
    naziv: "Meni",
    subfolders: [],
  });

  useEffect(() => {
    //console.log(ucitaniKorisnik);
    axios
      .post(
        "http://127.0.0.1:5000/ProcitajSveFoldereZaKorisnika",
        {
          naziv: ucitaniKorisnik,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Dodajte dodatne zaglavlja ovde ako je potrebno
            // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          },
        }
      )
      .then((p) => {
        //console.log(p);
        setTree(p.data);
      });
  }, [selected]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const deleteHandler = async (nazivFoldera) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/ObrisiFolder/${nazivFoldera}`, 
        {
        headers: {
          "Content-Type": "application/json",
        }
      });
    
      if (response.status === 200) {
        window.confirm("Uspesno ste obrisali folder: " + treutnoImeFoldera);
      } else {
        window.confirm("Neuspesno brisanje !");
      }
    } catch (error) {
      console.error("Greška prilikom brisanja foldera:", error);
      window.confirm("Došlo je do greške prilikom brisanja foldera. Molimo vas pokušajte ponovo.");
    }
  };

  const updateNameHandler = async (nazivNovogFoldera) => {
    console.log(treutnoImeFoldera, nazivNovogFoldera);

    try {
      const response = await axios.put(
        "http://127.0.0.1:5000/IzmeniFolder",
        {
          trenutno_ime: treutnoImeFoldera,
          novo_ime: nazivNovogFoldera,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        window.confirm(
          "Uspesno ste promeni ime  foldera: " + treutnoImeFoldera
        );
      } else {
        window.confirm("Neuspesno menjanje !");
      }
    } catch (error) {
      console.error("Greška prilikom brisanja playliste:", error);
      window.confirm(
        "Došlo je do greške prilikom brisanja playliste. Molimo vas pokušajte ponovo."
      );
    }
  };

  const handleSelect = (event, nodeId) => {
    setShowDivVideo(false);
    // console.log("postavio sam vrednost za div na false");

    setSelected(nodeId);
    setIsShown(true);
    //createFolderHandler(nodeId);

    pronadjiImeRoditelja(nodeId);
    setTrenutnoimeFoldera(nodeId);
    console.log("Kliknuo sam na :", nodeId);
    vratiSadrzajFoldera(nodeId);
  };

  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? ["1", "5", "6", "7"] : []
    );
  };

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        : []
    );
  };

  const getTreeLeaf = (p) => {
    return (
      <TreeItem
        nodeId={p.naziv}
        label={
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{p.naziv}</span> {/* Naziv */}
            {p.naziv !== ucitaniKorisnik && (
              <DeleteIcon
                onClick={() => deleteHandler(p.naziv)}
                style={{ marginLeft: "auto" }}
              />
            )}
            {/* DeleteIcon, prikaži samo ako nije ulogovani korisnik */}
            {p.naziv !== ucitaniKorisnik && (
              <FolderDialog
                updateNameHandler={updateNameHandler}
                style={{ marginLeft: "5px" }}
              />
            )}
          </div>
        }
      >
        {p.subfolders.map((q) => getTreeLeaf(q, ucitaniKorisnik))}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
      <Box sx={{ mb: 1 }}>
       
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

export default DropDown;
