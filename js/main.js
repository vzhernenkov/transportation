//const e = require("express");

(() => {


  
//GlOBAL VARIABLES

let overlay = document.querySelector('.overlay');

overlay.addEventListener('click', function (e) {
  let target = e.target;
  //console.log(target);
  if (target.textContent == 'Log out') {
    e.preventDefault();
    if (confirm('Are you sure, that you want to log out?')) {
      logOut();
      redirect('../spot/');
    }
  }
});

// LOGIN & REGISTRATION

if (document.title == "Register"){


  let FORM_BUTTON = document.querySelector('.form__button');
  let password = document.getElementById('password');
  const TAB_BUTTONS = document.querySelector(".form__switcher");

  FORM_BUTTON.addEventListener('click', validateRegistration);

  TAB_BUTTONS.addEventListener('click', function (e) {
    let target = e.target;
    if (target.classList.contains('orders__navbutton') && target) {
      removeClassFromTabButtons ('orders__navbutton', 'navbutton-active');
      tabActiveButton(target);  
    }
  })

  // password.addEventListener('input', function(e) {
  //   let password = e.target.value;
  //   validatePassword(password);
  // });

};

if (document.title == "Login") {
  const FORM_BUTTON = document.querySelector('.form__button');
  const TAB_BUTTONS = document.querySelector(".form__switcher");


  FORM_BUTTON.addEventListener('click', validateLogin);

  TAB_BUTTONS.addEventListener('click', function (e) {
    let target = e.target;
    if (target.classList.contains('orders__navbutton') && target) {
      removeClassFromTabButtons ('orders__navbutton', 'navbutton-active');
      tabActiveButton(target);  
    }
  })
};


// CARRIER CABINET

if (document.title == "Orders") {
  showActiveUser();
  renderOrdersList();

  const TAB_BUTTONS = document.querySelector(".orders__nav-list");
  const LOGOUT = document.querySelector(".orders__nav-list");
  
  TAB_BUTTONS.addEventListener('click', function (e) {
    let target = e.target;
    if (target.classList.contains('orders__navbutton') && target) {
      removeClassFromTabButtons ('orders__navbutton', 'navbutton-active');
      tabActiveButton(target);
      hideAllTabs ('orders', 'active__orders-list');
      showOrderList (target.textContent);      
    }
  })

}

if (document.title == "Fleet") {
  showActiveUser();

  createTruckList();

  let FORM = document.getElementById('transport__form');
  let truckList = document.querySelector('.transport__list');
  let searchButton = document.querySelector('.search__button'),
      editButton = document.querySelector('.edit__button'),
      cancelButton = document.querySelector('.cancel__button'),
      addButton = document.querySelector('.add__button');

  
editButton.addEventListener('click', function (e) {
 edit();
 FORM.reset();
});

cancelButton.addEventListener('click', function (e) {
  removeEditForm();
  removeEditTruck();
})
  

  searchButton.addEventListener('click', function(e) {
    let filteredList = filterTrucks();
    createFilteredList(filteredList);
  })

  truckList.addEventListener('click', function (e) {
    let target = e.target;

    if (target.classList.contains('transport__delete') && target) {
      deleteTruck(target);
    }

    if (target.classList.contains('transport__edit') && target) {
      let currentTruck = getTruckInfoFromCard(target);
      showEditTruck(target)
      showEditForm(currentTruck)
    }
  })

  addButton.addEventListener('click', async function (e) {
    e.preventDefault();
     let newTruck = createTruck();
     let respond = await addTruckToCompanyTruckList(newTruck);
     if(respond.status == 200) {
      createTruckList();
     } else {
       alert('Something went wrong. Try again later')
     }
      //FORM.reset();
  });

}

})();

//CLASSES

