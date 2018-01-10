
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
        var username = $("#username").val();
        // ajaxSend(loginData,"userLogin");
        // By pass login

        // todo if(loginSuccess) {
        getUserDetails(username);
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
            // console.log(response);
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
