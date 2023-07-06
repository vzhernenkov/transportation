(() => {

//GlOBAL VARIABLES

let numbers = '01234567890',
    symbols = '!#@$%^&*()_-+=§<>?/,.\|';
    passwordStopper = 0;

let driverList = [{
      truckName: "Eagle1",
      truckDriver: "Vasiliy Zhernenkov",
      truckNumber: "AX1023BT",
      truckLocation: "Buenos Aires",
      truckType: "TILT"
    }];

// LOGIN & REGISTRATION

if (document.title == "Login" || document.title == "Register") {

const FORM_BUTTON = document.querySelector('.form__button');

FORM_BUTTON.addEventListener('click', validate);

document.getElementById('password').addEventListener('input', validatePassword);


}

// TRANSPORTATION

if (document.title == "Transport") {

  createDriverList(driverList);

  const FORM = document.getElementById('transport__form');

  FORM.addEventListener('submit', addDriver);



}
 
// FUNCTIONS

function addDriver (e) {

  e.preventDefault();

  let Name = document.querySelector('#truck__name').value,
      Driver = document.querySelector('#truck__driver').value,
      Number = document.querySelector('#truck__number').value,
      Location = document.querySelector('#truck__location').value,
      Type = [...document.querySelectorAll('.form__radio')].filter(el => el.checked)[0].id;

  driverList.push({
    truckName: Name,
    truckDriver: Driver,
    truckNumber: Number,
    truckLocation: Location,
    truckType: Type
  });
  
  createDriverList(driverList);
};

function createDriverList (arr) {
  let list = document.querySelector('.transport__list');
  let cards = ''
  list.innerHTML = "";

  arr.forEach(el => {
    cards += `<li class="transport__item">
    <div class="transport__card">
      <div class="transport__card-header">
        <h3 class="transport__driver">${el.truckDriver}</h3>
      </div>
      <div class="transport__information">
        <div class="information__item">
          <div class="transport__info transport__name">Truck name: <span class="info">${el.truckName}</span></div>
          <div class="transport__info transport__number">Number: <span class="info">${el.truckNumber}</span></div>
          <div class="transport__info transport__type">Type: <span class="info">${el.truckType}</span></div>
        </div>
        <div class="information__item">
          <div class="transport__info transport__location">Current location: <span class="info">${el.truckLocation}</span></div>
          <div class="transport__weather">???</div>
        </div>
      </div>
    </div>
  </li>`
  });

  list.innerHTML = cards;
  document.getElementById('transport__form').reset();

} 

function validateLogReg (e) {

  e.preventDefault();
  
  let email = document.getElementById('email').value ,
      password = document.getElementById('password').value;
  
  if (e.target.id == 'register') {
    let name = document.getElementById('name').value,
        tel = document.getElementById('phone').value;
    
    validateStr(name, 'name');
    validateEmail(email, 'email');
    validatePhone(tel, 'phone');

    if (passwordStopper && password) {
      let checkMassive = document.querySelectorAll(".active")
      console.log(checkMassive);

      if (checkMassive.length == 0) {
        window.location.href = 'transport.html';
      }
    }


  } else if (e.target.id == 'login') {
    let admin = {
      email: "admin@gmail.com",
      password: "admin"
    }

    if (password == admin.password && email == admin.email) {
      window.location.href = 'transport.html';
    };
  }
  
};

function validateStr (name, id) {
  let errors = '';

  if (name.split('').filter(e => numbers.includes(e) || symbols.includes(e)).length > 0) errors += "Name shouldn't contains any number or symbol. ";
  if (name.length <= 2) errors += "Length shoud be more than 2 letters. "
  
  message (errors, id)  
};

function validateEmail (email, id) {
  let errors = '';

  if (email.split('').filter(e => e == '@' || e == '.').length == 0) errors = "Incorrect email";
  if (email.length < 6) errors = "Incorrect email";

  message (errors, id)  
};

function validatePhone (tel, id) {
  let errors = '';

  if (tel.split('').filter(e => numbers.includes(e)).length !== tel.length || tel.length == 0 || tel.length > 10) errors += "Incorrect number";

  message(errors, id);
};

function validatePassword (e) {
  
  let counter = 0;
  
  let password = e.target.value,
      bigLetter = document.querySelector('.big-letter'),
      length = document.querySelector('.length'),
      number = document.querySelector('.number'),
      symbol = document.querySelector('.symbols');



  if (password.toLowerCase() == password) {

    bigLetter.style.color = 'red';
    counter++;
  
  } else {
    bigLetter.style.color = 'green';
  }
  
  if (password.split('').filter(e => symbols.includes(e)).length == 0) {
    symbol.style.color = 'red';
    counter++;
  } else {
    symbol.style.color = 'green';
  }
  
  if (password.length < 8) {
    length.style.color = 'red';
    counter++;
  } else {
    length.style.color = 'green';
  }
  
  if (password.split('').filter(e => numbers.includes(e)).length == 0) {
    number.style.color = 'red';
    counter++;
  } else {
    number.style.color = 'green';
  }

  if (!password) {
    bigLetter.style.color = 'black';
    symbol.style.color = 'black';
    length.style.color = 'black';
    number.style.color = 'black';
  }

  if (counter > 0) {
    passwordStopper = 0;
  } else {
    passwordStopper = 1;
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

})();