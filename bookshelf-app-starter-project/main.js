document.addEventListener("DOMContentLoaded", function () {
  const bookFormSubmit = document.getElementById("bookForm");
  bookFormSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

let bookforms = [];
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BookForm";
const RENDER_EVENT = "render-book";

function addBooks() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generateId = generateId();
  const bookObject = generatebookObject(
    generateId,
    title,
    author,
    year,
    isComplete
  );
  bookforms.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById("bookForm").reset();
  saveData();
}
// id unik
function generatedId() {
  return +new Date();
}

function generatebookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function newBookToAdd(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute("data-testid", "bookItemTitle");

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;
  bookYear.setAttribute("data-testid", "bookItemYear");

  const bookContainer = document.createElement("div");
  bookContainer.append(bookTitle, bookAuthor, bookYear);

  const buttonContainer = document.createElement("div");

  const container = document.createElement("div");
  container.append(bookContainer, buttonContainer);
  container.setAttribute("data-testid", `${bookObject.id}`);
  container.setAttribute("data-testid", "bookItem");

  //button
  const buttonToEdit = document.createElement("button");
  buttonToEdit.innerText = "Edit";
  buttonToEdit.setAttribute("data-testid", "bookItemButtonToEdit");

  buttonToEdit.addEventListener("click", function () {
    bookToEdit(bookObject.id);
  });

  const buttonToDelete = document.createElement("button");
  buttonToDelete.innerText = "Delete";
  buttonToDelete.setAttribute("data-testid", "bookItemButtonToDelete");

  buttonToDelete.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  if (bookObject.isComplete) {
    const buttonToUndo = document.createElement("button");
    buttonToUndo.setAttribute("data-testid", "bookItemButtonToUndo");
    buttonToUndo.innerText = "Undo";

    buttonToUndo.addEventListener("click", function () {
      undoDone(bookObject.id);
    });
    buttonContainer.append(buttonToUndo);
  } else {
    const buttonToDone = document.createElement("button");
    buttonToDone.setAttribute("data-testid", "bookItemButtonToDone");
    buttonToDone.innerText = "Done";

    buttonToDone.addEventListener("click", function () {
      addDone(bookObject.id);
    });

    //     function bookHasRead(idBook) {
    //       const pointToBook = findBook(idBook);

    //       if (pointToBook == null) return false;

    //       pointToBook.doneRead = true;
    //       document.dispatchEvent(new Event(RENDER_EVENT));
    //       saveData();
    //     }
    buttonContainer.append(buttonToDelete, buttonToDone, buttonToEdit);
  }
  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const notcompleted = document.getElementById("incompleteBookList");
  notcompleted.innerHTML = "";

  const complete = document.getElementById("completeBookList");
  complete.innerHTML = "";

  for (const listBook of bookforms) {
    const bookElement = newBookToAdd(listBook);
    if (!listBook.isComplete) {
      notcompleted.append(bookElement);
    } else {
      complete.append(bookElement);
    }
  }
});

//STORAGE

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const listBook of data) {
      bookforms.push(listBook);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsedData = JSON.stringify(bookforms);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

//opsional

//storage pencarian
// const pickDataStorage = () => {
//   const listBooks = localStorage.getItem(STORAGE_KEY);
//   return listBooks ? JSON.parse(listBooks) : [];
//   bookform.push(...)
// };
