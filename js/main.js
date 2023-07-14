(() => {

//GlOBAL VARIABLES


// LOGIN & REGISTRATION

if (document.title == "Register"){


  let FORM_BUTTON = document.querySelector('.form__button');
  let password = document.getElementById('password');

  FORM_BUTTON.addEventListener('click', validateRegistration);

  password.addEventListener('input', function(e) {
    let password = e.target.value;
    validatePassword(password);
  });


};

if (document.title == "Login") {
  const FORM_BUTTON = document.querySelector('.form__button');
  FORM_BUTTON.addEventListener('click', validateLogin);
};


// CARRIER CABINET

if (document.title == "Orders" || document.title == "Orders") {
  activeUser();
}

if (document.title == "Fleet") {

  createTruckList();

  const FORM = document.getElementById('transport__form');
  const DELETE_BUTTONS = document.querySelectorAll('.transport__delete');

  DELETE_BUTTONS.forEach(el => {
    el.addEventListener('click', deleteTruck);
  })

  FORM.addEventListener('submit', function (e) {
    e.preventDefault();
    let newTruck = createTruck();
    addTruckToUserTruckList(newTruck);
    createTruckList();
    e.target.reset();
  });

}


})();

//CLASSES

class Order {
  constructor (id, from, to, truckType, cargo, loadingDate, arrivalDate, price) {
    this.id = id,
    this.from = from,
    this.to = to,
    this.truckType = truckType,
    this.cargo = cargo,
    this.loadingDate = loadingDate,
    this.arrivalDate = arrivalDate,
    this.price = price
  }
}

class User {
  constructor (name, phone, email, password) {
    this.name = name,
    this.phone = phone,
    this.email = email,
    this.password = password,
    this.trucks = [],
    this.currentSession = false,
    this.orders = {
      active: [],
      completed: [],
      declined: []
    }
  }
}

class Truck {
  constructor (name, driver, number, location, type) {
    this.name = name,
    this.driver = driver,
    this.number = number,
    this.location = location,
    this.type = type,
    this.scoring = 'Unverified'
  }
};

//FUNCTIONS

function deleteTruck (e) {
  if (confirm('Are you sure, that you want to delete your truck?')) {
    let user = takeActiveUserFromLocalStorage(),
        currentTruckCard = e.target.closest('.transport__item'),
        truckName = currentTruckCard.querySelector('.truck__name').textContent;
        user.trucks = user.trucks.filter(el => el.name !== truckName);
    
    createUser(user);
    createTruckList();
  };
}

function addTruckToUserTruckList (truck) {
  let user = takeActiveUserFromLocalStorage();
  user.trucks.push(truck);
  createUser(user);
}

function takeActiveUserFromLocalStorage () {
  let users = takeUsersFromLocalStorage();

  return users.filter(el => el.currentSession)[0];
}

function takeUsersFromLocalStorage () {
  let users = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    users.push(JSON.parse(localStorage.getItem(key)));
  };

  return users;
}

function activeUser () {
  let users = takeUsersFromLocalStorage(),
      userLabel = document.getElementById('user');

  let currentUser = users.filter(el => el.currentSession == true);

  userLabel.textContent = currentUser[0].name;
}

function activateSession (user) {
  user.currentSession = true;
  return user
}

function cancelSession(user) {
  user.currentSession = false;
  return user
}

function checkUserInLocalStorage (user) {
  return localStorage.getItem(user.email) ? true : false;
}

function logOutAllUsers () {
  let users = takeUsersFromLocalStorage();

  users.map(el => {
    cancelSession(el);
  });

  localStorage.clear();

  users.forEach(el => {
    createUser(el);
  })
}

function createUser (user) {
  localStorage.setItem(user.email, JSON.stringify(user));
};

function checkLoginUser (email, password) {
  let user = localStorage.getItem(email);

  if (user) {
    if (user.password == password) {
      logOutAllUsers();
      localStorage.setItem(user.email, JSON.stringify(user));
      redirect('../orders/');
    }
  } else {
    alert("Invalid email or password");
  }
}

function checkLocalStorage (key) {
  if (localStorage.getItem(key)) {
    return true;
  }
  return false;
}

function createTruck () {

  let name = document.querySelector('#truck__name').value,
      driver = document.querySelector('#truck__driver').value,
      number = document.querySelector('#truck__number').value,
      location = document.querySelector('#truck__location').value,
      type = [...document.querySelectorAll('.form__radio')].filter(el => el.checked)[0].id;
  
  let truck = new Truck (name, driver, number, location, type);
  
  return truck;
};

