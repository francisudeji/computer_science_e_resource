var uploadForm = $(".upload-form");

uploadForm.on("submit", function(e) {
  e.preventDefault();
  var bookTitle = $("#book-title").val();
  var bookCover = $("#book-cover")[0].files[0];
  var bookFile  = $("#book-file")[0].files[0];
  var bookSlug  = bookTitle.toLowerCase().split("").join("-");

  submitForm(bookTitle, bookCover, bookFile);
});

function submitForm(title, cover, file) {

  console.log({title, cover, file})

  var formData = new FormData()
  formData.append("title", title)
  formData.append("cover", cover)
  formData.append("file", file)

  $.ajax({
    method: "POST",
    url: "./upload.php",
    dataType: "json",
    cache: false,
    contentType: false,
    processData: false,
    data: {
      key: "book-upload",
      formData: formData
    },
    success: function(success) {
      console.log({success})
    },
    error: function(err) {
      console.log(err.responseText)
    }
  });

}
