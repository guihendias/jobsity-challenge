import React, { useEffect } from "react";

import { Grid } from "@material-ui/core";
import { CalendarHeader, CalendarDay } from "components";
import { useReminders } from "hooks/reminders";
import PropTypes from "prop-types";
import { getCurrentMonthCalendarizableDays } from "utils/dateUtils";

import { getRowHeightFromCurrentMonth } from "./helpers";

const CalendarGrid = ({ date = new Date() }) => {
  const calendarDays = getCurrentMonthCalendarizableDays(date);
  const gridRowHeight = getRowHeightFromCurrentMonth(calendarDays?.length);

  const { reminders } = useReminders();
  const [remindersByDate, setRemindersByDate] = React.useState([]);

  useEffect(() => {
    setRemindersByDate(
      reminders.reduce((acc, reminder) => {
        const { date } = reminder;

        if (!acc[date]) {
          acc[date] = [];
        }

        acc[date].push(reminder);

        return acc;
      }, {})
    );
  }, [reminders]);

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={0}
    >
      <CalendarHeader />
      {calendarDays?.map((day) => {
        const { number, month, year } = day;
        const date = `${String(month).padStart(2, "0")}/${String(
          number
        ).padStart(2, "0")}/${year}`;

        const remindersArr = remindersByDate[date];
        return (
          <CalendarDay
            key={`${day.number}.${day.month}.${day.year}`}
            day={day.number}
            month={day.month}
            year={day.year}
            isEnabled={day.isEnabled}
            height={gridRowHeight}
            reminders={remindersArr}
          />
        );
      })}
    </Grid>
  );
};

CalendarGrid.propTypes = {
  date: PropTypes.instanceOf(Object).isRequired,
};

export default CalendarGrid;
