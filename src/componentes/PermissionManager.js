import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles"
import axios from "axios";

// Import your customized theme
import { customTheme } from "./themes/customTheme"; // Replace with the path to your theme file

const API_URL = "https://localhost:5001/api/permissions"; // Replace with your API endpoint

let api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  responseType: "json",
  headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
      "Accept": "application/json",
      "Cache-Control": "no-store"
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    maxWidth: 800,
    padding: 3,
  },
  form: {
    display: "flex",
    alignItems: "center",
    marginBottom: 2,
  },
  input: {
    marginRight: 2,
  },
  tableContainer: {
    marginTop: 3,
  },
}));

function PermissionManager() {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({});
  const [selectedPermission, setSelectedPermission] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    // Fetch permissions from the API on component mount
    api.get(API_URL).then((response) => {
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    });
  }, []);

  const handleCreatePermission = () => {
    // Send a POST request to create a new permission
    api.post(API_URL, { permission: newPermission }).then((response) => {
      setPermissions([...permissions, response.data.data]);
      setNewPermission({});
    });
  };

  const handleUpdatePermission = () => {
    // Send a PUT request to update the selected permission
    api.put(`${API_URL}/${selectedPermission.id}`, { permission: selectedPermission }).then(() => {
      setPermissions(permissions.map((p) => (p.id === selectedPermission.id ? selectedPermission : p)));
      setSelectedPermission(null);
    });
  };

  const handleDeletePermission = (id) => {
    // Send a DELETE request to delete a permission
    api.delete(`${API_URL}/${id}`).then(() => {
      setPermissions(permissions.filter((permission) => permission.id !== id));
    });
  };

  return (
  <div className={classes.root}>
    <h1>Permission Manager</h1>
    <Grid container spacing={2} className={classes.form}>
      <Grid item>
        <TextField
          className={classes.input}
          label="Permission Type Id"
          value={newPermission.permissionTypeId || ""}
          onChange={(e) => setNewPermission({ ...newPermission, permissionTypeId: e.target.value })}
        />
      </Grid>
      <Grid item>
        <TextField
          className={classes.input}
          label="Employee Name"
          value={newPermission.employeeName || ""}
          onChange={(e) => setNewPermission({ ...newPermission, employeeName: e.target.value })}
        />
      </Grid>
      <Grid item>
        <TextField
          className={classes.input}
          label="Employee Last Name"
          value={newPermission.employeeLastName || ""}
          onChange={(e) => setNewPermission({ ...newPermission, employeeLastName: e.target.value })}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleCreatePermission}>
          Create
        </Button>
      </Grid>
    </Grid>
    {selectedPermission && (
      <Grid container spacing={2} className={classes.form}>
        <Grid item>
          <TextField
            className={classes.input}
            label="Permission Type Id"
            value={selectedPermission.permissionTypeId || ""}
            onChange={(e) => setSelectedPermission({ ...selectedPermission, permissionTypeId: e.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.input}
            label="Employee Name"
            value={selectedPermission.employeeName || ""}
            onChange={(e) => setSelectedPermission({ ...selectedPermission, employeeName: e.target.value })}
          />
        </Grid>
        <Grid item>
          <TextField
            className={classes.input}
            label="Employee Last Name"
            value={selectedPermission.employeeLastName || ""}
            onChange={(e) => setSelectedPermission({ ...selectedPermission, employeeLastName: e.target.value })}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleUpdatePermission}>
            Update
          </Button>
        </Grid>
      </Grid>
    )}
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Permission Type Id</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Employee Last Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.permissionTypeId}</TableCell>
              <TableCell>{permission.employeeName}</TableCell>
              <TableCell>{permission.employeeLastName}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePermission(permission.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedPermission(permission)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}

export default PermissionManager;