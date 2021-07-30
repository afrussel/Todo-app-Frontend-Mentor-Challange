/* Change-theme code by: @DorianDesigns
Repo: https://github.com/DorianDesings/change-theme */

const switchInput = document.getElementById("switch");
const styles = document.documentElement.style;
const miStorage = window.localStorage;

const lightTheme = {
  "--bg-mobile": "url('../assets/img/bg-mobile-light.jpg')",
  "--bg-desktop": "url('../assets/img/bg-desktop-light.jpg')",
  "--theme-icon": "url('../assets/img/icon-moon.svg')",
  "--bg-color": "hsl(236, 33%, 92%)",
  "--list-bg-color": "hsl(0, 0%, 98%)",
  "--light-grayish-blue": "hsl(233, 11%, 84%)",
  "--list-text": "hsl(235, 19%, 35%",
  "--border-color": "hsl(233, 11%, 84%)",
};

const darkTheme = {
  "--bg-mobile": "url('../assets/img/bg-mobile-dark.jpg')",
  "--bg-desktop": "url('../assets/img/bg-desktop-dark.jpg')",
  "--theme-icon": "url('../assets/img/icon-sun.svg')",
  "--bg-color": "hsl(235, 21%, 11%)",
  "--list-bg-color": "hsl(235, 24%, 19%)",
  "--light-grayish-blue": "hsl(234, 39%, 85%);",
  "--list-text": "hsl(234, 39%, 85%)",
  "--border-color": "hsl(237, 14%, 26%)",
};

const changeTheme = (theme) => {
  const customStyles = Object.keys(theme);
  for (const style of customStyles) {
    styles.setProperty(style, theme[style]);
  }
};

if (miStorage.getItem("theme") == "dark") {
  changeTheme(darkTheme);
  switchInput.previousElementSibling.checked = true;
}

switchInput.addEventListener("click", (e) => {
  if (e.target.previousElementSibling.checked) {
    changeTheme(lightTheme);
    miStorage.setItem("theme", "light");
  } else {
    changeTheme(darkTheme);
    miStorage.setItem("theme", "dark");
  }
});
