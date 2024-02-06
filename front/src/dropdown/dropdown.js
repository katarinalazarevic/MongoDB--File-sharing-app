// DropMenu.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

const DropDown = ({ procitajMojuDecu, nazivFoldera ,pronadjiImeRoditelja}) => {
  const ucitaniKorisnik=localStorage.getItem("username");
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [tree, setTree] = React.useState({
    'naziv': "Meni",
    'subfolders': [],
  });

  useEffect(() => {
    console.log(ucitaniKorisnik);
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
        console.log(p);
        setTree(p.data);
      });
  }, [selected]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    setSelected(nodeId);
    //createFolderHandler(nodeId);
    pronadjiImeRoditelja(nodeId);
    console.log(nodeId);
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
      <TreeItem nodeId={p.naziv} label={p.naziv}>
        {p.subfolders.map((q) => getTreeLeaf(q))}
      </TreeItem>
    );
  };

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleExpandClick}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
        <Button onClick={handleSelectClick}>
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

export default DropDown;
