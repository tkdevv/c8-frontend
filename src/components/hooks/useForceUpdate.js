import { useState } from "react";

const useForceUpdate = () => {
  const [, forceUpdateHandler] = useState(0);
  const forceUpdate = () => forceUpdateHandler((n) => n + 1);
  return forceUpdate;
};

export default useForceUpdate;
