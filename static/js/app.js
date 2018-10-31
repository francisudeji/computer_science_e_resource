var viewer = $(".viewer");
var entry = $(".category");
var modalTitle = $(".modal-title");

var books = [];

$(document).ready(function() {
  axios
    .get("http://localhost:1234/api/books")
    .then(function(res) {
      books = [...books, ...res.data.books];
      console.log(books);
      entry.html(
        books
          .map(function(book) {
            return `
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">

            <div class="card pdf-card mb-5">
              <img class="card-img-top" src="./uploads/${
                book.cover
              }" alt="Card image cap" style="max-height: 220px; object-fit:cover;">
              <div class="card-body">
                <span class="badge badge-primary mb-3">${book.category}</span>
                <h5 class="card-title">${book.title}</h5>
                <button data-target="#exampleModal" data-toggle="modal" data-pdf="./uploads/${
                  book.file
                }" href="#" class="btn btn-primary read">Read On</button>
              </div>
            </div>

          </div>
        `;
          })
          .join("")
      );
    })
    .catch(function(err) {
      console.log(err);
    });

  // entry.html(renderFiles());
  $(".category").click(function(e) {
    if (e.target.className.includes("read")) {
      var fileName = e.target.dataset.pdf;
      modalTitle.html(e.target.dataset.name);
      PDFObject.embed(fileName, viewer);
    }
  });
});

var loginForm = document.querySelector('.login-form')
loginForm.addEventListener('submit', function(e) {
  e.preventDefault()
  var username = loginForm.querySelector('#username').value
  var password = loginForm.querySelector('#password').value

  if(username === 'admin' && password === '1234') {
    location.href = 'http://localhost:1234/admin.html'
  } else {
    var error = `<div class='alert alert-danger'>Wrong username or password</div>`
    $('.login-message').html(error)
  }

  console.log({username, password})
})


$('.search').on('keyup', function(e) {
  var text = e.target.value
  books.forEach(function(book) {
    if(book.title.toLowerCase().includes(text.toLowerCase())) {
      console.log(book)
    }
  })
})