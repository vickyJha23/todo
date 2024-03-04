const form = document.querySelector(".todo-form");
const alrt = document.querySelector(".alert");
const inputTodo = document.querySelector("#inputTodo");
const todoContainer = document.querySelector(".todo-container");
const todoList = document.querySelector(".todo-list");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");
let editElement;
let editFlag = false;
let editID = "";
window.addEventListener("DOMContentLoaded", setupItems);
window.addEventListener("load", setBackToDefault);
form.addEventListener("submit", function (e){
  e.preventDefault();
  const inputValue = inputTodo.value;
//   console.log(`input value is: ${inputValue}`);
  const divID = new Date().getTime().toString();
//   console.log(`div id is : ${divID}`);
  if (inputValue !== "" && !editFlag) {
    const divElement = document.createElement("div");
    const attr = document.createAttribute("data-id");
    attr.value = divID;
    divElement.setAttributeNode(attr);
    divElement.classList.add("todo-item");
    divElement.innerHTML = `<p class="title">${inputValue}</p> 
       <div class="btn-container">
          <button class = "edit-btn">
             <i class="fa fa-edit"></i>
          </button>
          <button class="delete-btn">
              <i class="fa fa-trash"></i>
          </button>
       </div>`;
       todoList.appendChild(divElement);
       todoContainer.classList.add("show-todo");
       const editBtn = divElement.querySelector(".edit-btn");
       const  deleteBtn = divElement.querySelector(".delete-btn");
       editBtn.addEventListener("click", editItems);
       deleteBtn.addEventListener("click", deleteItems)
       displayAlert("New item added", "success");
       addToLocalStorage(divID, inputValue);
       setBackToDefault();
  }
  else if(!inputValue !== "" && editFlag){
      editElement.innerHTML = inputValue;
       displayAlert("value changed", "success");
       editLocalStorage(editID, inputValue);
      setBackToDefault();
  }
  else{
    displayAlert("Please write something", "danger")
   };
});
clearBtn.addEventListener("click", () => {
    console.log("working");
    const items = document.querySelectorAll(".todo-item");
    items.forEach((item) => {
          todoList.removeChild(item);
    });
    todoContainer.classList.remove("show-todo");
    displayAlert("all items deleted", "danger");
    setBackToDefault();
    localStorage.removeItem("todoData");
});
function displayAlert(text, action){
      alrt.innerHTML = `${text}`;
      alrt.classList.add(`alert-${action}`);
      setTimeout(() => {
         alrt.innerHTML = "";
        alrt.classList.remove(`alert-${action}`); 
      }, 2000)
};
function editItems(e){
     const currentElement = e.currentTarget.parentElement.parentElement;
     editElement = e.currentTarget.parentElement.previousElementSibling;
     inputTodo.value = editElement.innerHTML;
     editFlag = true;
     editID = currentElement.dataset.id;
     submitBtn.innerHTML = "edit";
}
function deleteItems(e){
     const element = e.currentTarget.parentElement.parentElement; 
     const id = element.dataset.id;
     todoList.removeChild(element);
     //this children property return a HTML COLLECTION 
     if(todoList.children.length === 0){
      //   console.log("Hi I worked");
        todoContainer.classList.remove("show-todo");
     }
     displayAlert("item deleted", "danger");
     setBackToDefault();
     removeFromLocalStorage(id);
}
function setBackToDefault(){
   inputTodo.value = "";
   editFlag = false;
   editID = "";
   submitBtn.innerHTML = "add";
}
//**************Local Storage ********************/
// used to create a storage on the browser..........
function addToLocalStorage(id, value){
   //value that i am receiving from this add item is data-id and input value....  
   // the concise of declaring a object where the name should be same as of variable...
   const todoData = {id, value};
   let todoItems = getLocalStorage(); 
   todoItems.push(todoData); 
   localStorage.setItem("todoData", JSON.stringify(todoItems));
}
function getLocalStorage(){
   // ternary operator.....
   return localStorage.getItem("todoData")
   ? JSON.parse(localStorage.getItem("todoData"))
   : [];
}
function removeFromLocalStorage(id){
    let todoItems = getLocalStorage();
    todoItems = todoItems.filter((todoItem) => {
         if(todoItem.id !== id){
             return todoItem;
         }
    }); 
    localStorage.setItem("todoData", JSON.stringify(todoItems));
}
function editLocalStorage(id, value){
   let items = getLocalStorage();
   items = items.map(function (item) {
     if (item.id === id) {
       item.value = value;
     }
     return item;
   });  
   localStorage.setItem("todoData", JSON.stringify(items));
}
// ******* set up items **************
function setupItems(){
     let items = getLocalStorage();
     console.log("I have been called");
     if(items.length > 0){
         items.forEach((item) => {
              createTodoItems(item.id, item.value);
         });
         todoContainer.classList.add("show-todo");
     }
}
function createTodoItems(id, value){
    const element = document.createElement("div");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("todo-item");
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
         <button class="edit-btn">
            <i class="fa fa-edit"></i>
         </button>
         <button class="delete-btn">
             <i class="fa fa-trash"></i>
         </button>
    </div>
    `;      
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItems);
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItems);
    todoList.appendChild(element);
}
   
