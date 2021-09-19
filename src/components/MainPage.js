import React, { useEffect } from "react";
import styles from "./MainPage.module.css";
import { useQuery } from "@apollo/react-hooks";
import { GET_EMPLOYEES, GET_DEPTS } from "../queries";
import jwtDecode from "jwt-decode";
import { ExitToApp } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import EmployeeList from "./EmployeeList";
import EmployeeCreate from "./EmployeeCreate";
import EmployeeDetails from "./EmployeeDetails";

const MainPage = () => {
  const {
    loading: loadingDepts,
    data: dataDepts,
    error: errorDepts,
  } = useQuery(GET_DEPTS);
  const {
    loading: loadingEmployees,
    data: dataEmployees,
    error: errorEmployees,
  } = useQuery(GET_EMPLOYEES);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
      }
    } else {
      window.location.href = "/";
    }
  }, [errorEmployees, errorDepts]);

  if (loadingEmployees || loadingDepts) return <h1>Loading from server</h1>;
  else if (errorEmployees || errorDepts)
    return (
      <>
        <h1>{errorEmployees.message}</h1>
        <h1>{errorDepts.message}</h1>
      </>
    );

  return (
    <div className={styles.MainPage}>
      <h1> Graphql Lesson</h1>
      <ExitToApp
        className={styles.MainPage__out}
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      />
      <EmployeeCreate dataDepts={dataDepts} />
      <Grid container>
        <Grid item xs={5}>
          <EmployeeList dataEmployees={dataEmployees} />
        </Grid>
        <Grid item xs={4}>
          <EmployeeDetails />
        </Grid>
        <Grid item xs={3}>
          <DeptList dataDepts={dataDepts} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={2}>
          <FilterByName />
        </Grid>
        <Grid item xs={3}>
          <FilterByAnd />
        </Grid>
        <Grid item xs={7}>
          <Pagination />
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
