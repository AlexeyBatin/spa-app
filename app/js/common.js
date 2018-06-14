/* jshint -W097 */
"use strict";
class Author {
  static showCount() {
    alert(this.count);
  }
  constructor(name, surname, birthday, patronymic = '', books = []) {
    Author.count++;
    this.ID = Author.count;
    this.name = name;
    this.surname = surname;
    this.patronymic = patronymic;
    this.birthday = birthday;
    this.books = books;
  }
}


class Book {
  static showCount() {
    alert(this.count);
  }
  constructor(title, pageAmount, genre) {
    Book.count++;
    this.ID = Book.count;
    this.title = title;
    this.pageAmount = pageAmount;
    this.genre = genre;
  }
}

Book.count = 0;
Author.count = 0;


const genres = ['Роман', 'Поема', 'Фантастика'];
// MAIN CODE


let test = [];
localStorage.setItem('authors', JSON.stringify(test));

var localValue = JSON.parse(getLocalStorage(localStorage));

ListRender(localValue);

// MODALS
let bookModal = document.getElementById('modal');
bookModal.onsubmit = (evt) => {
  const authorID = document.getElementById('authorID').value;
  let title = document.getElementById('bookTitle').value;
  let pageAmount = document.getElementById('pageAmount').value;
  let genre = document.getElementById('genre').value;
  localValue.forEach(element => {
    if (element['ID'] == authorID) {
      element.books.push(new Book(title, pageAmount, genre));
    }
  });
  $('#Modal').modal('hide');
  document.getElementById('authorID').value = '';
  document.getElementById('bookTitle').value = '';
  document.getElementById('pageAmount').value = '';
  document.getElementById('genre').value = 0;
  evt.preventDefault();
  CardRender(authorID);

};

let bookChangeModal = document.getElementById('modalbook');
bookChangeModal.onsubmit = (evt) => {
  const bookID = document.getElementById('bookID').value;
  const authorID = document.getElementById('authorID').value;
  let bookTitle = document.getElementById('modalbook__bookTitle').value;
  let pageAmount = document.getElementById('modalbook__pageAmount').value;
  let genre = document.getElementById('modalbook__genre').value;
  localValue.forEach(element => {
    if (element.ID == authorID) {
      let selfBooks = element.books;
      selfBooks.forEach(element => {
        if (element.ID == bookID) {
          element.title = bookTitle;
          element.pageAmount = pageAmount;
          element.genre = genre;
        }
      });
    }
  });
  $('#ModalBook').modal('hide');
  evt.preventDefault();
  CardRender(authorID);
};

let authorModal = document.getElementById('modal-author');

authorModal.onsubmit = (evt) => {
  let birthday = document.getElementById('birthday').value;
  let name = document.getElementById('name').value;
  let surname = document.getElementById('surname').value;
  let patronymic = document.getElementById('patronymic').value;
  let newAuthor = new Author(name, surname, birthday, patronymic);
  localValue.push(newAuthor);
  ListAdd(newAuthor);
  $('#ModalAuthor').modal('hide');
  document.getElementById('birthday').value = '';
  document.getElementById('name').value = '';
  surname = document.getElementById('surname').value = '';
  patronymic = document.getElementById('patronymic').value = '';
  console.log(localValue);
  evt.preventDefault();
};

let editCard = document.getElementById('editCard');

editCard.onclick = (evt) => {
  let saveCard = document.getElementById('saveCard');
  saveCard.classList.toggle('card__button--hidden');
  editCard.setAttribute('disabled', '');
  let birthday = document.getElementById('staticBirthday'),
    name = document.getElementById('staticName'),
    surname = document.getElementById('staticSurname'),
    patronymic = document.getElementById('staticPatronymic');
  let elements = [surname, name, patronymic, birthday];
  elements.forEach(element => {
    element.removeAttribute('readonly');
    element.classList.remove('form-control-plaintext');
    element.classList.add('form-control');
  });

}

let card = document.getElementById('card');

