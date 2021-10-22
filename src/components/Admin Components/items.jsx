import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: `http://localhost:5000/item`,
});

function App() {
  var columns = [
    { title: "id", field: "_id", hidden: true },

    {
      title: "Item Code",
      field: "itemId",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
    {
      title: "Name",
      field: "name",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
    {
      title: "Category Id",
      field: "catID",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
    {
      title: "Unit Price",
      field: "uPrice",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
    {
      title: "Description",
      field: "description",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
    {
      title: "Img URL",
      field: "imageURL",
      headerStyle: {
        backgroundColor: "#0664A8",
        color: "#FFF",
      },
    },
  ];
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get("/getall")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const UpdateRow = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (newData.itemId === "") {
      errorList.push("Please enter Item Code");
    }
    if (newData.name === "") {
      errorList.push("Please enter name");
    }
    if (newData.catID === "") {
      errorList.push("Please enter category");
    }
    if (newData.uPrice === "") {
      errorList.push("Please enter unit price");
    }
    if (newData.description === "") {
      errorList.push("Please enter description");
    }

    if (errorList.length < 1) {
      api
        .put("/" + newData._id, newData)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const AddRow = (newData, resolve) => {
    //validation
    let errorList = [];
    if (newData.name === undefined) {
      errorList.push("Please enter name");
    }
    if (newData.itemId === undefined) {
      errorList.push("Please enter Item code");
    }
    if (newData.catID === undefined) {
      errorList.push("Please enter Category Id");
    }
    if (newData.uPrice === undefined) {
      errorList.push("Please enter unit price");
    }
    if (newData.description === undefined) {
      errorList.push("Please enter description");
    }

    if (errorList.length < 1) {
      //no error
      api
        .post("/add", newData)
        .then((res) => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
          console.log(newData);
          api
            .get("/getall")
            .then((res) => {
              setData(res.data);
            })
            .catch((error) => {
              console.log("Error");
            });
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const DeleteRow = (oldData, resolve) => {
    api
      .delete("/" + oldData._id)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div className="container mt-5">
      <div className="App">
        <Grid container spacing={25}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <div>
              {iserror && (
                <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                    return <div key={i}>{msg}</div>;
                  })}
                </Alert>
              )}
            </div>
            <MaterialTable
              title="Item Details"
              columns={columns}
              data={data}
              icons={tableIcons}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    UpdateRow(newData, oldData, resolve);
                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    AddRow(newData, resolve);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    DeleteRow(oldData, resolve);
                  }),
              }}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default App;