let myLibrary = [];

function Book(author, bookName, read) {
  // constructor
  this.author = author;
  this.name = bookName;
  this.read = read;
}

Book.prototype.toggleRead = (e) => {
  if (e.target.textContent == "Read") {
    e.target.textContent = "Not Read";
    e.target.classList.remove("readButton");
    e.target.classList.add("btnNotRead");
  } else {
    e.target.textContent = "Read";
    e.target.classList.remove("btnNotRead");
    e.target.classList.add("readButton");
  }
};

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
  addToPage();
}

function deleteItem(e) {
  let index = e.target.getAttribute("data-delete");
  myLibrary.splice(index, 1);
  addToPage();
}

function addToPage() {
  let booksDiv = document.querySelector(".booksDiv");

  if (booksDiv.childNodes.length > 0) {
    let remove = document.querySelectorAll(".rowBook");
    remove.forEach((element) => {
      booksDiv.removeChild(element);
    });
  }

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

    if (myLibrary[i].read) {
      readButton.textContent = "Read";
      readButton.classList.add("readButton");
    } else {
      readButton.textContent = "Not Read";
      readButton.classList.add("btnNotRead");
    }

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
