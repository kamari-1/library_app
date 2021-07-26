import Book from "./js/book.js";

let library = [];

let title = document.getElementById("title");
let author = document.getElementById("author");
let pages = document.getElementById("pages");
let read = document.getElementById("read");
let form = document.querySelector("form");
let emptyLibrary = document.querySelector(".library-empty");
// let btn = document.getElementById("btn");
let clearAllBtn = document.querySelector(".btn-clear-all");
let booklist = document.getElementById("booklist");
let table = document.querySelector(".table-div");
// let trash = document.getElementsByClassName("trash");
let totalBooks = document.getElementById("total-books");
let booksRead = document.getElementById("books-read");
let booksUnread = document.getElementById("books-unread");

// Get Library from LOCALSTORAGE
if (localStorage.getItem("books") == null) {
  library = [];
  emptyLibrary.style.display = "flex";
  table.style.display = "none";
} else {
  const booksFromLocalStorage = JSON.parse(localStorage.getItem("books"));
  library = booksFromLocalStorage;
  showBooks();
}

function updateLocalStorage() {
  // Add to LOCALSTORAGE
  localStorage.setItem("books", JSON.stringify(library));
}

// --------------------------------
// ----- Add book to library -----
// --------------------------------
function addToLibrary(name, person, num, check) {
  // Create new book object
  let newBook = new Book(name, person, num, check);
  // Add to library array
  library.push(newBook);
  form.reset();
  showBooks();
  updateLocalStorage();
}

// ------------------------
// ----- Show Books -----
// ------------------------
function showBooks() {
  booklist.innerHTML = "";

  library.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="td-title">${book.title}</td>
        <td class="td-author text-muted">${book.author}</td>
        <td>${book.pages}</td>
        <td>${
          book.read
            ? `<i class="fa fa-check" aria-hidden="true"></i>`
            : `<i class="fa fa-times" aria-hidden="true"></i>`
        }</td>
        <td class="trash"><i class="fa fa-trash" aria-hidden="true"></i></td>
      `;
    // add row to table
    booklist.appendChild(row);
  });

  // display table or "library empty!"
  if (library.length == 0) {
    emptyLibrary.style.display = "flex";
    table.style.display = "none";
  } else {
    emptyLibrary.style.display = "none";
    table.style.display = "table";
  }
  getLibraryStats();
}

// -------------------------------
// ----- Add book from form -----
// -------------------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  validate();
});

// ----- Remove book -----
function removeBook(e) {
  if (!e.target.classList.contains("fa-trash")) return;

  let btn = e.target,
    index = btn.closest("tr").rowIndex - 1;

  // remove from table
  btn.closest("tr").remove();

  // remove book from Library array
  library.splice(index, 1);

  showBooks();
}

// -------------------------
// ----- Mark read -----
// -------------------------
function toggleRead(e) {
  let btn = e.target,
    row = btn.closest("tr").rowIndex - 1;

  if (btn.classList.contains("fa-check")) {
    btn.classList.remove("fa-check");
    btn.classList.add("fa-times");
    library[row].read = false;
  } else if (btn.classList.contains("fa-times")) {
    btn.classList.remove("fa-times");
    btn.classList.add("fa-check");
    library[row].read = true;
  }

  updateLocalStorage();
  getLibraryStats();
}

// Delete book
booklist.addEventListener("click", removeBook);
booklist.addEventListener("click", toggleRead);

// clear all books
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure?")) {
    library = [];
    updateLocalStorage();
    showBooks();
  } else return;
});

// -------------------------
// ----- Library Stats -----
// -------------------------
function getLibraryStats() {
  // Total books in library
  totalBooks.innerText = library.length;

  // Books read
  booksRead.innerText = (() => {
    return library.filter((elem) => {
      if (elem.read === true) return elem;
    }).length;
  })();

  // Books Unread
  booksUnread.innerText = (() => {
    return library.filter((elem) => {
      if (elem.read === false) return elem;
    }).length;
  })();
}

// --------------------------
// ----- Validate form -----
// --------------------------
const validate = () => {
  if (title.value !== "" && author.value !== "" && pages.value > 0)
    addToLibrary(title.value, author.value, pages.value, read.checked);
  else {
    alert("Fields CANNOT be empty.");
  }
};
