import "./App.scss";

import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom";
import { PrivateRoute } from "./AuthProvider";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import MainPage from "./components/MainPage/MainPage";
import Favorites from "./components/Favorites/Favorites";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="navbar">
          <div className="nav-item">
            <Link className="nav-item" to="/main">
              Main
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-item" to="/favorites">
              Favorites
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-item" to="/login">
              Login
            </Link>
          </div>
          <div className="nav-item">
            <Link className="nav-item" to="/register">
              Register
            </Link>
          </div>
        </div>
        <Switch>
          <PrivateRoute exact path={"/main"} component={MainPage} />
          <PrivateRoute exact path={"/favorites"} component={Favorites} />
          <Route path="/register" component={Register} />
          <Route exact path={["/", "/login"]} component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