function createTruckList () {
  let user = takeActiveUserFromLocalStorage();
  let trucks = user.trucks;
  let list = document.querySelector('.transport__list');
  let cards = ''
  list.innerHTML = "";

  trucks.forEach(el => {
    cards += `<li class="transport__item">
                <div class="transport__card">
                <div class="transport__information">
                  <div class="information__item">
                    <div class="transport__info transport__name">Truck name: <span class="info truck__name">${el.name}</span></div>
                    <div class="transport__info transport__driver">Driver: <span class="info">${el.driver}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__number">Number: <span class="info">${el.number}</span></div>
                    <div class="transport__info transport__type">Type: <span class="info">${el.type}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__location">Current location: <span class="info">${el.location}</span></div>
                    <div class="transport__info transport__location">Scoring status: <span class="info">${el.scoring}</span></div>
                  </div>
                  <div class="information__item">
                    <button class="transport__info transport__button transport__delete">Delete</button>
                    <button class="transport__info transport__button transport__edit">Edit</button>
                  </div>
                </div>
              </div>
            </li>`
  });

  list.innerHTML = cards;
}; 

function validateLogin (e) {
  e.preventDefault();
  
  let email = document.getElementById('email').value ,
      password = document.getElementById('password').value;

      checkLoginUser(email, password);
};

function validateRegistration (e) {

  e.preventDefault();
  
  let email = document.getElementById('email').value ,
      password = document.getElementById('password').value,
      name = document.getElementById('name').value,
      tel = document.getElementById('phone').value;
      form = document.getElementById('form__register');
      
    
    validateStr(name, 'name');
    validateEmail(email, 'email');
    validatePhone(tel, 'phone');
    validatePassword(password);

    let user = new User (name, tel, email, password);

    if (checkErrors(form) && !checkUserInLocalStorage(user)) {
      logOutAllUsers();
      activateSession(user);
      createUser (user);
      redirect('../orders/');
    }
};

function checkErrors(form) {
  let arr = form.querySelectorAll(".active");

  if (arr.length == 0) return true;

  return false;
}

function checkNumber (str) {
  let numbers = '01234567890';

  return str.split('').filter(el => numbers.includes(el)).length > 0;
}

function checkSymbol (str) {
  let symbols = '!#@$%^&*()_-+=§<>?/,.\|';

  return str.split('').filter(el => symbols.includes(el)).length > 0;
}

function redirect (link) {
  window.location.href = `${link}`;
}

function validateStr (name, id) {

  let errors = '';

  if (checkNumber(name) || checkSymbol(name)) errors += "Name shouldn't contains any number or symbol. ";
  if (name.length <= 2) errors += "Length shoud be more than 2 letters. "
  
  message (errors, id);  
};

function validateEmail (email, id) {
  let errors = '';

  if (email.split('').filter(e => e == '@' || e == '.').length == 0) errors = "Incorrect email";
  if (email.length < 6) errors = "Incorrect email";

  message (errors, id)  
};

function validatePhone (tel, id) {
  let errors = '';
  let numbers = '01234567890';

  if (tel.split('').filter(e => numbers.includes(e)).length !== tel.length || tel.length == 0 || tel.length > 10) errors += "Incorrect number";

  message(errors, id);
};

function validatePassword (password) {

  let bigLetter = document.querySelector('.big-letter'),
      length = document.querySelector('.length'),
      number = document.querySelector('.number'),
      symbol = document.querySelector('.symbols');
  
  if (!password) {
    message('This field is required', 'password');
    bigLetter.style.color = 'black';
    symbol.style.color = 'black';
    length.style.color = 'black';
    number.style.color = 'black';
  };

  if (password.toLowerCase() == password) {
    bigLetter.style.color = 'red';
    bigLetter.classList.add('active');
  } else {
    bigLetter.style.color = 'green';
    bigLetter.classList.remove('active');
  }
  
  if (!checkSymbol(password)) {
    symbol.style.color = 'red';
    symbol.classList.add('active');
  } else {
    symbol.style.color = 'green';
    symbol.classList.remove('active');
  }
  
  if (password.length < 8) {
    length.style.color = 'red';
    length.classList.add('active');
  } else {
    length.style.color = 'green';
    length.classList.remove('active');
  }
  
  if (!checkNumber(password)) {
    number.style.color = 'red';
    number.classList.add('active');
  } else {
    number.style.color = 'green';
    number.classList.remove('active');
  }
};

function message (errors, id) {
  const LABEL = document.querySelector(`#${id}`).previousElementSibling;

  LABEL.textContent = errors;

  if (errors.length > 0) {
    if(!LABEL.classList.contains('active')) {
      LABEL.classList.add('active');
    }
  } else {
    if(LABEL.classList.contains('active')) {
      LABEL.classList.remove('active');
    }
  }
}