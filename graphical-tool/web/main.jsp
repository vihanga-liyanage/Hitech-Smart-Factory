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

    <!--Jquery all-->
    <link rel="stylesheet" href="css/jquery-ui.min.css">
    <script src="js/jquery-1.12.4.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>

    <!--Bootstrap-->
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css" media="screen" />

    <link rel="stylesheet" href="css/wordpress.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />

    <script type="text/javascript" src="js/index-scripts.js"></script>

</head>
<body>
<div id="wrapper">
    <div id="header">
        <div id="headerimg">
            Hitech Smart Factory
        </div>
    </div>

    <div id="side-bar" class="col-md-3">
        <div class="tab">
            <button class="tablinks" onclick="changeTab(event, 'Actions')">Actions</button>
            <button class="tablinks active" onclick="changeTab(event, 'Structure')">Structure</button>
        </div>

        <div id="Actions" class="tabcontent" style="display: none;">
            <h3>Actions</h3>
            <button class="action-btn" onclick="displayActionForm('create-new-factory')">
                <img src="images/hitech/icons/factory.png" alt="" width="20px" style="margin: 5px;">
                Create New Factory
            </button>
            <button class="action-btn">
                <img src="images/hitech/icons/factory.png" alt="" width="20px" style="margin: 5px;">
                Create New Branch
            </button>
            <button class="action-btn">
                <img src="images/hitech/icons/factory.png" alt="" width="20px" style="margin: 5px;">
                Create New Section
            </button>
            <button class="action-btn">
                <img src="images/hitech/icons/factory.png" alt="" width="20px" style="margin: 5px;">
                Create New Production Line
            </button>
        </div>

        <div id="Structure" class="tabcontent">
            <h3>Structure</h3>
            <div id="structure-container">
                <div class="structure-factory ">
                    <p onclick="collapseOrHide(this, 'branch')">ABC Factory</p>
                    <div class="structure-branch structure-hide">
                        <p onclick="collapseOrHide(this, 'section')">Colombo Branch</p>
                        <div class="structure-section structure-hide">
                            <p onclick="collapseOrHide(this, 'prod-line')">Filling Section</p>
                            <div class="structure-prod-line structure-hide">Production Line 1</div>
                            <div class="structure-prod-line structure-hide">Production Line 2</div>
                        </div>
                        <div class="structure-section structure-hide">
                            <p onclick="collapseOrHide(this, 'prod-line')">Sawing Section</p>
                            <div class="structure-prod-line structure-hide">Production Line 1</div>
                        </div>
                    </div>
                    <div class="structure-branch structure-hide">
                        <p onclick="collapseOrHide(this, 'section')">Negombo Branch</p>
                        <div class="structure-section structure-hide">
                            <p onclick="collapseOrHide(this, 'prod-line')">Delivery Section</p>
                            <div class="structure-prod-line structure-hide">Production Line 1</div>
                            <div class="structure-prod-line structure-hide">Production Line 2</div>
                            <div class="structure-prod-line structure-hide">Production Line 3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div id="main-panel" class="col-md-9">

        <div id="factories" class="box-btn-row">
            <p>Existing Factories</p>
            <div id="dynamic-factories">
                <c:forEach items="${factories}" var="factory">
                    <div class="box-btn-wrapper">
                        <button class="box-btn factory" onclick="selectFactory('<c:out value="${factory.getName()}" />',
                                this)"><c:out value="${factory.getName()}" /></button>
                    </div>

                </c:forEach>
            </div>
            <div class="box-btn-wrapper"><button class="box-btn factory" onclick="displayActionForm('create-new-factory')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

        <div id="branches" class="box-btn-row">
            <p>Branches of <text id="selected-factory-name"></text></p>
            <div id="dynamic-branches"></div>
            <div class="box-btn-wrapper"><button class="box-btn branch" onclick="displayActionForm('create-new-branch')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

        <div id="sections" class="box-btn-row">
            <p>Sections of <text id="selected-branch-name"></text></p>
            <div id="dynamic-sections"></div>
            <div class="box-btn-wrapper"><button class="box-btn section" onclick="displayActionForm('create-new-section')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>

        <div id="prod-lines" class="box-btn-row">
            <p>Production Lines of <text id="selected-section-name"></text></p>
            <div id="dynamic-prod-lines"></div>
            <div class="box-btn-wrapper"><button class="box-btn prod-line" onclick="displayActionForm('create-new-prod-line')">
                <img src="images/hitech/icons/plus-50x50.png" style="opacity: 0.7;height: 70px;"/>
            </button></div>
        </div>
        <p></p>
    </div>
</div>

<!--Create forms-->
<div id="action-form-background">
    <!--This is used to disable the background-->
</div>
<form id="create-new-factory" class="action-form" method="post" action="FactoryController">
    <h4>Create New Factory</h4>
    Factory Name:
    <input type="text" class="input-box" name="factory-name">
    <br>
    <input type="submit" class="submit-btn" value="Create">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideActionForm('create-new-factory')">
</form>
<form id="create-new-branch" class="action-form" method="post">
    <h4>Create New Branch</h4>
    <p id="branch-parent-details">ABC Factory</p>
    Branch Name:
    <input type="text" class="input-box" id="branch-name">
    <br>
    <input type="submit" class="submit-btn" value="Create">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideActionForm('create-new-branch')">
</form>
<form id="create-new-section" class="action-form" method="post">
    <h4>Create New Section</h4>
    <p id="section-parent-details">ABC Factory, Colombo Branch</p>
    Section Name:
    <input type="text" class="input-box" id="section-name">
    <br>
    <input type="submit" class="submit-btn" value="Create">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideActionForm('create-new-section')">
</form>
<form id="create-new-prod-line" class="action-form" method="post">
    <h4>Create New Production Line</h4>
    <p id="prod-line-parent-details">ABC Factory, Colombo Branch, Filling Section</p>
    Production Line Name:
    <input type="text" class="input-box" id="prod-line-name">
    <br>
    <input type="submit" class="submit-btn" value="Create">
    <input type="button" class="submit-btn" value="Cancel" onclick="hideActionForm('create-new-prod-line')">
</form>

</body>
</html>
