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

let bookListForm = [];
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BookForm";
const RENDER_EVENT = "render-book";

function addBooks() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const id = generateID();
  const bookObject = generatebookObject(id, title, author, year, isComplete);
  bookListForm.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  document.getElementById("bookForm").reset();
  saveData();
}
// id unik
function generateID() {
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
  container.setAttribute("data-bookid", `${bookObject.id}`);
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

    buttonContainer.append(buttonToDelete, buttonToDone, buttonToEdit);
  }
  return container;
}

function addDone(id) {
  const book = bookListForm.find((book) => book.id === id);
  if (book) {
    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function undoDone(id) {
  const book = bookListForm.find((book) => book.id === id);
  if (book) {
    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function deleteBook(id) {
  const index = bookListForm.findIndex((book) => book.id === id);
  if (index !== -1) {
    bookListForm.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function bookToEdit(id) {
  const index = bookListForm.findIndex((book) => book.id === id);
  if (index !== -1) {
    document.getElementById("bookFormTitle").value = bookListForm[index].title;
    document.getElementById("bookFormAuthor").value =
      bookListForm[index].author;
    document.getElementById("bookFormYear").value = bookListForm[index].year;
    document.getElementById("bookFormIsComplete").checked =
      bookListForm[index].isComplete;

    bookListForm.splice(index, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

const searchBook = document.getElementById("searchBook");
const searchInput = document.getElementById("searchBookTitle");
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchValue = event.target.elements.searchBookTitle.value.toLowerCase();
  const bookFilter = bookListForm.filter((book) => {
    book.title.toLowerCase().includes(searchValue);
  });
  if (bookFilter.length) {
    booksearch(bookFilter);
  } else {
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  event.target.reset();
});

function booksearch(bookFilter) {
  const notCompleted = document.getElementById("incompleteBookList");
  const complete = document.getElementById("completeBookList");

  notCompleted.innerHTML = "";
  complete.innerHTML = "";

  for (const listBook of bookFilter) {
    const bookElement = newBookToAdd(listBook);
    if (!listBook.isComplete) {
      notCompleted.append(bookElement);
    } else {
      complete.append(bookElement);
    }
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const notcompleted = document.getElementById("incompleteBookList");
  notcompleted.innerHTML = "";

  const complete = document.getElementById("completeBookList");
  complete.innerHTML = "";

  for (const listBook of bookListForm) {
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
      bookListForm.push(listBook);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
  if (isStorageExist()) {
    const parsedData = JSON.stringify(bookListForm);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

//opsional
//searchBar

//storage pencarian
// const pickDataStorage = () => {
//   const listBooks = localStorage.getItem(STORAGE_KEY);
//   return listBooks ? JSON.parse(listBooks) : [];
//   bookform.push(...)
// };
