import { useTheme } from "../contexts/ThemeContext";
function Header() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      Active theme : {theme}
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Change Theme
      </button>
    </div>
  );
}

export default Header;
