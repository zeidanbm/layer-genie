import GenerateCollection from "../components/generateCollection";
import InitialSetup from "../components/initialSetup";
import LayersWeight from "../components/layersWeight";
import { Divider } from "react-uxp-spectrum";
import Dialog from "../components/dialog";
import { useContext } from "react";
import { StoreContext } from "../store";
import { ActionTypes } from "../constants";

const Main = () => {
  const { state, dispatch } = useContext(StoreContext);

  const handleDialogClose = async (dialog: HTMLDialogElement) => {
    dialog.addEventListener("close", (_e) => {
      dispatch({
        type: ActionTypes.SET_MODAL,
        payload: {
          isModalOpen: false,
          modal: null,
        },
      });
    });
    dialog.close();
  };

  return (
    <>
      <InitialSetup />
      <Divider className="my-6" size="small" />
      <LayersWeight />
      <Divider className="my-6" size="small" />
      <GenerateCollection />
      {state.isModalOpen ? <Dialog onClose={handleDialogClose} /> : null}
    </>
  );
};

export default Main;
