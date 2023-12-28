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
      cell2.textContent = task.timeout ? "Time Out" : "";
    });

    // Save history to local storage
    saveHistory();
  }

  // Function to add a new task
  window.addTask = function () {
    const taskText = taskInput.value.trim();
    const dueDate = taskDate.value;

    if (taskText !== "") {
      const newTask = {
        text: taskText,
        completed: false,
        dueDate: dueDate,
      };
      tasks.push(newTask);
      renderTasks();
      taskInput.value = "";
      taskDate.value = "";
    }
  };

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
