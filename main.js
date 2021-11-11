function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

let myLibrary = [];

// class Book {
//   constructor(author, bookName, read) {
//     this.author = author;
//     this.bookName = bookName;
//     this.read = read;
//   }
// }

function Book(author, bookName, read) {
  // constructor
  this.author = author;
  this.name = bookName;
  this.read = read;
}

// not the best design AT ALL, but works.. couldn t figure out how to bind this keyword to apropriate object, will come back to it later

Book.prototype.toggleRead = (e) => {
  let book = myLibrary[e.target.getAttribute("data-read")];
  if (e.target.textContent == "Read") {
    e.target.textContent = "Not Read";
    e.target.classList.remove("readButton");
    e.target.classList.add("btnNotRead");
    book.read = false;
    localStorage.setItem("library", JSON.stringify(myLibrary));
  } else {
    e.target.textContent = "Read";
    e.target.classList.remove("btnNotRead");
    e.target.classList.add("readButton");
    book.read = true;
    localStorage.setItem("library", JSON.stringify(myLibrary));
  }
};
function addProtoMethods(libraryList) {
  libraryList.forEach((book) => {
    Object.setPrototypeOf(book, Book.prototype);
  });
}

if (storageAvailable("localStorage")) {
  if (localStorage.getItem("library")) {
    let retrievedObject = localStorage.getItem("library");

    myLibrary = JSON.parse(retrievedObject);
    addProtoMethods(myLibrary);

    addToPage();
  }
}

// Exercise with classes

let booksDiv = document.querySelector(".booksDiv");

function addBookToLibrary() {
  let author = document.querySelector("#author").value;
  let bookName = document.querySelector("#bookname").value;

  if (author == "" || bookName == "") {
    alert("You need to enter values");
    return;
  }
  let read = document.querySelector("#read").checked;
  let book = new Book(author, bookName, read);

  myLibrary.push(book);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  addToPage();
}

function deleteItem(e) {
  let index = e.target.getAttribute("data-delete");
  myLibrary.splice(index, 1);
  localStorage.setItem("library", JSON.stringify(myLibrary));
  addToPage();
}

function removePreviusBooks(booksDiv) {
  if (booksDiv.childNodes.length > 0) {
    let remove = document.querySelectorAll(".rowBook");
    remove.forEach((element) => {
      booksDiv.removeChild(element);
    });
  }
}

function addToPage() {
  let booksDiv = document.querySelector(".booksDiv");

  removePreviusBooks(booksDiv);

  for (let i = 0; i < myLibrary.length; i++) {
    let rowBook = document.createElement("div");
    rowBook.className = "rowBook";
    let divAuthor = document.createElement("div");
    let divName = document.createElement("div");

    let p = document.createElement("p");
    p.textContent = "+";
    p.classList = "close-btn";
    p.setAttribute("data-delete", `${i}`);
    p.addEventListener("click", deleteItem);

    let readButton = document.createElement("button");
    readButton.setAttribute("data-read", `${i}`);

    if (myLibrary[i].read) {
      readButton.textContent = "Read";
      readButton.classList.add("readButton");
    } else {
      readButton.textContent = "Not Read";
      readButton.classList.add("btnNotRead");
    }
    console.log(myLibrary[i]);
    readButton.addEventListener("click", myLibrary[i].toggleRead);

    divAuthor.textContent = myLibrary[i].author;
    divName.textContent = myLibrary[i].name;

    rowBook.append(p, divAuthor, divName, readButton);
    booksDiv.append(rowBook);
  }
  document.querySelector(".popup").style.display = "none";
}

// ------------------------------------

function popup() {
  document.querySelector("#author").value = "";
  document.querySelector("#bookname").value = "";
  document.querySelector("#read").checked = true;
  document.querySelector(".popup").style.display = "flex";
}

function close() {
  document.querySelector(".popup").style.display = "none";
}

document.querySelector(".submit").addEventListener("click", addBookToLibrary);
document.querySelector("#add").addEventListener("click", popup);
document.querySelector(".close-btn").addEventListener("click", close);
