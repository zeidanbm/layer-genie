import { Heading, Progressbar } from "react-uxp-spectrum";
import ExportRules from "./exportRules";
import ImportRules from "./importRules";
import ImportGroups from "./importGroups";
import { useContext } from "react";
import { StoreContext } from "../store";

const InitialSetup = () => {
  const { state } = useContext(StoreContext);
  return (
    <>
      <div className="flex items-center space-x-4">
        <Heading className="pb-2" size="S">
          Initial Setup
        </Heading>
        {state.progress ? (
          <Progressbar
            className="mt-2"
            max={100}
            value={state.progress}
          ></Progressbar>
        ) : null}
      </div>
      <div className="flex flex-col space-y-2.5 space-x-0 xs:flex-row xs:space-x-4 xs:space-y-0">
        <ExportRules />
        <ImportRules />
        <ImportGroups />
      </div>
    </>
  );
};

export default InitialSetup;
