/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
$(function () {
    $('#sign_in').validate({
        highlight: function (input) {
            // console.log(input);
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
