$(function () {
    $('#sign_in').validate({
        highlight: function (input) {
            console.log(input);
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        }
    });
});

var loginForm = $("#sign_in");

$('#loginButton').click(function (e) {
    if (loginForm.valid()) {
        e.preventDefault();
        var loginData = loginForm.serialize();
        // ajaxSend(loginData,"userLogin");
        // By pass login
        window.location.replace("dashboard.html");
    }
});


function ajaxSend(params, action) {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/login",
        data: params + "&action=" + action,
        dataType: "json",
        success: function (response) {
            switch (action) {
                case "userLogin":
                    if (response.success == true) {
                        document.getElementById("sign_in").reset();
                        window.location.replace(response.path);
                    } else {
                        $("#respond").hide().html('<div class="alert bg-red" >' + response.msg + '</div>').slideDown("slow");
                    }
                    break;
            }

        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status, error);
        }

    });

}
