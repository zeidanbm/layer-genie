import uxp from "uxp";
import "./styles.css";
import setup from "./setup";
import Main from "./panels/Main";
import About from "./panels/About";
import StoreProvider from "./store";

setup({
  dialogs: [
    {
      id: "about",
      title: "About",
      size: { width: 320, height: 420 },
      resize: "both",
      render: (close) => <About close={close} />,
    },
  ],
  commands: [
    {
      id: "openFile",
      run: () => {
        uxp.dialog.showOpenDialog({});
      },
    },
  ],
  panels: [
    {
      id: "main",
      render: () => (
        <StoreProvider>
          <Main />
        </StoreProvider>
      ),
    },
  ],
});
