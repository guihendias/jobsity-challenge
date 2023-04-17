import React from "react";

import { RemindersProvider } from "./reminders";

function AppProvider({ children }) {
  return <RemindersProvider>{children}</RemindersProvider>;
}

export { AppProvider };
