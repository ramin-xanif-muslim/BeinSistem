import Button from "./Button";
import Header from "./Header";

import { useTheme } from "../contexts/ThemeContext";
import Profile from "./Profile";
function Container() {
  const { theme } = useTheme();
  return (
    <div className={theme}>
      <Button />
      <br />
      <Header />
      <hr />
      <Profile />
    </div>
  );
}

export default Container;
