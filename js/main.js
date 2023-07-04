(() => {

document.querySelector('.form__button').addEventListener('click', function (e) {
  
  e.target.preventDefault();

  let name = document.querySelector('#name').value,
      email = document.querySelector('#email').value,
      password = document.querySelector('#password').value,
      company = document.querySelector('#company').value,
      phone = document.querySelector('#phone').value;

  console.log(name);
});

function message () {

}

})();