<%--
  Created by Vihanga Liyanage on 7/12/17.
  All rights reserved.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Hitech Smart Factory</title>

    <%--Favicon--%>
    <link rel="shortcut icon" href="favicon.ico?" type="image/x-icon" />

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&subset=latin,cyrillic-ext" rel="stylesheet"
          type="text/css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">

    <!-- Waves Effect Css -->
    <link href="plugins/node-waves/waves.css" rel="stylesheet"/>

    <!-- Animation Css -->
    <link href="plugins/animate-css/animate.css" rel="stylesheet"/>

    <!--Bootstrap-->
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" media="screen" />

    <%-- custom css --%>
    <link rel="stylesheet" href="css/index-page.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />

</head>
<body class="login-page theme-blue">

    <div class="login-box">
            <div class="logo">
                <img src="images/hitech/hitech-logo.jpg" style="display: block;margin: auto; width: 150px; border: 1px solid gray;"/>
                <a href="javascript:void(0);"><b>Hitech Smart Factory</b></a>
                <small>Automation monitoring made easy!</small>
            </div>
            <div class="card">
                <div class="body">
                    <form id="sign_in" name="loginForm">
                        <div class="msg">Sign in to start your session</div>
                        <div id="respond"></div>
                        <div class="input-group">
                    <span class="input-group-addon">
                        <i class="material-icons">person</i>
                    </span>
                            <div class="form-line">
                                <input type="text" class="form-control" name="username" id="username" placeholder="Username"
                                       required autofocus>
                            </div>
                        </div>
                        <div class="input-group">
                    <span class="input-group-addon">
                        <i class="material-icons">lock</i>
                    </span>
                            <div class="form-line">
                                <input type="password" class="form-control" name="password" id="password" placeholder="Password"
                                       required >
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-8 p-t-5">
                                <input type="checkbox" name="remember" id="remember" class="filled-in chk-col-blue">
                                <label for="remember">Remember Me</label>
                            </div>
                            <div class="col-xs-4">
                                <button class="btn btn-block bg-deep-orange waves-effect" id="loginButton">SIGN IN</button>
                            </div>
                        </div>
                        <div class="row m-t-15 m-b--20">
                        </div>
                    </form>
                </div>
            </div>
        </div>

</div>
    <%--<jsp:forward page="/FactoryController" />--%>

<!--Jquery all-->
<link rel="stylesheet" href="css/jquery-ui.min.css">
<script src="js/jquery-1.12.4.min.js"></script>
<script src="js/jquery-ui.min.js"></script>

<%-- Custom JS --%>
<script type="text/javascript" src="js/helper.js"></script>
<script type="text/javascript" src="js/SHA256.js"></script>
<script type="text/javascript" src="js/index.js"></script>

<!-- Bootstrap Core Js -->
<script src="js/bootstrap.js"></script>

<!-- Waves Effect Plugin Js -->
<script src="plugins/node-waves/waves.js"></script>

<!-- Validation Plugin Js -->
<script src="plugins/jquery-validation/jquery.validate.js"></script>

<!-- Custom Js -->
<script src="js/admin.js"></script>


</body>
</html>
