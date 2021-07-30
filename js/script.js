let tasks;
if (localStorage.getItem("tasks") == null) {
  tasks = {
    active: [],
    completed: [],
    activeSequence: 0,
  };
  localStorage.setItem("tasks", JSON.stringify(tasks));
} else {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

Object.defineProperty(tasks, "all", {
  writable: true,
  enumerable: true,
  configurable: true,
  value: [...tasks.completed, ...tasks.active],
});

window.addEventListener("load", () => {
  const form = document.getElementById("form");
  const textTodo = document.getElementById("text-todo");
  const label = textTodo.previousElementSibling;
  const options = document.getElementById("options");
  const optionButtons = [...document.querySelectorAll(".options__button")];
  const clearButton = document.getElementById("clear-button");
  const todoList = document.getElementById("list");
  
  createTask = (taskName) => {
    const task = {
      id: tasks.activeSequence,
      taskName: taskName,
      type: "active",
    };
    tasks.active.push(task);
    tasks.all.push(task);
    tasks.activeSequence++;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    return task;
  };

  const setTaskHTML = (task, fragment) => {
    const element = document.createElement("li");
    element.classList.add("list__item");
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("list__img-container");
    const p = document.createElement("p");
    p.textContent = task.taskName;
    p.classList.add("list__text");
    const imgCross = document.createElement("img");
    imgCross.src = "assets/img/icon-cross.svg";
    imgCross.alt = "cross-icon";
    imgCross.classList.add("list__img-cross");

    const idValue = document.createElement("input");
    idValue.type = "hidden";
    idValue.value = task.id;

    const typeTask = document.createElement("input");
    typeTask.type = "hidden";
    typeTask.value = task.type;

    if (task.type == "completed") {
      imgContainer.classList.add("list__img-container--complete");
      p.classList.add("list__text--complete");
    }

    element.appendChild(imgContainer);
    element.appendChild(p);
    element.appendChild(imgCross);
    element.appendChild(idValue);
    element.appendChild(typeTask);
    fragment.appendChild(element);
  };

  const getTasks = (type) => {
    Object.defineProperty(tasks, "all", {
      writable: true,
      enumerable: true,
      configurable: true,
      value: [...tasks.completed, ...tasks.active],
    });
    const fragment = document.createDocumentFragment();

    tasks[type].forEach((task) => {
      setTaskHTML(task, fragment);
    });

    return fragment;
  };

  todoList.insertBefore(getTasks("all"), todoList.lastElementChild);
  
  todoList.lastElementChild.firstElementChild.textContent = `${tasks["active"].length} items left`;

 
  options.addEventListener("click", (e) => {
    if (e.target.classList.contains("options__button")) {
      optionButtons.forEach((button) => {
        button.classList.remove("options__button--active");
      });
      e.target.classList.add("options__button--active");
     
      const listItems = [
        ...document.querySelectorAll("#list .list__item"),
      ].slice(0, this.length - 1);

      
      listItems.forEach((task) => {
        task.remove();
      });

     
      const fragment = getTasks(e.target.value);
      
      todoList.insertBefore(fragment, todoList.lastElementChild);
      
      let type = "";
      e.target.value == "completed" ? (type = "completed") : (type = "active");

      todoList.lastElementChild.firstElementChild.textContent = `${tasks[type].length} items left`;
    }
  });

  
  form.addEventListener("submit", (e) => {    
    e.preventDefault();
    
    if (textTodo.value != "") {
      
      const task = createTask(textTodo.value);
      let type = optionButtons.filter((option) =>
        option.classList.contains("options__button--active")
      );
      const fragment = document.createDocumentFragment();
      setTaskHTML(task, fragment);
      todoList.insertBefore(fragment, todoList.lastElementChild);

      type[0].value == "completed" ? (type = "completed") : (type = "active");

      todoList.lastElementChild.firstElementChild.textContent = `${tasks[type].length} items left`;

      
      textTodo.value = "";
      textTodo.classList.remove("todo__input--active");
      label.classList.remove("todo__placeholder--active");
    }
  });

  
  textTodo.addEventListener("input", (e) => {
    
    if (e.target.value == "") {
      e.target.classList.remove("todo__input--active");
      label.classList.remove("todo__placeholder--active");
    } else {
      e.target.classList.add("todo__input--active");
      label.classList.add("todo__placeholder--active");
    }
  });

  
  todoList.addEventListener("click", (e) => {
    const type = optionButtons.filter((option) =>
      option.classList.contains("options__button--active")
    );

    
    let typeTask = type[0].value;
    if (e.target.classList.contains("list__img-cross")) {
      let typeTask = type[0].value;
      const element = e.target.parentElement;

      
      const task = {
        id: parseInt(element.lastElementChild.previousElementSibling.value),
        taskName: element.firstElementChild.nextElementSibling.textContent,
        type: element.lastElementChild.value,
      };

      element.remove();
      
      if (typeTask == "all") {
        if (tasks.active.some((item) => item.id == task.id)) {
          typeTask = "active";
        } else {
          typeTask = "completed";
        }
      }
      
      const idx = tasks.active.findIndex((item) => item.id == task.id);
      tasks[typeTask].splice(idx, 1);

      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    if (e.target.classList.contains("list__img-container")) {
      
      const element = e.target.parentElement;
      const task = {
        id: parseInt(element.lastElementChild.previousElementSibling.value),
        taskName: element.firstElementChild.nextElementSibling.textContent,
        type: element.lastElementChild.value,
      };

      
      if (tasks.active.some((item) => item.id == task.id)) {
        const idx = tasks.active.findIndex((item) => item.id == task.id);
        tasks.active.splice(idx, 1);
        task.type = "completed";
        element.lastElementChild.value = "completed";
        tasks.completed.push(task);
      } else {
        const idx = tasks.completed.findIndex((item) => item.id == task.id);

        tasks.completed.splice(idx, 1);
        task.type = "active";
        element.lastElementChild.value = "active";
        tasks.active.push(task);
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));

      
      e.target.classList.toggle("list__img-container--complete");
      e.target.nextElementSibling.classList.toggle("list__text--complete");
    }
    
    typeTask == "completed"
      ? (todoList.lastElementChild.firstElementChild.textContent = `${tasks["completed"].length} items left`)
      : (todoList.lastElementChild.firstElementChild.textContent = `${tasks["active"].length} items left`);
  });

  
  clearButton.addEventListener("click", () => {
    const listItems = [...todoList.querySelectorAll("li.list__item")].filter(
      (item) => item.lastElementChild.value == "completed"
    );

    listItems.forEach((task) => {
      task.remove();
    });

    tasks.completed.splice(0, tasks.completed.length);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
});
