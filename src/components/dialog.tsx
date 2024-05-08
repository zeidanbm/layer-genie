import { useCallback, useContext, useEffect, useRef } from "react";
import { Body, Button, Heading, Icon } from "react-uxp-spectrum";
import { ActionTypes } from "../constants";
import { StoreContext } from "../store";
import ErrorIcon from "./atoms/errorIcon";
import SuccessIcon from "./atoms/successIcon";

const Dialog = ({
  onClose,
}: {
  onClose: (value: HTMLDialogElement) => void;
}) => {
  const { state, dispatch } = useContext(StoreContext);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const handleDialogOpen = async () => {
      if (!dialogRef.current || dialogRef.current.open) {
        return;
      }
      await dialogRef.current.showModal();
    };

    handleDialogOpen().catch(console.error);
  }, []);

  const handleDialogClose = () => {
    if (!dialogRef.current) {
      return;
    }
    onClose(dialogRef.current);
  };

  const renderIcon = useCallback(() => {
    switch (state.modal?.type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      default:
        return null;
    }
  }, [state.modal]);

  return (
    <dialog ref={dialogRef} className="min-w-[200px]">
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          {renderIcon()}
          <Heading size="M" className="m-0 p-0">
            {state.modal?.title}
          </Heading>
        </div>
        <Body
          size="S"
          className="mb-6 p-2 border border-gray-300 rounded whitespace-pre-wrap"
        >
          {state.modal?.message}
        </Body>
        <div className="row" style={{ justifyContent: `flex-end` }}>
          <Button
            variant="primary"
            className="ml-1"
            onClick={handleDialogClose}
          >
            Ok
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
