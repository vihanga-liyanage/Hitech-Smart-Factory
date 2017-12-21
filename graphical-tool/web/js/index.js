/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
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

    // todo remove temp
    // var temp = {
    //     "UserDetails": {
    //         "User": [
    //             {
    //                 "userid": 1,
    //                 "userType": "a",
    //                 "fid": 1,
    //                 "FactoryNames": {
    //                     "FactoryName": [
    //                         {
    //                             "Name": "Bata Shoe Factory"
    //                         }
    //                     ]
    //                 }
    //             }
    //         ]
    //     }
    // };
    // var userObj = {};
    // var user = temp.UserDetails.User[0];
    // if (user.userType == "a" || user.userType == "x") {
    //     userObj.username = username;
    //     userObj.uid = user.userid;
    //     userObj.usertype = user.userType;
    //     userObj.fid = user.fid;
    //     userObj.factoryName = user.FactoryNames.FactoryName["0"].Name;
    //
    //     if (typeof(Storage) !== "undefined") {
    //         localStorage.setItem("userObj", JSON.stringify(userObj));
    //         window.location.replace("/hitech-smart-factory/FactoryController");
    //     } else {
    //         alert("Error!");
    //         console.log("Sorry! No Web Storage support..");
    //     }
    // } else {
    //     alert("You don't have permission to access admin panel!")
    // }

    $.ajax({
        type: "POST",
        // todo use a config file for url
        url: "http://35.202.158.138:9763/services/getBasicUserDetails/get_basic_user_details",
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
                if (user.userType == "a" || user.userType == "x") {
                    userObj.username = username;
                    userObj.uid = user.userid;
                    userObj.usertype = user.userType;
                    userObj.fid = user.fid;
                    userObj.factoryName = user.FactoryNames.FactoryName["0"].Name;

                    if (typeof(Storage) !== "undefined") {
                        localStorage.setItem("userObj", JSON.stringify(userObj));
                        window.location.replace("/hitech-smart-factory/FactoryController");
                    } else {
                        alert("Error!");
                        console.log("Sorry! No Web Storage support..");
                    }
                } else {
                    alert("You don't have permission to access admin panel!")
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
