import React from "react";
import { Route } from "react-router-dom";
const AppRoutes = ({ component: Component, components, path, ...rest }) => {
  if (components) {
    Component = components;
  }
  return (
    <Route
      exact
      path={path}
      render={(props) => <Component {...props} />}
      {...rest}
    />
  );
};

export default AppRoutes;
