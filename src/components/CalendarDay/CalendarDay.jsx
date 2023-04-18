import { useState } from "react";

import { Card, CardContent, Grid } from "@material-ui/core";
import { ReminderModal } from "components";
import { useReminders } from "hooks/reminders";
import { Cloud, CloudRain, Sun } from "phosphor-react";
import PropTypes from "prop-types";

const CalendarDay = ({
  day,
  month,
  year,
  height,
  isEnabled = false,
  reminders,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);

  const Icon = ({ name }) => {
    if (name === "rain") {
      return <CloudRain />;
    } else if (name === "cloudy") {
      return <Cloud />;
    } else {
      return <Sun />;
    }
  };

  return (
    <Card
      variant="outlined"
      style={{ height }}
      className={
        isEnabled
          ? "calendar-day-card"
          : "calendar-day-card calendar-day-card--disabled"
      }
      onClick={() => !open && setOpen(true)}
    >
      <CardContent className="calendar-day-content">
        <Grid item>
          <div className="calendar-day-header">
            <p className="calendar-day-text">{day}</p>
          </div>
        </Grid>
        <Grid item>
          <div className="calendar-day-reminders">
            {reminders?.map((reminder) => (
              <div
                className="calendar-day-reminder"
                key={reminder.time}
                onClick={() => setSelectedReminder(reminder)}
              >
                {reminder.reminder}
                <Icon name={reminder.icon} />
              </div>
            ))}
          </div>
        </Grid>
      </CardContent>

      {open && (
        <ReminderModal
          open={open}
          date={{ day, month, year }}
          selectedReminder={selectedReminder}
          onClose={() => {
            setSelectedReminder(null);
            setOpen(false);
          }}
        />
      )}
    </Card>
  );
};

CalendarDay.propTypes = {
  day: PropTypes.number.isRequired,
  month: PropTypes.string,
  year: PropTypes.string,
  height: PropTypes.string.isRequired,
  isEnabled: PropTypes.bool,
};

export default CalendarDay;
