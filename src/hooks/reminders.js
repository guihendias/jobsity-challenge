import { createContext, useContext, useEffect, useState } from "react";

import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

const VS_API_KEY = "K7CGQ2KWTU85Z2FNZQU3YQ9QG";

const RemindersContext = createContext({});

function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const loadWeatherData = async (queryDate, city) => {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${queryDate}/${queryDate}?unitGroup=metric&key=${VS_API_KEY}&contentType=json`;
    const response = await fetch(url);
    const data = await response.json();

    return data.days.find((w) => dayjs(w.datetime).isSame(queryDate));
  };

  function fetchReminders() {
    const storagedReminders =
      localStorage.getItem("@jobsity-calendar/reminders") || "[]";

    const parsedReminders = JSON.parse(storagedReminders);

    const remindersWithIcons = parsedReminders.map((reminder) => {
      const date = reminder.date;
      const month = String(date.month).padStart(2, "0");
      const day = String(date.day).padStart(2, "0");
      const year = date.year;

      const queryDate = `${year}-${month}-${day}`;
      const city = "indaiatuba";

      // const weatherDayData = await loadWeatherData(queryDate, city);
      const weatherDayData = "rain";

      return { ...reminder, icon: weatherDayData.icon };
    });

    setReminders(remindersWithIcons);
  }

  function updateReminder(reminder) {
    const updatedReminders = reminders.map((r) => {
      if (r.id === reminder.id) {
        return reminder;
      }

      return r;
    });

    setReminders(updatedReminders);
    localStorage.setItem(
      "@jobsity-calendar/reminders",
      JSON.stringify(updatedReminders)
    );
  }

  function deleteReminder(id) {
    const remindersWithoutDeleted = reminders.filter((r) => r.id !== id);

    setReminders(remindersWithoutDeleted);
    localStorage.setItem(
      "@jobsity-calendar/reminders",
      JSON.stringify(remindersWithoutDeleted)
    );
  }

  function createReminder(reminder) {
    const reminderWithId = { ...reminder, id: uuid() };
    const remindersWithAdded = [...reminders, reminderWithId];

    setReminders(remindersWithAdded);
    localStorage.setItem(
      "@jobsity-calendar/reminders",
      JSON.stringify(remindersWithAdded)
    );
  }

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        updateReminder,
        deleteReminder,
        createReminder,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
}

function useReminders() {
  const context = useContext(RemindersContext);

  return context;
}

export { RemindersProvider, useReminders };
