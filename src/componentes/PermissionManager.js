/* eslint-disable eqeqeq */

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
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert
} from "@mui/material";
import { makeStyles } from "@mui/styles"
import axios from "axios";
import { customTheme } from "./themes/customTheme";

const API_URL = "https://localhost:5001/api/permissions";

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
    margin: 2,
  },
  input: {
    marginRight: 2,
  },
  tableContainer: {
    marginTop: 3,
  },
  error: {
    borderColor: "red !important",
  },
}));

function PermissionManager() {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({});
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [selectedPermissionType, setSelectedPermissionType] = useState("");
  const [selectedPermissionTypeModif, setSelectedPermissionTypeModif] = useState("");
  const [errors, setErrors] = useState({});
  const [errorsModif, setErrorsModif] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: ''
  });

  const classes = useStyles();

  useEffect(() => {
    // Fetch permissions from the API on component mount
    api.get(API_URL).then((response) => {
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    });
  }, []);

  const permissionTypes = [
    {
      id: 1,
      description: 'Admin'
    },
    {
      id: 2,
      description: 'Employee'
    }
  ];

  const validatePermission = (validations, permission, prop) => {
    let errors = {
      permissionTypeId: 'You must select a permission type',
      employeeName: 'Employee name cannot be empty',
      employeeLastName: 'Employee last name cannot be empty'
    }

    if (prop) {
      if (!permission[prop]) {
        validations[prop] = errors[prop];
      } else {
        validations[prop] = null;
      }

      return validations;
    }

    if (!permission.permissionTypeId) {
      validations.permissionTypeId = errors.permissionTypeId;
    }

    if (!permission.employeeName) {
      validations.employeeName = errors.employeeName;
    }

    if (!permission.employeeLastName) {
      validations.employeeLastName = errors.employeeLastName;
    }
  
    return validations;
  }

  const setSnackbarError = (message) => {
    setSnackbar({
      open: true,
      vertical: 'top',
      horizontal: 'center',
      severity: 'error',
      message: message
    });
  }

  const setSnackbarSuccess = (message) => {
    setSnackbar({
      open: true,
      vertical: 'top',
      horizontal: 'center',
      severity: 'success',
      message: message
    });
  }

  const handleCreatePermission = () => {
    newPermission.permissionTypeId = selectedPermissionType;

    let validations = validatePermission({}, newPermission);

    if (Object.keys(validations).length === 0) {
      api.post(API_URL, { permission: newPermission }).then((response) => {
        let newItem = {...response.data.data, permissionType: permissionTypes.find(x => x.id == newPermission.permissionTypeId)};
        setPermissions([newItem].concat(permissions));
        setNewPermission({});
        setSelectedPermissionType(""); 
        setSnackbarSuccess('Entity created successfuly');
      });
    } else {
      setErrors(validations);
      setSnackbarError('The fields have some errors');
    }
  };

  const handleCancelUpdatePermission = () => {
    setSelectedPermission(null);
  };

  const handleUpdatePermission = () => {
    selectedPermission.permissionTypeId = selectedPermissionTypeModif;

    let validations = validatePermission({}, selectedPermission);

    if (Object.keys(validations).length === 0) {
      api.put(`${API_URL}/${selectedPermission.id}`, { permission: selectedPermission }).then(() => {
        setPermissions(permissions.map((p) => (p.id === selectedPermission.id ? selectedPermission : p)));
        setSelectedPermission(null);
        setSnackbarSuccess('Entity updated successfuly');
      });
    } else {
      setErrorsModif(validations);
      setSnackbarError('The fields have some errors');
    }
  };

  const handleDeletePermission = (id) => {
    api.delete(`${API_URL}/${id}`).then(() => {
      setPermissions(permissions.filter((permission) => permission.id !== id));
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(prev => { return {...prev, open: false }});
  };

  const { vertical, horizontal } = snackbar;

  return (
  <div className={classes.root}>
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
      key={vertical + horizontal}
      >
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    <h1>Permission Manager</h1>
    <Grid container spacing={2} className={classes.form}>
      <Grid item>
        <FormControl variant="outlined">
          <InputLabel id="dropdown-label" className={`${classes.input} ${errors.permissionTypeId && 'boder-color-red'}`}>Permission Type</InputLabel>
          <Select
            className={`${classes.input} ${errors.permissionTypeId && 'boder-color-red'}`}
            labelId="dropdown-label"
            id="dropdown"
            value={selectedPermissionType}
            onChange={(e) => {
              let permissionToCreate = { ...newPermission, permissionTypeId: e.target.value };
              setNewPermission(permissionToCreate);
              setSelectedPermissionType(e.target.value);
              setErrors(validatePermission({...errors}, permissionToCreate, 'permissionTypeId'));
            }}
            label="Select an option"
            style={{minWidth: 200}}
          >
            {permissionTypes.map(x => (
              <MenuItem key={x.id} value={x.id}>{x.description}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl variant="outlined">
          <TextField
            className={`${classes.input} ${errors.employeeName && 'boder-color-red'}`}
            label="Employee Name"
            value={newPermission.employeeName || ""}
            onChange={(e) => {
              let permissionToCreate = { ...newPermission, employeeName: e.target.value };
              setNewPermission(permissionToCreate);
              setErrors(validatePermission({...errors}, permissionToCreate, 'employeeName'));
            }}
          />
        </FormControl>
      </Grid>
      <Grid item>
        <TextField
          className={`${classes.input} ${errors.employeeLastName && 'boder-color-red'}`}
          label="Employee Last Name"
          value={newPermission.employeeLastName || ""}
          onChange={(e) => {
            let permissionToCreate = { ...newPermission, employeeLastName: e.target.value };
            setNewPermission(permissionToCreate);
            setErrors(validatePermission({...errors}, permissionToCreate, 'employeeLastName'));
          }}
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleCreatePermission}>
          Create
        </Button>
      </Grid>
    </Grid>
    { Object.keys(errors).length > 0 && <Grid className={'boder-color-red'}>{ 
      Object.values(errors).map((x, i) => (
        <>{x && <li key={x}>{x}</li>}</>
    ))}</Grid>}
    {selectedPermission && (
      <>
        <Grid container spacing={2} className={classes.form} style={{marginTop: 10}}>
          <Grid item>
            <FormControl variant="outlined">
              <InputLabel id="dropdown-label" className={`${classes.input} ${errorsModif.permissionTypeId && 'boder-color-red'}`}>Permission Type</InputLabel>
              <Select
                className={`${classes.input} ${errorsModif.permissionTypeId && 'boder-color-red'}`}
                labelId="dropdown-label"
                id="dropdown"
                value={selectedPermissionTypeModif}
                onChange={(e) => {
                  let newSelectedPermission = { ...selectedPermission, permissionTypeId: e.target.value };
                  setSelectedPermission(newSelectedPermission);
                  setSelectedPermissionTypeModif(e.target.value);
                  setErrorsModif(validatePermission({...errorsModif}, newSelectedPermission, 'permissionTypeId'));
                }}
                label="Select an option"
                style={{minWidth: 200}}
              >
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">Employee</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              className={`${classes.input} ${errorsModif.employeeName && 'boder-color-red'}`}
              label="Employee Name"
              value={selectedPermission.employeeName || ""}
              onChange={(e) => {
                let newSelectedPermission = { ...selectedPermission, employeeName: e.target.value };
                setSelectedPermission(newSelectedPermission);
                setErrorsModif(validatePermission({...errorsModif}, newSelectedPermission, 'employeeName'));
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              className={`${classes.input} ${errorsModif.employeeLastName && 'boder-color-red'}`}
              label="Employee Last Name"
              value={selectedPermission.employeeLastName || ""}
              onChange={(e) => {
                let newSelectedPermission = { ...selectedPermission, employeeLastName: e.target.value };
                setSelectedPermission(newSelectedPermission);
                setErrorsModif(validatePermission({...errorsModif}, newSelectedPermission, 'employeeLastName'));
              }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleUpdatePermission}>
              Update
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancelUpdatePermission}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        { Object.keys(errorsModif).length > 0 && <Grid className={'boder-color-red'}>{ 
          Object.values(errorsModif).map(x => (
            <>{x && <li key={x}>{x}</li>}</>
        ))}</Grid>}
      </>
    )}
    <TableContainer component={Paper} className={classes.tableContainer} style={{marginTop: 20}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Permission Type</TableCell>
            <TableCell>Employee Name</TableCell>
            <TableCell>Employee Last Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.permissionType.description}</TableCell>
              <TableCell>{permission.employeeName}</TableCell>
              <TableCell>{permission.employeeLastName}</TableCell>
              <TableCell>
                {/* <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePermission(permission.id)}
                >
                  Delete
                </Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedPermission(permission);
                    setSelectedPermissionTypeModif(permission.permissionTypeId);
                    setErrorsModif({});
                  }}
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