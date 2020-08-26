const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// variables
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

// local storage data
let data = localStorage.getItem("TODO");

// check if the data is empty
if (data) {
    // parse the data
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    // create an empty list array
    LIST = [];
    id = 0;
}

// load the existing array list
function loadList(array) {
    array.forEach(function(item) {
        // add each item from the array list
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

clear.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
});

// Show date and time

const options = { weekday: "long", month: "long", day: "numeric" };
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done, trash) {
    if (trash) {
        // If the item has been removed then just return back
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
    <p class="text ${LINE}">${toDo}</p>
    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
  </li>
`;

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

document.addEventListener("keyup", function(event) {
    // If the user presses the enter key to add another task
    if (event.keyCode == 13) {
        const toDo = input.value;

        if (toDo) {
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false,
            });

            // increment the id of the task
            id++;

            localStorage.setItem("TODO", JSON.stringify(LIST));
        }

        // clear the input
        input.value = "";
    }
});

function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id] = LIST[element.id].done ? false : true;
}

function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

// event listener for clicks
list.addEventListener("click", function(event) {
    const element = event.target;
    const elementJob = element.attributes.job.value; // either completed or deleted

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element);
    }

    // Save Tasks to local storage
    localStorage.setItem("TODO", JSON.stringify(LIST));
});