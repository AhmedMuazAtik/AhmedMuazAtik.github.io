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
      listItem.textContent = `${task.text} - Due: ${task.dueDate || 'No due date'}`;
      listItem.className = task.completed ? "completed" : (task.timeout ? "timeout" : "");

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
    const newTask = {
      text: taskText,
      completed: false,
      dueDate: dueDate,
    };

    // Convert due date to milliseconds
    const dueTime = new Date(dueDate).getTime();

    // Calculate time remaining
    const currentTime = new Date().getTime();
    const timeRemaining = dueTime - currentTime;

    // Schedule an alert when the time is up
    setTimeout(() => {
      alert(`Time is up for task: ${newTask.text}`);
      markAsTimedOut(newTask);
    }, timeRemaining);

    // Schedule an alert 1 minute before the due time
    const oneMinuteBefore = timeRemaining - 60000; // 60,000 milliseconds = 1 minute
    if (oneMinuteBefore > 0) {
      setTimeout(() => {
        alert(`One minute left for task: ${newTask.text}`);
      }, oneMinuteBefore);
    }

    tasks.push(newTask);
    renderTasks();
    taskInput.value = "";
    taskDate.value = "";
  } else {
    // Alert the user that a due date is required
    alert("Please enter a due date for the task.");
  }
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
function markAsTimedOut(task) {
  // Move the task to history with the status "Timed Out"
  task.timeout = true;
  task.status = "Timed Out";
  history.push(task);

  // Apply animation for scoring out the task
  const taskListItems = document.querySelectorAll('#taskList li');
  const taskIndex = tasks.findIndex((t) => t === task);
  if (taskIndex !== -1) {
    const taskListItem = taskListItems[taskIndex];
    taskListItem.classList.add('timedOut', 'scoreOutAnimation');
  }

  // Remove the task from the current tasks after animation completes
  setTimeout(() => {
    const taskIndex = tasks.findIndex((t) => t === task);
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
