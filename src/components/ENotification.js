import React, { useContext } from "react";
import { eNotificationContext } from "./context/GameContext";
import { AnimatePresence, motion } from "framer-motion";

const ENotification = () => {
  const [eNotification] = useContext(eNotificationContext);
  const backgroundColor = eNotification.colour
    ? eNotification.colour
    : "#11ff11";
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={"noti"}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: backgroundColor }}
        exit={{ y: -60 }}
        className="e-modal-container"
      >
        <div className="e-modal">
          <h1>{eNotification ? eNotification.msg : "Summer"}</h1>
          {/* <button>X</button> */}
          {/* <button onClick={eNotificationHandler("No Noti")}>X</button> */}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ENotification;
