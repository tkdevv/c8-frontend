import React, { useContext } from "react";
import { eNotificationContext } from "./context/GameContext";
import { AnimatePresence, motion } from "framer-motion";

const ENotification = () => {
  const [eNotification] = useContext(eNotificationContext);
  const noNotification = "No Noti";
  const notificationStyles = !eNotification.colour
    ? { backgroundColor: "#fff", color: "#000" }
    : eNotification.colour === "red"
    ? { backgroundColor: "#bb0000", color: "#fff" }
    : { backgroundColor: "#ff7171", color: "#fff" };

  return (
    <AnimatePresence exitBeforeEnter>
      {eNotification && eNotification.msg !== noNotification && (
        <motion.div
          key={"noti"}
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          style={notificationStyles}
          exit={{ y: -60 }}
          className="e-modal-container"
        >
          <div className="e-modal">
            <h1 style={{ color: notificationStyles.color }}>
              {eNotification.msg}
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ENotification;