card.onsubmit = (evt) => {
  const authorID = document.getElementById('authorID').value;
  let birthday = document.getElementById('staticBirthday'),
    name = document.getElementById('staticName'),
    surname = document.getElementById('staticSurname'),
    patronymic = document.getElementById('staticPatronymic');
  localValue.forEach(element => {
    if (element.ID == authorID) {
      element.name = name.value;
      element.surname = surname.value;
      element.patronymic = patronymic.value;
      element.birthday = birthday.value;
    }
  });

  let elements = [surname, name, patronymic, birthday];
  elements.forEach(element => {
    element.setAttribute('readonly', '');
    element.classList.remove('form-control');
    element.classList.add('form-control-plaintext');
  });
  editCard.removeAttribute('disabled');
  let saveCard = document.getElementById('saveCard');
  saveCard.classList.toggle('card__button--hidden');
  evt.preventDefault();
  CardRender(authorID);
  ListRender(localValue);
};
let AddBookButton = document.getElementById("addBookButton");
AddBookButton.onclick = () => {
  let remove = document.getElementById('genre');
  while (remove.firstChild) {
    remove.removeChild(remove.firstChild);
  }
  let generateSelect = document.getElementById('genre');
  genres.forEach(element => {
    let select = document.createElement('option');
    select.setAttribute('value', `${element}`)
    select.innerHTML = `${element}`;
    generateSelect.appendChild(select);
  });
}

let addNewGenre = document.getElementById('addNewGenre');
addNewGenre.onclick = () => {
  let newGenre = prompt('Какой жанр хотите добавить?', '');
  var regexp = /^[A-Za-zА-Яа-яЁё\s]/;
  if (regexp.test(newGenre)) {
    newGenre.toLowerCase();
    let formatedGenre = newGenre[0].toUpperCase() + newGenre.toLowerCase().slice(1);
    let checkGenre = genres.indexOf(formatedGenre);
    if (!~checkGenre) {
      genres.push(formatedGenre);
      alert(formatedGenre);
    } else {
      alert('Такой жанр уже есть');
    }
  } else {
    alert('Некоректные данные');
  }
}

// FUNCTIONS

function getLocalStorage(localStorage) {
  let localValue;
  if (localStorage.getItem('authors')) {
    localValue = localStorage.getItem('authors');
  } else {
    localStorage.setItem('authors', JSON.stringify([]));
    localValue = localValue = localStorage.getItem('authors');
  }
  return localValue;
}

function ListRender(localValue) {
  let remove = document.getElementById('list');
  while (remove.firstChild) {
    remove.removeChild(remove.firstChild);
  }
  localValue.forEach(element => {
    var newLi = document.createElement('button');
    newLi.classList.add('authors__item');
    newLi.setAttribute('type', 'button');
    newLi.setAttribute('data-authorID', element.ID);
    newLi.onclick = function () {
      let id = newLi.getAttribute('data-authorid');
      CardRender(id);
    };
    newLi.innerHTML = `${element.surname} ${element.name} ${element.patronymic}`;
    let list = document.getElementById('list');
    list.appendChild(newLi);
  });
}

function ListAdd(element) {
  var newLi = document.createElement('button');
  newLi.classList.add('authors__item');
  newLi.setAttribute('type', 'button');
  newLi.setAttribute('data-authorID', element.ID);
  newLi.onclick = function () {
    let id = newLi.getAttribute('data-authorid');
    CardRender(id);
  };
  let list = document.getElementById('list');
  newLi.innerHTML = `${element.surname} ${element.name} ${element.patronymic}`;
  list.appendChild(newLi);
}

function CardRender(id) {
  localValue.forEach(element => {
    if (element.ID == id) {
      let authorID = document.getElementById('authorID');
      authorID.value = id;
      let remove = document.getElementById('card');
      while (remove.firstChild) {
        remove.removeChild(remove.firstChild);
      }
      let newTitle = document.createElement('h2');
      newTitle.classList.add('card__title');
      newTitle.innerHTML = `${element.surname} ${element.name} ${element.patronymic}`;
      card.appendChild(newTitle);
      let surnameInput = document.createElement('div');
      surnameInput.classList.add('form-group', 'row');
      surnameInput.innerHTML = `<label for="staticSurname" class="col-sm-2  col-form-label">Фамилия</label>
      <div class="col-sm-10">
        <input type="text" readonly class="form-control-plaintext" pattern="[A-Za-zА-Яа-яЁё]{2,}" id="staticSurname" value="${element.surname}" required>
      </div>`;
      card.appendChild(surnameInput);
      let nameInput = document.createElement('div');
      nameInput.classList.add('form-group', 'row');
      nameInput.innerHTML = `<label for="staticName" class="col-sm-2 col-form-label">Имя</label>
      <div class="col-sm-10">
        <input type="text" readonly class="form-control-plaintext" pattern="[A-Za-zА-Яа-яЁё]{2,}" id="staticName" value="${element.name}" required>
      </div>`;
      card.appendChild(nameInput);
      let patronymicInput = document.createElement('div');
      patronymicInput.classList.add('form-group', 'row');
      patronymicInput.innerHTML = `<label for="staticPatronymic" class="col-sm-2 col-form-label">Отчество</label>
      <div class="col-sm-10">
        <input type="text" readonly class="form-control-plaintext" pattern="[A-Za-zА-Яа-яЁё]{2,}" id="staticPatronymic" value="${element.patronymic}">
      </div>`;
      card.appendChild(patronymicInput);
      let birthdayInput = document.createElement('div');
      birthdayInput.classList.add('form-group', 'row');
      birthdayInput.innerHTML = `<label for="staticBirthday" class="col-sm-2  col-form-label">Дата рождения</label>
      <div class="col-sm-10">
        <input type="date" readonly class="form-control-plaintext" id="staticBirthday" value="${element.birthday}"required>
      </div>`;
      card.appendChild(birthdayInput);
      let cardButton = document.createElement('button');
      cardButton.setAttribute('type', 'submit');
      cardButton.setAttribute('id', 'saveCard');
      cardButton.classList.add('btn', 'btn-primary', 'card__button', 'card__button--hidden');
      cardButton.innerHTML = `Сохранить`;
      card.appendChild(cardButton);
      RenderBooks(element);
    }
  });
}

