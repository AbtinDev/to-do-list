// ------ variables ------
const itemForm = document.getElementById("item-form");
const inputInvalid = document.getElementById("input-invalid");
const itemList = document.getElementById("item-list");
const itemsClear = document.getElementById("items-clear");
const filter = document.getElementById("filter");
const itemInput = document.getElementById("item-input");
const formBtn = document.querySelector("button");
let isEditMode = false;

// ------ Functions ------
function loadItemsFromStorage() {
  firstUse();

  let items = localStorage.getItem("items");
  items = JSON.parse(items);
  if (items) {
    items.forEach((item) => addItemToDOM(item.Value, item.Color));
  }

  UIcheck();
}

function firstUse() {
  const firstItems = new Array(
    { Value: "First item", Color: null },
    { Value: "Second item", Color: null },
    { Value: "High priority", Color: "red" },
    { Value: "medium priority", Color: "orange" },
    { Value: "Low priority", Color: "green" }
  );

  if (localStorage.getItem("firstUse") === null) {
    firstItems.forEach((item) => addItemToStorage(item.Value, item.Color));

    localStorage.setItem("firstUse", "used");
  }
}

function clickOnItem(e) {
  const parent = e.target.parentElement.parentElement;

  // remove
  if (e.target.classList.contains("bi-x")) {
    parent.remove();
    removeFromStorage(parent.textContent);

    // color
  } else if (e.target.classList.contains("text-danger")) {
    if (parent.classList.contains("bg-danger-subtle")) {
      parent.className = "list-item";
      addColorToStorage(parent);
    } else {
      parent.className = "list-item bg-danger-subtle";
      addColorToStorage(parent);
    }
  } else if (e.target.classList.contains("text-warning")) {
    if (parent.classList.contains("bg-warning-subtle")) {
      parent.className = "list-item";
      addColorToStorage(parent);
    } else {
      parent.className = "list-item bg-warning-subtle";
      addColorToStorage(parent);
    }
  } else if (e.target.classList.contains("text-success")) {
    if (parent.classList.contains("bg-success-subtle")) {
      parent.className = "list-item";
      addColorToStorage(parent);
    } else {
      parent.className = "list-item bg-success-subtle";
      addColorToStorage(parent);
    }
  } else editItem(e.target);

  UIcheck();
}

function addItem(e) {
  e.preventDefault();

  const inputValue = itemInput.value;

  if (inputValue === "") {
    inputInvalid.innerText = "please add an item.";
  } else {
    inputInvalid.innerText = "";

    if (isEditMode) {
      const itemToEdit = itemList.querySelector(".edit-mode");
      removeFromStorage(itemToEdit.textContent);
      itemToEdit.remove();
      formBtn.classList.replace("btn-primary", "btn-dark");
      formBtn.innerHTML = "<i class='bi bi-plus'></i> Add item";
      isEditMode = false;
    } else {
      if (isItemExist(inputValue)) {
        inputInvalid.innerText = "That item is already exist!";
        return;
      } else {
        inputInvalid.innerText = "";
      }
    }

    addItemToDOM(inputValue);
    itemInput.value = "";

    addItemToStorage(inputValue);
    UIcheck();
  }
}

function isItemExist(item) {
  const itemFromStorage = JSON.parse(localStorage.getItem("items"));

  if (itemFromStorage) {
    return itemFromStorage.includes(item);
  }
}

function addItemToDOM(inputValue, color = null) {
  const li = document.createElement("li");
  li.classList.add("list-item", color);
  li.textContent = inputValue;

  switch (color) {
    case "red":
      li.classList.add("bg-danger-subtle");
      break;
    case "orange":
      li.classList.add("bg-warning-subtle");
      break;
    case "green":
      li.classList.add("bg-success-subtle");
      break;
  }

  const container = document.createElement("div");
  container.className = "d-flex btn-clr";

  const circleRed = document.createElement("i");
  circleRed.className = "bi bi-circle-fill pe-1 text-danger";

  const circleOrang = document.createElement("i");
  circleOrang.className = "bi bi-circle-fill pe-1 text-warning";

  const circleGreen = document.createElement("i");
  circleGreen.className = "bi bi-circle-fill pe-3 text-success";

  const icon = document.createElement("i");
  icon.className = "bi bi-x fs-5 text-danger";

  container.appendChild(circleRed);
  container.appendChild(circleOrang);
  container.appendChild(circleGreen);
  container.appendChild(icon);
  li.appendChild(container);
  itemList.appendChild(li);
}

function addItemToStorage(value, color = null) {
  let itemToStorage;

  if (localStorage.getItem("items") === null) {
    itemToStorage = [];
  } else {
    itemToStorage = JSON.parse(localStorage.getItem("items"));
  }

  itemToStorage.push({ Value: value, Color: color });

  localStorage.setItem("items", JSON.stringify(itemToStorage));
}

function addColorToStorage(li) {
  if (li.classList.contains("bg-danger-subtle")) {
    let items = localStorage.getItem("items");
    items = JSON.parse(items);

    let temp = items.filter((i) => i.Value === li.textContent);
    temp = temp[0];
    temp.Color = "red";

    localStorage.setItem("items", JSON.stringify(items));
  } else if (li.classList.contains("bg-warning-subtle")) {
    let items = localStorage.getItem("items");
    items = JSON.parse(items);

    let temp = items.filter((i) => i.Value === li.textContent);
    temp = temp[0];
    temp.Color = "orange";

    localStorage.setItem("items", JSON.stringify(items));
  } else if (li.classList.contains("bg-success-subtle")) {
    let items = localStorage.getItem("items");
    items = JSON.parse(items);

    let temp = items.filter((i) => i.Value === li.textContent);
    temp = temp[0];
    temp.Color = "green";

    localStorage.setItem("items", JSON.stringify(items));
  } else {
    let items = localStorage.getItem("items");
    items = JSON.parse(items);

    let temp = items.filter((i) => i.Value === li.textContent);
    temp = temp[0];
    temp.Color = "null;";

    localStorage.setItem("items", JSON.stringify(items));
  }
}

function removeFromStorage(item) {
  let items = localStorage.getItem("items");
  items = JSON.parse(items);

  items = items.filter((i) => i.Value !== item);
  localStorage.setItem("items", JSON.stringify(items));
}

function clearAll() {
  itemList.innerHTML = "";
  localStorage.removeItem("items");
  UIcheck();
}

function UIcheck() {
  if (!itemList.childElementCount) {
    filter.style.display = "none";
    itemsClear.style.display = "none";
  } else {
    filter.style.display = "block";
    itemsClear.style.display = "block";
  }
}

function filterItems(e) {
  const inputFilter = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.includes(inputFilter)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function editItem(item) {
  //turnOnEditMode
  isEditMode = true;

  // check other items
  itemList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));

  // change text color
  item.classList.add("edit-mode");

  // return value in edit box
  itemInput.value = item.textContent;

  // change btn
  formBtn.classList.replace("btn-dark", "btn-primary");
  formBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update item";
}

// ------ Events ------
itemForm.addEventListener("submit", addItem);
itemsClear.addEventListener("click", clearAll);
itemList.addEventListener("click", clickOnItem);
filter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", loadItemsFromStorage);
