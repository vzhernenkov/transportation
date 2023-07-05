(() => {

//CONSTANTS

const FORM_BUTTON = document.querySelector('.form__button');


// VARIABLES

let numbers = '01234567890',
    symbols = '!#@$%^&*()_-+=§<>?/,.\|';
    passwordStopper = 0;

// LISTENERS

FORM_BUTTON.addEventListener('click', validate);

// FUNCTIONS


// validators

document.getElementById('password').addEventListener('input', validatePassword);

function validate (e) {
  e.preventDefault();
  
  let email = document.getElementById('email').value,
      password = document.getElementById('password').value,
      company = document.getElementById('company').value;
  
  if (e.target.id == 'register') {
    let name = document.getElementById('name').value,
        tel = document.getElementById('phone').value;

    
    if (validateName(name) || validateEmail(email) || validatePhone(tel) || passwordStopper) {
      window.location.href = 'index.html';
    }
  } else {
    let admin = {
      email: 'admin@gmail.com',
      password: 'Admin123!',
      company: 'Admin'
    };
  
    if (email == admin.email && password == admin.password && companyName == admin.company) return true;
  };
  
  
};

function validateName (name) {
  let errors = '';
  const ERROR_LABEL = document.querySelector('.label-for-name');

  if (name.split('').filter(e => numbers.includes(e) || symbols.includes(e)).length > 0) errors += "Name shouldn't contains any number or symbol. ";
  if (name.length <= 2) errors += "Length shoud be more than 2 letters. "

  if (errors.length > 0) {
    ERROR_LABEL.textContent = errors;
    return false;
  }
  
  ERROR_LABEL.textContent = errors;
  return true;
};

function validateEmail (email) {
  let errors = '';
  const ERROR_LABEL = document.querySelector('.label-for-email');

  if (email.split('').filter(e => e == '@' || e == '.').length == 0) errors += "Incorrect email";

  if (errors.length > 0) {
    ERROR_LABEL.textContent = errors;
    return false;
  }
  
  ERROR_LABEL.textContent = errors;
  return true;
};


function validatePhone (tel) {
  let errors = '';
  const ERROR_LABEL = document.querySelector('.label-for-tel');

  if (tel.split('').filter(e => numbers.includes(e)).length !== tel.length || tel.length == 0 || tel.length > 10) errors += "Incorrect number";

  if (errors.length > 0) {
    ERROR_LABEL.textContent = errors;
    return false;
  }
  
  ERROR_LABEL.textContent = errors;
  return true;
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
    FORM_BUTTON.preventDefault();
  } else {
    passwordStopper = 1;
  }
};

function loginUser (email, password, companyName) {


  return false;
}
 
})();