class Carrier {
  constructor (company, registerNumber, user, id) {
    this.company = company,
    this.id = `CRR${id}`,
    this.registerNumber = registerNumber,
    this.users = [user.id],
    this.trucks = [],
    this.trailers = [],
    this.drivers = [],
    this.orders = {
      active: [],
      completed: [],
      declined: []
    }
    this.scoring = 'Checking'
  }
}

class Shipper {
  constructor (company, registerNumber, user, id) {
    this.company = company,
    this.id = `SPR${id}`,
    this.registerNumber = registerNumber,
    this.users = [user.id],
    this.orders = {
      active: [],
      completed: [],
      declined: []
    }
    this.scoring = 'Checking'
  }
}

class Order {
  constructor (id, from, to, truckType, cargo, loadingDate, arrivalDate, price) {
    this.id = `ARG${id}`,
    this.from = from,
    this.to = to,
    this.truckType = truckType,
    this.cargo = cargo,
    this.loadingDate = loadingDate,
    this.arrivalDate = arrivalDate,
    this.status = 'vacant',
    this.carrier = {
      company: null,
      user: null,
      truckType: null,
      driver: null,
      truck: null,
      trail: null,
      financeShipper: {
        "price": price,
        paymentDate: null,
        paymentType: null,
        documentStatus: null,
        paymentStatus: null,
      }
    },
    this.shipper = {
      company: null,
      user: null,
      financeCarrier: {
        "price": price,
        paymentDate: null,
        paymentType: null,
        documentStatus: null,
        paymentStatus: null, 
      }
    }
  }
}

