<%--
  Created by Vihanga Liyanage on 7/12/17.
  All rights reserved.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<!DOCTYPE html>
<html lang="en">
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

    <%--<link rel="stylesheet" href="css/wordpress.css" type="text/css" media="screen" />--%>
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />

    <script type="text/javascript" src="js/system-admin-ui.js"></script>

</head>
<body>
<div id="wrapper">
    <div id="header">
        <div id="headerimg">
            Hitech Smart Factory
        </div>
        <div id="button-panel"></div>
    </div>

    <div id="main-panel" class="col-md-12">

        <div id="green-panel"></div>

        <div id="factories" class="box-btn-row">
            <p>Existing Factories</p>
            <div id="dynamic-factories"></div>
            <div class="box-btn-wrapper" id="factory-add-btn-wrapper"></div>
        </div>

        <div id="branches" class="box-btn-row">
            <p>Branches of <text id="selected-factory-name"></text></p>
            <div id="dynamic-branches"></div>
            <div class="box-btn-wrapper"><button class="box-btn branch" title="Create New Branch" onclick="displayAddForm('create-new-branch')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

        <div id="sections" class="box-btn-row">
            <p>Sections of <text id="selected-branch-name"></text></p>
            <div id="dynamic-sections"></div>
            <div class="box-btn-wrapper"><button class="box-btn section" title="Create New Section" onclick="displayAddForm('create-new-section')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

        <div id="prod-lines" class="box-btn-row">
            <p>Production Lines of <text id="selected-section-name"></text></p>
            <div id="dynamic-prod-lines"></div>
            <div class="box-btn-wrapper"><button class="box-btn prod-line" title="Create New Production Line" onclick="displayAddForm('create-new-prod-line')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

    </div>

</div>

<!--Action forms-->
<div id="action-form-background">
    <!--This is used to disable the background-->
</div>

<%-- Create Forms --%>
<form id="create-new-factory" class="action-form" method="post" action="FactoryController">
    <h4>Create New Factory</h4>
    Factory Name:
    <input type="text" class="input-box" name="factory-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Create">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('create-new-factory')">
</form>
<div id="create-new-branch" class="action-form">
    <h4>Create New Branch</h4>
    <p id="branch-parent-details"></p>
    Branch Name:
    <input type="text" class="input-box" id="branch-name">
    <br><br>
    Location:
    <input type="text" class="input-box" id="branch-location">
    <br><br>
    <input type="submit" class="submit-btn" value="Create" onclick="createNewBranch()">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('create-new-branch')">
</div>
<div id="create-new-section" class="action-form">
    <h4>Create New Section</h4>
    <p id="section-parent-details"></p>
    Section Name:
    <input type="text" class="input-box" id="section-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Create" onclick="createNewSection()">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('create-new-section')">
</div>
<div id="create-new-prod-line" class="action-form">
    <h4>Create New Production Line</h4>
    <p id="prod-line-parent-details"></p>
    Production Line Name:
    <input type="text" class="input-box" id="prod-line-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Create" onclick="createNewProdLine()">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('create-new-prod-line')">
</div>

<%-- Update Forms --%>
<div id="update-factory" class="action-form">
    <h4>Update Factory</h4>
    Factory Name:
    <input type="text" class="input-box" id="update-factory-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Update">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('update-factory')">
</div>
<div id="update-branch" class="action-form">
    <h4>Update Branch</h4>
    <p id="update-branch-parent-details"></p>
    Branch Name:
    <input type="text" class="input-box" id="update-branch-name">
    <br><br>
    Location:
    <input type="text" class="input-box" id="update-branch-location">
    <br><br>
    <input type="submit" class="submit-btn" value="Update">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('update-branch')">
</div>
<div id="update-section" class="action-form">
    <h4>Update Section</h4>
    <p id="update-section-parent-details"></p>
    Section Name:
    <input type="text" class="input-box" id="update-section-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Update">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('update-section')">
</div>
<div id="update-prod-line" class="action-form">
    <h4>Update Production Line</h4>
    <p id="update-prod-line-parent-details"></p>
    Production Line Name:
    <input type="text" class="input-box" id="update-prod-line-name">
    <br><br>
    <input type="submit" class="submit-btn" value="Update">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideAddForm('update-prod-line')">
</div>

</body>
</html>
