import React, { useState } from "react";

import NavigationBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./Pages/home";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/registerPage";
import PriceHistory from "./Pages/priceHistory";

function App() {
  const [isLog, setIsLog] = useState(false);

  const LoginHandler = () => {
    setIsLog(true);
  };

  const LogoutHandler = () => {
    setIsLog(false);
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar isLog={isLog} setIsLog={LogoutHandler} />

        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/priceHistory" exact component={PriceHistory}></Route>
          <Route path="/login">
            <LoginPage isLogged={isLog} setLoggedIn={LoginHandler} />{" "}
          </Route>
          <Route path="/register" component={RegisterPage}></Route>
          <Route path="/priceHistory/:symbol" exact component={PriceHistory} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
