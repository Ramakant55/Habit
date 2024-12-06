import React, { useState } from "react";

const Month = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Test = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedHabitIndex, setSelectedHabitIndex] = useState(null);

  const daysInMonth = Month(currentYear, currentMonth);

  const addHabit = () => {
    if (newHabit !== "") {
      setHabits([
        ...habits,
        {
          name: newHabit,
          progress: 0,
          completedDays: new Array(daysInMonth.length).fill(false),
          isActive: false, // Track whether the habit is active
        },
      ]);
      setNewHabit("");
    }
  };

  const toggleDayCompletion = (habitIndex, dayIndex) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) => {
        if (i === habitIndex) {
          const updatedDays = [...habit.completedDays];
          updatedDays[dayIndex] = !updatedDays[dayIndex];

          const completedCount = updatedDays.filter((day) => day).length;
          const progress = Math.round((completedCount / daysInMonth.length) * 100);

          return { ...habit, completedDays: updatedDays, progress };
        }
        return habit;
      })
    );
  };

  const toggleHabitActive = (index) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, i) =>
        i === index ? { ...habit, isActive: !habit.isActive } : habit
      )
    );
    setSelectedHabitIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <h1 className="mb-5 font-bold underline text-center text-3xl">Habit Tracker</h1>

      {/* Add Habit Input */}
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Add a Habit"
          className="p-3 border-2 border-black rounded-2xl"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button
          onClick={addHabit}
          className="ml-5 rounded-2xl p-2 border-2 border-black"
        >
          Add Habit
        </button>
      </div>

      {/* Habit List Section */}
      <div className="border-2 border-black rounded-2xl w-60 p-2 mb-5 mx-auto">
        <h1 className="font-bold underline text-center mb-3">Habit List</h1>
        <ul>
          {habits.map((habit, index) => (
            <li
              key={index}
              className={`p-2 flex items-center justify-between cursor-pointer`}
              onClick={() => setSelectedHabitIndex(index)}
            >
              <input
                type="checkbox"
                checked={habit.isActive}
                onChange={() => toggleHabitActive(index)}
                onClick={(e) => e.stopPropagation()} // Prevent parent click
              />
              <span>{habit.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Habit Details */}
      {selectedHabitIndex !== null &&
        habits[selectedHabitIndex]?.isActive && (
          <div className="mb-10 border-2 border-black rounded-2xl p-5">
            <h2 className="text-xl font-bold underline text-center">
              {habits[selectedHabitIndex].name}
            </h2>

            {/* Calendar View */}
            <div className="grid grid-cols-7 gap-2 my-5">
              {daysInMonth.map((date, dayIndex) => (
                <div key={dayIndex} className="text-center">
                  <p className="text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                  <input
                    type="checkbox"
                    className="mx-auto"
                    checked={habits[selectedHabitIndex].completedDays[dayIndex]}
                    onChange={() => toggleDayCompletion(selectedHabitIndex, dayIndex)}
                  />
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div>
              <label className="block mb-2">Progress:</label>
              <div className="relative w-full h-4 bg-gray-300 rounded">
                <div
                  className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
                  style={{ width: `${habits[selectedHabitIndex].progress}%` }}
                />
              </div>
              <p className="text-center mt-2">
                {habits[selectedHabitIndex].progress}% of the month completed
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Test;
