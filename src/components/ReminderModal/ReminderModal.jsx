import { useEffect, useRef, useState } from "react";

import {
  Box,
  Modal,
  TextField,
  Typography,
  Container,
  Button,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import dayjs from "dayjs";
import { useReminders } from "hooks/reminders";

export function ReminderModal({ open, date, selectedReminder, onClose }) {
  const [reminder, setReminder] = useState("");

  const [selectedReminderDate, setSelectedReminderDate] = useState(() => {
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    const year = date.year;

    return `${year}-${month}-${day}`;
  });

  console.log(selectedReminderDate);

  const [city, setCity] = useState("");
  const [time, setTime] = useState("");

  const { createReminder, updateReminder, deleteReminder } = useReminders();

  function handleSubmit(e) {
    e.preventDefault();

    const newDate = dayjs(selectedReminderDate).format("MM/DD/YYYY");

    const newReminder = {
      id: selectedReminder?.id ?? null,
      reminder: reminder,
      city: city,
      time: time,
      date: newDate,
    };

    if (selectedReminder) {
      updateReminder(newReminder);
    } else {
      createReminder(newReminder);
    }

    handleClose();
  }

  function handleClose() {
    setReminder("");
    setCity("");
    setTime("");
    setSelectedReminderDate("");
    onClose();
  }

  useEffect(() => {
    if (selectedReminder) {
      const { reminder, city, time } = selectedReminder;

      setReminder(reminder);
      setCity(city);
      setTime(time);
      setSelectedReminderDate(
        dayjs(selectedReminder.date).format("YYYY-MM-DD")
      );
    }
  }, [selectedReminder]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onBackdropClick={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-content">
        <button id="close-btn" onClick={handleClose}>
          <Close />
        </button>

        <Typography id="modal-modal-title" variant="h4" component="h2">
          Add reminder
        </Typography>
        <Typography
          id="modal-modal-description"
          color="textSecondary"
          sx={{ mt: 2 }}
        >
          Set a reminder for a specific date and time below
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            name="reminder"
            label="Reminder"
            variant="outlined"
          />
          {selectedReminder && (
            <TextField
              value={selectedReminderDate}
              onChange={(e) => setSelectedReminderDate(e.target.value)}
              name="selectedReminderDate"
              label="Date"
              variant="outlined"
              type="date"
            />
          )}
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            name="city"
            label="City"
            variant="outlined"
          />
          <TextField
            value={time}
            onChange={(e) => setTime(e.target.value)}
            name="time"
            label="Time"
            variant="outlined"
            type="time"
          />

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>

          {selectedReminder && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                deleteReminder(selectedReminder.id);
                handleClose();
              }}
            >
              Delete
            </Button>
          )}
        </form>
      </Box>
    </Modal>
  );
}