class User {
  constructor (firstName = '', lastName = '', phone, email, password, id) {
    this.id = `USR${id}`
    this.firstName = firstName,
    this.lastName = lastName,
    this.phone = phone,
    this.email = email,
    this.password = password,
    this.companies = {
      "carrier": [],
      "shipper": [],
      "admin": false,
    },
    this.settings = {}
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

class Trail {
  constructor (name, driver, number, location, type) {
    this.name = name,
    this.driver = driver,
    this.number = number,
    this.location = location,
    this.type = type,
    this.scoring = 'Unverified'
  }
};

class Driver {
  constructor (name, driver, number, location, type) {
    this.name = name,
    this.driver = driver,
    this.number = number,
    this.location = location,
    this.type = type,
    this.scoring = 'Unverified'
  }
};

// let cities = ["Buenos Aires","Almirante Brown","Bahía Blanca","Caseros","Ezeiza","General San Martín","Junín","Lanús","La Plata","Lomas de Zamora","Luján","Mar del Plata","Merlo","Morón","Olivos","Pergamino","Quilmes","San Isidro","San Justo","San Nicolás de los Arroyos","Tandil","Tigre","Zárate","Catamarca","Catamarca","Chaco","Resistencia","Buenos Aires","Chubut","Comodoro Rivadavia","Rawson","Córdoba","Córdoba","Río Cuarto","San Francisco","Villa María","Corrientes","Corrientes","Entre Ríos","Concepción del Uruguay","Concordia","Gualeguaychú","Paraná","Formosa","Formosa","Jujuy","San Salvador de Jujuy","Mendoza","Godoy Cruz","Mendoza","San Rafael","Villa Nueva","Misiones","Posadas","Neuquén","Neuquén","La Pampa","Santa Rosa","La Rioja","La Rioja","Río Negro","San Carlos de Bariloche","Viedma","Salta","Salta","San Juan","San Juan","San Luis","Mercedes","San Luis","Santa Cruz","Río Gallegos","Santa Fe","Rosario","San Lorenzo","Santa Fe","Santiago del Estero","Santiago del Estero","Tierra del Fuego","Ushuaia","Tucumán","San Miguel de Tucumán"];
// let type = ["TILT", "REF"];
// let dates = [["20.08.2023","23.08.2023"],["21.08.2023","24.08.2023"],["21.08.2023","24.08.2023"],["22.08.2023","25.08.2023"],["22.08.2023","25.08.2023"],["23.08.2023","26.08.2023"],["23.08.2023","26.08.2023"],["24.08.2023","27.08.2023"],["24.08.2023","27.08.2023"],["25.08.2023","28.08.2023"],["25.08.2023","28.08.2023"],["26.08.2023","29.08.2023"],["26.08.2023","29.08.2023"],["27.08.2023","30.08.2023"],["27.08.2023","30.08.2023"],["28.08.2023","31.08.2023"],["28.08.2023","31.08.2023"],["29.08.2023","01.09.2023"],["29.08.2023","01.09.2023"],["30.08.2023","02.09.2023"],["30.08.2023","02.09.2023"],["31.08.2023","03.09.2023"],["31.08.2023","03.09.2023"],["01.09.2023","04.09.2023"],["01.09.2023","04.09.2023"],["02.09.2023","05.09.2023"],["02.09.2023","05.09.2023"],["03.09.2023","06.09.2023"],["03.09.2023","06.09.2023"],["04.09.2023","07.09.2023"],["04.09.2023","07.09.2023"],["05.09.2023","08.09.2023"],["05.09.2023","08.09.2023"],["06.09.2023","09.09.2023"],["06.09.2023","09.09.2023"],["07.09.2023","10.09.2023"],["07.09.2023","10.09.2023"],["08.09.2023","11.09.2023"],["08.09.2023","11.09.2023"],["09.09.2023","12.09.2023"],["09.09.2023","12.09.2023"],["10.09.2023","13.09.2023"],["10.09.2023","13.09.2023"],["11.09.2023","14.09.2023"],["11.09.2023","14.09.2023"],["12.09.2023","15.09.2023"],["12.09.2023","15.09.2023"],["13.09.2023","16.09.2023"],["13.09.2023","16.09.2023"],["14.09.2023","17.09.2023"],["14.09.2023","17.09.2023"],["15.09.2023","18.09.2023"],["15.09.2023","18.09.2023"],["16.09.2023","19.09.2023"],["16.09.2023","19.09.2023"]];
// let temp = ["+5", "-5", "+18"];
// let refCargo = ["products"];
// let tiltCargo = ["materials"];

// function generateOrders (cities, type, dates, temp, quantity) {
//   let res = [];
//   for (let index = 0; index < quantity; index++) {
//     let cityFrom = randomiser(cities);
//     let cityTo = randomiser(cities);
//     let truck = "REF"
//     let date = randomiser(dates);
//     let t = "+5";
//     let cargo = `products${t}`;
//     let order = new Order (`ARG${index}`, cityFrom, cityTo, truck, cargo, date[0], date[1], `${Math.round(Math.random() * 5000)}`);
//     res.push(order);
//   }
//   return res;
// };

// function randomiser (arr) {
//   let index = Math.round(Math.random() * arr.length);
//   return arr[index]
// }

// console.log(generateOrders(cities, type, dates, temp, 100));



//FUNCTIONS

//Fleet

function createTruck () {

  let name = document.querySelector('#truck__name').value,
      driver = document.querySelector('#truck__driver').value,
      number = document.querySelector('#truck__number').value,
      location = document.querySelector('#truck__location').value,
      type = [...document.querySelectorAll('.form__radio')].filter(el => el.checked)[0].id;
  
  let truck = new Truck (name, driver, number, location, type);
  
  return truck;
};

async function createTruckList () {
  let company = await getCurrentCompany().then(data => data);
  let trucks = company.trucks;
  let list = document.querySelector('.transport__list');
  let cards = ''
  list.innerHTML = "";

  trucks.forEach(el => {
    cards += `<li class="transport__item">
                <div class="transport__card">
                <div class="transport__information">
                  <div class="information__item">
                    <div class="transport__info transport__name">Truck name: <span class="info truck__name">${el.name}</span></div>
                    <div class="transport__info transport__driver">Driver: <span class="info truck__driver">${el.driver}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__number">Number: <span class="info truck__number">${el.number}</span></div>
                    <div class="transport__info transport__type">Type: <span class="info">${el.type}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__location">Current location: <span class="info truck__location">${el.location}</span></div>
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


function showEditTruck (truck) {
  let currentTruckCard = truck.closest('.transport__item');

  removeEditTruck();
  currentTruckCard.style.border = "2px solid red";
  currentTruckCard.classList.add('check');
};

function getTruckInfoFromCard (truck) {
  let currentTruckCard = truck.closest('.transport__item'),
      truckName = currentTruckCard.querySelector('.truck__name').textContent,
      driver = currentTruckCard.querySelector('.truck__driver').textContent,
      truckNumber = currentTruckCard.querySelector('.truck__number').textContent,
      location = currentTruckCard.querySelector('.truck__location').textContent;

  return {
    truckName: truckName,
    driver: driver,
    truckNumber: truckNumber,
    location: location
  }
}

function showEditForm (obj) {
  let header = document.querySelector('.transport__list-header'),
      editButton = document.querySelector('.edit__button'),
      cancelButton = document.querySelector('.cancel__button'),
      addButton = document.querySelector('.add__button'),
      inputs = document.querySelectorAll('.form__input'),
      radio = document.querySelectorAll('.form__radio'),
      name = document.querySelector('#truck__name'),
      driver = document.querySelector('#truck__driver'),
      number = document.querySelector('#truck__number'),
      location = document.querySelector('#truck__location');

  name.value = obj.truckName;
  driver.value = obj.driver;
  number.value = obj.truckNumber;
  location.value = obj.location;

  inputs.forEach(el => {
    el.required = false;
  });

  radio.forEach(el => {
    el.required = false;
  });

  editButton.style.display = 'inline-block';
  cancelButton.style.display = 'inline-block';
  addButton.style.display = 'none';

  header.textContent = "Enter new info";
};

function removeEditTruck () {
  let allCards = document.querySelectorAll('.transport__item');

  allCards.forEach(el => {
    el.style.border = "";
    el.classList.remove('check');
  })
};

function removeEditForm () {
  let header = document.querySelector('.transport__list-header'),
  editButton = document.querySelector('.edit__button'),
  cancelButton = document.querySelector('.cancel__button'),
  addButton = document.querySelector('.add__button');
  inputs = document.querySelectorAll('.form__input');
  radio = document.querySelectorAll('.form__radio');

inputs.forEach(el => {
el.required = true;
el.value = '';
});


radio.forEach(el => {
el.required = true;
el.checked = false;
});


editButton.style.display = 'none';
cancelButton.style.display = 'none';
addButton.style.display = 'block';

header.textContent = "Add your truck";
};

function edit () {
  let name = document.querySelector('#truck__name').value,
      driver = document.querySelector('#truck__driver').value,
      number = document.querySelector('#truck__number').value,
      location = document.querySelector('#truck__location').value,
      type = [...document.querySelectorAll('.form__radio')].filter(el => el.checked)[0],
      editTruck = document.querySelector('.check');

  editTruckInformation(editTruck, name, driver, number, location, type);
  removeEditForm();
  createTruckList();
};

async function editTruckInformation (truck, newname, newdriver, newnumber, newlocation, newtype) {
  let currentTruckName = truck.querySelector('.truck__name').textContent,
      company = await getCurrentCompany().then(data => data);
  company.trucks.map(el => {
    if (el.name == currentTruckName) {
      if(newname) el.name = newname;
      if(newdriver) el.driver = newdriver;
      if(newnumber) el.number = newnumber;
      if(newlocation) el.location = newlocation;
      if(newtype) el.type = newtype;
    }
  })

  editCompany(company);
}

async function filterTrucks () {
  let trucks = await getCurrentCompany().then(data => data.trucks);
  let searchOption = document.querySelector('#truck__filter').value;
  let searchInfo = document.querySelector('.search__input').value;
  
  return trucks.filter(el => {
      return el[searchOption].includes(searchInfo);
  }) 
};

function createFilteredList (trucks) {
  let list = document.querySelector('.transport__list');
  let cards = ''
  list.innerHTML = "";

  trucks.forEach(el => {
    cards += `<li class="transport__item">
                <div class="transport__card">
                <div class="transport__information">
                  <div class="information__item">
                    <div class="transport__info transport__name">Truck name: <span class="info truck__name">${el.name}</span></div>
                    <div class="transport__info transport__driver">Driver: <span class="info truck__driver">${el.driver}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__number">Number: <span class="info truck__number">${el.number}</span></div>
                    <div class="transport__info transport__type">Type: <span class="info">${el.type}</span></div>
                  </div>
                  <div class="information__item">
                    <div class="transport__info transport__location">Current location: <span class="info truck__location">${el.location}</span></div>
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
}

async function deleteTruck (truck) {
  if (confirm('Are you sure, that you want to delete your truck?')) {
    let company = await getCurrentCompany().then(data => data),
        currentTruckCard = truck.closest('.transport__item'),
        truckName = currentTruckCard.querySelector('.truck__name').textContent;
        truckCardNumber = currentTruckCard.querySelector('.truck__number').textContent;
        company.trucks = company.trucks.filter(el => el.name !== truckName && el.truckNumber !== truckCardNumber);
    
    editCompany(company);
    createTruckList();
  };
} //CHECK

async function addTruckToCompanyTruckList (truck) {
  let company = await getCurrentCompany().then(data => data);
  company.trucks.push(truck);
  let payload = {
    registerNumber: company.registerNumber,
    trucks: company.trucks
  }

  let res = await fetch("http://localhost:3333/carrier", {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
  return res
  // fetch(`http://localhost:3333/carrier/${company.registerNumber}/trucks`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(truck)
  // })

}; //CHECK

//Orders

function tabActiveButton(button) {
  button.classList.add('navbutton-active')
};

function removeClassFromTabButtons (elementsClass, activeClass) {
  let buttons = document.querySelectorAll(`.${elementsClass}`);
  
  buttons.forEach(el => {
    el.classList.remove(`${activeClass}`);
  })
};

function hideAllTabs (elementsToHide, classToRemove) {
  let tabs = document.querySelectorAll(`.${elementsToHide}`);

  tabs.forEach(el => {
    el.classList.remove(`${classToRemove}`);
  })
};

function showOrderList (id) {
  let element = document.getElementById(`${id}`);

  element.classList.add('active__orders-list');
};

async function renderOrdersList () {
  let orders = await getOrdersFromServer().then(data => data);
  let list = document.getElementById('Vacant');

  orders.forEach(el => {
    list.append(createOrder(el));
  })
}

function createOrder(obj) {
  let li = document.createElement('li');

  li.innerHTML = `<li class="order__cart">
  <div class="order__description order__id">${obj.id}</div>
  <div class="order__direction">
    <div class="order__description order__from">${obj.from}</div>
    <div class="order__dash"></div>
    <div class="order__description order__to">${obj.to}</div>
  </div>
  <div class="order__cargo-block">
    <div class="order__description order__type">${obj.truckType}</div>
    <div class="order__description order__cargo">${obj.cargo}<span class="order__temperature"></span></div>
  </div>
  <div class="order__dates">
    <div class="order__description order__load-date">${obj.loadingDate}</div>
    <div class="order__dash"></div>
    <div class="order__description order__unload-date">${obj.arrivalDate}</div>
  </div>
  <div class="order__description order__price">${obj['carrier']['financeCarrier']['price']}$</div>
  <div class="order__buttons">
    <button class="order__pick-up-button">More info</button>
  </div>
</li>`;
return li;
}

// Clent <----> Server data functions


  //Getters

async function getCarriersFromServer () {
  let response = await fetch("http://localhost:3333/carrier")
  let carriers = await response.json();
  return carriers;
};

async function getShippersFromServer () {
  let response = await fetch("http://localhost:3333/shipper")
  let shippers = await response.json();
  return shippers;
};

async function getUsersFromServer () {
  let response = await fetch("http://localhost:3333/user")
  let users = await response.json();
  return users;
};

async function getOrdersFromServer () {
  let response = await fetch("http://localhost:3333/orders")
  let orders = await response.json();
  return orders;
}

async function getCurrentUser() {
  let email = getLoginedInfo('user');
  let users = await getUsersFromServer().then(data => data);
  
  return users.filter(el => el.email == email)[0];
}

async function getCurrentCompany() {
  let regNumber = getLoginedInfo('company');
  let companyType = getLoginedInfo('role');
  let companies;

  if (companyType == 'shipper') {
    companies = await getShippersFromServer().then((data) => data);
  } else {
    companies = await getCarriersFromServer().then((data) => data);
  }

  return companies.filter(el => el.registerNumber == regNumber)[0];
};

async function getCompanyByNumber (number, type) {
  let response = await fetch(`http://localhost:3333/${type}`);
  let companies = await response.json();

  return companies.filter(el => el.registerNumber == number)[0];
};

async function getUserFromServer(email, password) {
  let response = await fetch("http://localhost:3333/user")
  let users = await response.json();

  return users.filter(el => el.email == email && el.password == password)[0];
}

async function getCompanyById (id, type) {
  let response = await fetch(`http://localhost:3333/${type}`);
  let companies = await response.json();

  return companies.filter(el => el.id == id)[0];
}
  //Checkers


async function checkCarrierInCarriers (company) {
  let companies = await getCarriersFromServer().then(data => data);
  let res = companies.some(el => el.registerNumber == company.registerNumber);
  return res;
};

async function checkShipperInShippers (company) {
  let companies = await getShippersFromServer().then(data => data);
  let res = companies.some(el => el.registerNumber == company.registerNumber);
  return res;
};

function checkUserInCompany (company, email) {
  let users = company.users;
  let res = users.some(el => el.email == email);

  return res;
};

async function checkUserInUsers (user) {
  let users = await getUsersFromServer().then(data => data);
  let res = users.some(el => el.email == user.email);  
  return res;
};

  //Creators

function createCarrier (company) {
  fetch ('http://localhost:3333/carrier', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(company)
  })
};

function createShipper (company) {
  fetch ('http://localhost:3333/shipper', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(company)
  })
};

function createUser (user) {
  fetch ('http://localhost:3333/user', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(user)
  })
};

async function createID(type) {
  let response = await fetch(`http://localhost:3333/${type}`);
  let companies = await response.json();

  return companies.length;
};





function addUserToCompany (user, company) {
  company.users.push(user.id);
};


//LocalStorage


function recordLoginUser (email, companyNumber, role) {
  let login = [email, companyNumber, role]

  localStorage.setItem('loginSession', JSON.stringify(login));
};

function logOut () {
  localStorage.removeItem('loginSession');
};

function getLoginedInfo (type) {
  let info = JSON.parse(localStorage.getItem('loginSession'));

  if (type == 'user') return info[0];
  if (type == 'company') return info[1];
  if (type == 'role') return info[2];
}




async function showActiveUser () {
  let user = await getCurrentUser().then(data => data);
  
  let userLabel = document.getElementById('user');

  userLabel.textContent = `${user.firstName} ${user.lastName}`;
}




function editCompany (company) {
  fetch ('http://localhost:3333/carrier', {
    method: 'PATCH',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(company)
  })
} //CHECK

async function checkLoginUser (email, password) {
  let user = await getUserFromServer(email, password).then(data => data);
  let role = document.querySelector('.navbutton-active').textContent.toLowerCase();
  let company;
  let id;

  if (user) {
    logOut();
    if (role == 'shipper') {
      id = user.companies.shipper[0];
      company = await getCompanyById(id, role).then(data => data);
      recordLoginUser(email, company.registerNumber, role);
      redirect('../shippers/');
    } else {
      id = user.companies.carrier[0];
      company = await getCompanyById(id, role).then(data => data);
      recordLoginUser(email, company.registerNumber, role);
      redirect('../orders/');
    }
  } else {
    alert("Invalid email or password");
  }
} // CHECK


function redirect (link) {
  window.location.href = `${link}`;
}

function setUserRole (user, role) {

}


//Validators

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
  
  // if (!password) {
  //   message('This field is required', 'password');
  //   bigLetter.style.color = 'black';
  //   symbol.style.color = 'black';
  //   length.style.color = 'black';
  //   number.style.color = 'black';
  // };

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
  const LABEL = document.querySelector(`#${id}`).closest('.form__group').querySelector('.form__error-label');

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

function validateLogin (e) {
  e.preventDefault();
  
  let email = document.getElementById('email').value ,
      password = document.getElementById('password').value;

      checkLoginUser(email, password);
};

async function validateRegistration (e) {

  e.preventDefault();
  
  let email = document.getElementById('email').value ,
      password = document.getElementById('password').value,
      firstName = document.getElementById('firstname').value,
      lastName = document.getElementById('lastname').value,
      tel = document.getElementById('phone').value,
      company = document.getElementById('company').value,
      companyNumber = document.getElementById('companyNumber').value,
      role = document.querySelector('.navbutton-active').textContent.toLowerCase();
      form = document.getElementById('form__register');
      
    
    // validateStr(firstName, 'firstname');
    // validateStr(lastName, 'lastname');
    // validateStr(company, 'company');
    // validatePhone(companyNumber, 'companyNumber');
    // validateEmail(email, 'email');
    // validatePhone(tel, 'phone');
    // validatePassword(password);
    
    let id = await createID('user').then(data => data);
    let user = new User (firstName, lastName, tel, email, password, id);
    let checkUser = await checkUserInUsers(user).then(data => data).catch(err => true);
    

    if (checkErrors(form) && !checkUser) {

      if (role == 'carrier') {
        
        let carrierCompany;
        let checkCompany = await checkCarrierInCarriers(companyNumber).then(data => data);
        
        if (!checkCompany) {
          
          let carrierID = await createID ('carrier').then(data => data);
          carrierCompany = new Carrier (company, companyNumber, user, carrierID); 
          createCarrier (carrierCompany);
          user.companies.carrier.push(carrierCompany.id);

        } else {
          
          carrierCompany = await getCompanyByNumber(companyNumber, 'carrier').then(data => data);
          addUserToCompany(user, carrierCompany);
          editCompany (carrierCompany); // CHECK
          user.companies.carrier.push(carrierCompany.id);
        }
        
        logOut();
        createUser(user);
        recordLoginUser(user.email, companyNumber, role);
        redirect('../orders/');

      } else if (role == 'shipper') {
        
        let shipperCompany;
        let checkCompany = await checkShipperInShippers(companyNumber).then(data => data);
        console.log(checkCompany);

        if (!checkCompany) {
          
          let shipperID = await createID ('shipper').then(data => data);
          shipperCompany = new Shipper (company, companyNumber, user, shipperID); 
          createShipper (shipperCompany);
          user.companies.shipper.push(shipperCompany.id);

        } else {
          
          shipperCompany = await getCompanyByNumber(companyNumber, 'shipper').then(data => data);
          addUserToCompany(user, shipperCompany);
          editCompany (shipperCompany); // CHECK
          user.companies.shipper.push(shipperCompany.id);
        }
        
        logOut();
        createUser(user);
        recordLoginUser(user.email, companyNumber, role);
        redirect('../shipper/');

      }
      


    }
};