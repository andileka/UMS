import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import routes from "./config/routes.js";
import AppRoute from "./components/layout/AppRoute";
import Header from "./components/layout/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="mt-2">
          <Switch>
            {routes.map((route) => (
              <AppRoute
                key={route.path}
                path={route.path}
                component={route.component}
                components={route.components}
              />
            ))}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
