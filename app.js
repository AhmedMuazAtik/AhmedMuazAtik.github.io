document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const historyTable = document.getElementById("historyTable");

  // Check for existing tasks and history in local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let history = JSON.parse(localStorage.getItem("history")) || [];

  // Render existing tasks and history
  renderTasks();
  renderHistory();

  // Function to show task history
  window.showHistory = function () {
  // Your implementation to show task history
  // For example, you can toggle the visibility of the history container
  const historyContainer = document.getElementById("historyContainer");
  historyContainer.style.display = "block"; // Adjust this based on your styling logic
  };

  // Function to clear all tasks
  window.clearAll = function () {
    // Clear the tasks array
    tasks = [];
    // Render the updated tasks
    renderTasks();
  };

  // Function to clear the history
  window.clearHistory = function () {
    // Clear the history array
    history = [];
    // Render the updated history
    renderHistory();
  };

// Function to render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(function (task, index) {
    const listItem = document.createElement("li");

    if (!task) {
      return; // Skip rendering if the task is null
    }

    listItem.textContent = `${task.text} - Due: ${task.dueDate || 'No due date'}`;
    listItem.className = task.completed ? "completed" : (task.timeout ? "timedOut" : "");

    // Add buttons for marking as complete and deleting
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteTask(index);
    };

    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.onclick = function () {
      toggleComplete(index);
    };

    listItem.appendChild(completeButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });

  // Save tasks to local storage
  saveTasks();
}

  // Function to render history
  function renderHistory() {
    historyTable.innerHTML = "";
    history.forEach(function (task) {
      const row = historyTable.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);

      cell1.textContent = `${task.text} - ${task.status || 'No status'}`;
      cell2.textContent = task.timeout ? "" : "";
    });

    // Save history to local storage
    saveHistory();
  }

// Declare newTask outside the addTask function
let newTask = null;

// Function to add a new task
window.addTask = function () {
  const taskText = taskInput.value.trim();
  const dueDate = taskDate.value;

  // Check if task text is empty
  if (taskText === "") {
    alert("Please enter a task description.");
    return;
  }

  // Check if due date is set
  if (dueDate) {
    // Check if the due date is in the future
    const currentDate = new Date();
    const selectedDate = new Date(dueDate);

    if (selectedDate <= currentDate) {
      alert("Please select a future date for the task.");
      return;
    }

    // Assign a value to the existing newTask variable
    newTask = {
      text: taskText,
      completed: false,
      dueDate: dueDate,
    };

    // Convert due date to milliseconds
    const dueTime = selectedDate.getTime();

    // Calculate time remaining
    const currentTime = currentDate.getTime();
    const timeRemaining = dueTime - currentTime;

    // Schedule an alert when the time is up
    setTimeout(() => {
      alert(`Time is up for task: ${newTask.text}`);
      markAsTimedOut(); // No need to pass newTask as it's declared in the outer scope
    }, timeRemaining);

    // Schedule an alert 1 minute before the due time
    const oneMinuteBefore = timeRemaining - 60000; // 60,000 milliseconds = 1 minute
    if (oneMinuteBefore > 0) {
      setTimeout(() => {
        alert(`One minute left for task: ${newTask.text}`);
      }, oneMinuteBefore);
    }
  } else {
    // Alert the user that a due date is required
    alert("Please enter a due date for the task.");
    // Set newTask to null when there's no due date
    newTask = null;
    return;
  }
  // Rest of your code...
  tasks.push(newTask);
  renderTasks();
  taskInput.value = "";
  taskDate.value = "";
};

// Function to show a notification
function showNotification(message, task) {
  // Check if the Notification API is supported
  if ("Notification" in window) {
    // Request permission to show notifications
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        // Display the notification
        new Notification("Task Notification", { body: message });
      }
    });
  }
}

// Function to mark a task as timed out
function markAsTimedOut() {
  if (!newTask) {
    return; // Handle the case when newTask is null
  }

  // Move the task to history with the status "Timed Out"
  newTask.timeout = true;
  newTask.status = "Timed Out";
  history.push(newTask);

  // Apply animation for scoring out the task
  const taskListItems = document.querySelectorAll('#taskList li');
  const taskIndex = tasks.findIndex((t) => t === newTask);
  if (taskIndex !== -1) {
    const taskListItem = taskListItems[taskIndex];
    taskListItem.classList.add('timedOut', 'scoreOutAnimation');
  }

  // Remove the task from the current tasks after animation completes
  setTimeout(() => {
    const taskIndex = tasks.findIndex((t) => t === newTask);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      renderTasks();
      renderHistory();
    }
  }, 500); // Adjust the time based on your animation duration
}

      tasks.push(newTask);
      renderTasks();
      taskInput.value = "";
      taskDate.value = "";

  // Function to delete a task
  function deleteTask(index) {
    // Move the task to history with the status "Deleted"
    const deletedTask = tasks.splice(index, 1)[0];
    deletedTask.status = "Deleted";
    history.push(deletedTask);

    // Render tasks and history
    renderTasks();
    renderHistory();
  }

  // Function to mark/unmark a task as complete
  function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;

    // If completed, move the task to history with the status "Completed"
    if (tasks[index].completed) {
      const completedTask = tasks.splice(index, 1)[0];
      completedTask.status = "Completed";
      history.push(completedTask);
    }

    // Render tasks and history
    renderTasks();
    renderHistory();
  }


  // Function to save tasks to local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to save history to local storage
  function saveHistory() {
    localStorage.setItem("history", JSON.stringify(history));
  }
});
