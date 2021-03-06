<%--
  User: Vihanga Liyanage
  Date: 12/16/2017
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Hitech Smart Factory</title>

    <%--Favicon--%>
    <link rel="shortcut icon" href="favicon.ico?" type="image/x-icon" />

    <!--Jquery all-->
    <link rel="stylesheet" href="css/jquery-ui.min.css">
    <script src="js/jquery-1.12.4.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>

    <!--Bootstrap-->
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" media="screen" />

    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />

    <script type="text/javascript" src="js/helper.js"></script>
    <script type="text/javascript" src="js/user-manager.js"></script>

</head>
<body>
<div id="wrapper">
    <div id="header">
        <div id="headerimg">
            <span>Hitech Smart Factory</span>
            <div style="float:right; color: black; position: absolute; top: 6px; right: 86px;">
                <button class="btn btn-default" onclick="switchToAdminDashboard()">Admin Dashboard</button>
            </div>
            <div style="float:right; color: black; position: absolute; top: 6px; right: 6px;">
                <button class="btn btn-default" onclick="signout()">Sign out</button>
            </div>
        </div>
        <div id="button-panel" style="text-align: center;">Welcome to User Management!</div>
    </div>

    <div id="main-panel" class="col-md-12">
        <div id="user-table-wrapper" class="col-lg-7" style="padding: 10px; border-right: 7px solid #e7e6e6; height: 100%">
            <button id="add-user-btn" class="btn btn-default" onclick="showAddUser()"
                    style="margin-bottom: 10px;">
                Add New User
            </button>
            <table id="user-table" class="table table-hover table-bordered table-sm" style="font-size: 15px;">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div id="permission-grid-wrapper" class="col-lg-5" style="padding: 10px;">
            <div id="permission-grid-header" style="font-weight: 600;margin-bottom: 5px;">Select user to view permissions</div>
            <button id="update-permissions-btn" class="btn btn-default" onclick="updatePermissionsBtnClick();return false;"
                    style="position: absolute; top: 10px; right: 10px;">
                Update Permissions
            </button>
        </div>
    </div>

</div>

<div id="action-form-background">
    <!--This is used to disable the background-->
</div>

<form id="update-user" class="action-form" method="post">
    <h4 style="text-align: center;">Update User</h4>
    Name:
    <input type="text" id="update-user-name" class="input-box" name="name">
    <br><br>
    <input type="submit" class="submit-btn" value="Update" onclick="updateUserName();return false;">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideForm('update-user');return false;">
</form>

<form id="add-user" class="action-form" method="post">
    <h4 style="text-align: center;">Add New User</h4>
    Name:
    <input type="text" id="add-user-name" class="input-box" name="name">
    <br><br>
    Username:
    <input type="text" id="add-user-username" class="input-box" name="username">
    <br><br>
    Password:
    <input type="password" id="add-user-password" class="input-box" name="password">
    <br><br>
    Admin User:
    <input type="checkbox" id="add-user-admin-check" class="input-box" name="admin">
    <br><br>
    <input type="submit" class="submit-btn" value="Add" onclick="createNewUser();return false;">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideForm('add-user');return false;">
</form>

</body>
</html>
