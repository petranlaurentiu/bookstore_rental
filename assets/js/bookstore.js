(function selfFN() {
  "use strict";

  const getBookAPI = async () => {
    const response = await fetch("https://api.itbook.store/1.0/search/react");
    const data = await response.json();
    return data;
  };

  const deleteAPIBook = () => {
    const removeBook = document.querySelector(".main-card");
    const getTotalBooksid = document.getElementById("totalBooks");
    removeBook.remove();
    getTotalBooksid.textContent = parseInt(getTotalBooksid.textContent) - 1;
  };

  const deleteLocalBook = () => {
    const removeBook = document.querySelector(".main-local-card");
    const getTotalBooksid = document.getElementById("totalBooks");
    removeBook.remove();
    getTotalBooksid.textContent = parseInt(getTotalBooksid.textContent) - 1;
  };

  getBookAPI().then((dataItem) => {
    const totalBooks = dataItem.books.length;
    const getTotalBooksid = document.getElementById("totalBooks");
    getTotalBooksid.innerHTML = totalBooks;
    const booksAPI = dataItem.books;
    booksAPI.forEach((bookEL) => {
      const bookListContainer = document.querySelector("#card-container");
      const container = document.createElement("div");
      container.className = "col main-card";
      container.innerHTML = `
                  <div class="card h-100" style="width: 18rem;">
                  <img src="${bookEL.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${bookEL.title}</h5>
                    <p class="card-text">${bookEL.isbn13}</p>
                    <p class="card-text">${bookEL.price}</p>
                    <div class="d-flex justify-content-around">
                    <button type="button" class="btn main-btn rentBtn" data-bs-container="body" 
                    data-bs-toggle="popover" data-bs-placement="top">Rent</button>
                    <button type="button" class="btn remove-btn delete">Remove</button>
                    </div>
                  </div>
                </div>
                  `;
      bookListContainer.appendChild(container);
      const deleteBtn = document.querySelectorAll(".delete");
      deleteBtn.forEach((btn) => {
        btn.addEventListener("click", deleteAPIBook);
      });
    });
    const rentBtn = document.querySelectorAll(".rentBtn");

    rentBtn.forEach((rentBtnEL) => {
      rentBtnEL.addEventListener("click", (e) => {
        e.preventDefault();
        const popover = new bootstrap.Popover(rentBtnEL, {
          trigger: "focus",
          content: "Book has been rented",
        });
        popover.show();
        setTimeout(() => {
          popover.dispose();
        }, 3000);

        const bookTitle =
          e.target.parentElement.previousElementSibling.previousElementSibling
            .previousElementSibling;
        const bookISBN =
          e.target.parentElement.previousElementSibling.previousElementSibling;
        const bookPrice = e.target.parentElement.previousElementSibling;
        const bookImage =
          e.target.parentElement.parentElement.previousElementSibling;
        const bookData = {
          title: bookTitle.textContent,
          isbn: bookISBN.textContent,
          price: bookPrice.textContent,
          image: bookImage.src,
        };
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const returnDate = dueDate.toDateString();

        const bookDataJSON = JSON.stringify(bookData);
        localStorage.setItem("bookData", bookDataJSON);
        const rentedContainer = document.querySelector("#rented-container");
        const rentedCard = document.createElement("div");
        rentedCard.className = "col main-card";

        const removeDollarSign = bookData.price.replace("$", "");
        const convertToNumber = parseInt(removeDollarSign);
        const applyPenalty = convertToNumber * 0.01;

        rentedCard.innerHTML = `
         <div class="card h-100" style="width: 18rem;">
         <img src="${bookData.image}" class="card-img-top" alt="...">
         <div class="card-body">
           <h5 class="card-title">${bookData.title}</h5>
           <p class="card-text">${bookData.isbn}</p>
           <p class="card-text">Due Date: ${returnDate}</p>
           <p class="card-text">After due date: <span class="text-danger">$${applyPenalty}</span> </p>
           <div class="d-flex justify-content-around">
           <a href="#" class="btn remove-btn" id="returnBook">Return Book</a>
           </div>
         </div>
       </div>
      `;
        rentedContainer.appendChild(rentedCard);
        const returnBookBtn = document.querySelectorAll("#returnBook");
        returnBookBtn.forEach((returnBookBtnEL) => {
          returnBookBtnEL.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.parentElement.parentElement.parentElement.parentElement.remove();
          });
        });
      });
    });
  });

  // we can add more books to the store by filling out the form and clicking the submit button
  class Book {
    constructor(title, isbn, price, image) {
      this.title = title;
      this.isbn = isbn;
      this.price = price;
      this.image = "https://via.placeholder.com/150";
    }
  }

  // UI Class: Handle UI Tasks
  class UI {
    static displayBooks() {
      const books = Store.getBooks();

      books.forEach((bookItem) => UI.addBookToList(bookItem));
    }

    static addBookToList(bookItem) {
      const bookListContainer = document.querySelector("#card-container");
      const newDiv = document.createElement("div");
      newDiv.className = "col main-local-card";
      newDiv.innerHTML = `
          <div class="card h-100" style="width: 18rem;">
                  <img src="${bookItem.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${bookItem.title}</h5>
                    <p class="card-text">${bookItem.isbn}</p>
                    <p class="card-text">$${bookItem.price}</p>
                    <div class="d-flex justify-content-around">
                    <a href="#" class="btn main-btn rentLocalBook" id="rent">Rent</a>
                    <a href="#" class="btn remove-btn deleteLocalBook">Remove</a>
                    </div>
                  </div>
                </div>
        `;
      for (let i = 0; i < 10; i++) {
        bookListContainer.insertAdjacentElement("beforeend", newDiv);
      }

      const deleteBtn = document.querySelectorAll(".deleteLocalBook");
      deleteBtn.forEach((btn) => {
        btn.addEventListener("click", deleteLocalBook);
      });

      const rentLocalBook = document.querySelectorAll(".rentLocalBook");
      rentLocalBook.forEach((rentBtnEL) => {
        rentBtnEL.addEventListener("click", (e) => {
          e.preventDefault();
          const bookTitle =
            e.target.parentElement.previousElementSibling.previousElementSibling
              .previousElementSibling;
          const bookISBN =
            e.target.parentElement.previousElementSibling
              .previousElementSibling;
          const bookPrice = e.target.parentElement.previousElementSibling;
          const bookImage =
            e.target.parentElement.parentElement.previousElementSibling;
          const bookData = {
            title: bookTitle.textContent,
            isbn: bookISBN.textContent,
            price: bookPrice.textContent,
            image: bookImage.src,
          };
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14);
          const returnDate = dueDate.toDateString();
          const bookDataJSON = JSON.stringify(bookData);
          localStorage.setItem("bookData", bookDataJSON);
          const removeDollarSign = bookData.price.replace("$", "");
        const convertToNumber = parseInt(removeDollarSign);
        const applyPenalty = convertToNumber * 0.01;
          const rentedContainer = document.querySelector("#rented-container");
          const rentedCard = document.createElement("div");
          rentedCard.className = "col main-card";
          rentedCard.innerHTML = `
          <div class="card h-100" style="width: 18rem;">
          <img src="${bookData.image}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${bookData.title}</h5>
            <p class="card-text">${bookData.isbn}</p>
            <p class="card-text">${bookData.price}</p>
            <p>Due Date: ${returnDate}</p>
            <p class="card-text">After due date: <span class="text-danger">$${applyPenalty}</span> </p>
            <div class="d-flex justify-content-around">
            <a href="#" class="btn remove-btn" id="returnBook">Return Book</a>
            </div>
          </div>
        </div>
          `;
          rentedContainer.appendChild(rentedCard);
          const returnBookBtn = document.querySelectorAll("#returnBook");
          returnBookBtn.forEach((returnBookBtnEL) => {
            returnBookBtnEL.addEventListener("click", (e) => {
              e.preventDefault();
              e.target.parentElement.parentElement.parentElement.parentElement.remove();
            });
          });
        });
      });
    }

    static deleteBook(el) {
      if (el.classList.contains("delete")) {
        el.parentElement.parentElement.parentElement.remove();
      }
    }

    static showAlert(message, className) {
      const div = document.createElement("div");
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector(".container");
      const form = document.querySelector("#book-form");
      container.parentNode.insertBefore(div, form.nextSibling);

      // Vanish in 3 seconds
      setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
      document.querySelector("#title").value = "";
      document.querySelector("#price").value = "";
      document.querySelector("#isbn").value = "";
    }
  }

  // Store Class: Handles Storage
  class Store {
    static getBooks() {
      let books;
      if (localStorage.getItem("books") === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem("books"));
      }

      return books;
    }

    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

  // Event: Display Books
  document.addEventListener("DOMContentLoaded", UI.displayBooks);

  // Event: Add a Book
  document.querySelector("#book-form").addEventListener("submit", (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector("#title").value;
    const price = document.querySelector("#price").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate
    if (title === "" || price === "" || isbn === "") {
      UI.showAlert("Please fill in all fields", "danger");
    } else {
      // Instatiate book
      const book = new Book(title, price, isbn);

      const totalBooks = document.querySelector("#totalBooks");
      totalBooks.textContent = parseInt(totalBooks.textContent) + 1;

      // Add Book to UI
      UI.addBookToList(book);

      // Add book to store
      Store.addBook(book);

      // Show success message
      UI.showAlert("Book Added", "success");

      // Clear fields
      UI.clearFields();
    }
  });
  // using MutationObserver to detect changes in the DOM
  const booksRented = document.querySelector(".modal-body");
  const booksRentedCounter = document.querySelector(".books-rented");
  const booksRentedObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        booksRentedCounter.textContent = booksRented.childElementCount;
      }
    });
  });
  booksRentedObserver.observe(booksRented, {
    childList: true,
  });
  // clear added books
  localStorage.clear();
})();
