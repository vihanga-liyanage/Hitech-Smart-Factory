
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
        $('#loginButton').text("Loading...");
        $('#loginButton').prop("disabled",true);
        e.preventDefault();
        var username = $("#username").val();

        // request password from DSS and match
        $.ajax({
            type: "POST",
            url: GCP + ":9763/services/getPassword/get_password",
            headers: {
                "Content-Type":"application/json"
            },
            data: JSON.stringify({
                _postget_password: {
                    username: username
                }
            }),
            dataType: "json",
            success: function (response) {
                var hash = response.passwords.password["0"].password;
                if (hash == SHA256($("#password").val())) {
                    getUserDetails(username);
                } else {
                    alert("Incorrect username/ password combination!");
                    $('#loginButton').text("SIGN IN");
                    $('#loginButton').prop("disabled",false);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
                console.log(status, error);
            }
        });
    }
});

function getUserDetails(username) {
    $.ajax({
        type: "POST",
        url: GCP + ":9763/services/getBasicUserDetails/get_basic_user_details",
        headers: {
            "Content-Type":"application/json"
        },
        data: JSON.stringify({
            _postget_basic_user_details: {
                username: username
            }
        }),
        dataType: "json",
        success: function (response) {
            console.log(response);
            var userObj = {};
            if (response.UserDetails.User) {
                var user = response.UserDetails.User[0];
                userObj.username = username;
                userObj.uid = user.userid;
                userObj.name = user.name;
                userObj.usertype = user.userType;
                userObj.fid = user.fid;
                userObj.factoryName = user.FactoryNames.FactoryName["0"].Name;

                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("userObj", JSON.stringify(userObj));
                    window.location.replace("dashboard.html");
                } else {
                    alert("Error!");
                    console.log("Sorry! No Web Storage support..");
                }

            } else {
                alert("Error!")
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status, error);
        }
    });
    // var userObj = {};
    // userObj.username = username;
    // userObj.uid = 1;
    // userObj.name = 'Poornima Karunarathna';
    // userObj.usertype = 'b';
    // userObj.fid = 3;
    // userObj.factoryName = "Bata Shoe Factory";
    //
    // if (typeof(Storage) !== "undefined") {
    //     localStorage.setItem("userObj", JSON.stringify(userObj));
    //     window.location.replace("dashboard.html");
    // } else {
    //     alert("Error!");
    //     console.log("Sorry! No Web Storage support..");
    // }
}