function RenderBooks(element) {
  let remove = document.getElementById('card__table');
  while (remove.firstChild) {
    remove.removeChild(remove.firstChild);
  }
  let table = document.createElement('table');
  table.classList.add('table');
  table.innerHTML = `<thead>
  <tr>
    <th scope="col">Название</th>
    <th scope="col">Количество страниц</th>
    <th scope="col">Жанр</th>
    <th scope="col"></th>
    <th scope="col"></th>
  </tr>
</thead>
<tbody id="tablebody"></tbody>`;
  let card__table = document.getElementById('card__table');
  card__table.appendChild(table);
  let books = element.books;

  books.forEach(element => {
    let row = document.createElement('tr');
    row.innerHTML = `<td>${element.title}</td>
    <td>${element.pageAmount}</td>
    <td>${element.genre}</td>
    <td class="right">
      <div class="btn-group btn-group-sm" role="group" aria-label="tableActions" id="action-col" >
        <button type="button" class="button__change btn btn-secondary"  data-toggle="modal" data-target="#ModalBook" data-bookID = "${element.ID}">Редактировать</button>
        <button type="button" class="button__delete btn btn-danger" data-bookID = "${element.ID}">Удалить</button>
      </div>
    </td>`;
    tablebody.appendChild(row);
  });
  let btnchange = document.getElementsByClassName("button__change");
  for (let i = 0; i < btnchange.length; i++) {
    const element = btnchange[i];
    element.onclick = function () {

      let remove = document.getElementById('modalbook__genre');
      while (remove.firstChild) {
        remove.removeChild(remove.firstChild);
      }
      let generateSelect = document.getElementById('modalbook__genre');
      genres.forEach(element => {
        let select = document.createElement('option');
        select.setAttribute('value', `${element}`)
        select.innerHTML = `${element}`;
        generateSelect.appendChild(select);
      });
      let bookID = document.getElementById('bookID');
      bookID.value = this.getAttribute('data-bookID');
      let selfRow = this.parentElement.parentElement.parentElement;
      document.getElementById('modalbook__bookTitle').value = selfRow.childNodes[0].innerHTML;
      document.getElementById('modalbook__pageAmount').value = selfRow.childNodes[2].innerHTML;
      document.getElementById('modalbook__genre').value = selfRow.childNodes[4].innerHTML;
    };
  }
  let btnDelete = document.getElementsByClassName("button__delete");
  for (let i = 0; i < btnDelete.length; i++) {
    const btn = btnDelete[i];
    btn.onclick = function () {
      let bookID = document.getElementById('bookID');
      bookID.value = this.getAttribute('data-bookID');
      DeleteBook(element.ID, bookID.value);

    };
  }
}

function DeleteBook(id, bookID) {
  if (confirm('Вы уверены что хотите удалить книгу??')) {
    localValue.forEach(element => {
      if (element.ID == id) {
        let elementBooks = element.books;
        for (let i = 0; i < elementBooks.length; i++) {
          if (elementBooks[i].ID == bookID) {
            elementBooks.splice(i, 1);
          }
        }
      }
    });
    CardRender(id);
  }
}

