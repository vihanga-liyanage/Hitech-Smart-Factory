<%--
  Created by IntelliJ IDEA.
  User: Vihanga Liyanage
  Date: 8/3/2017
  Time: 8:48 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*" %>
<%
    // Read RDS connection information from the environment
    String dbName = System.getProperty("RDS_DB_NAME");
    String userName = System.getProperty("RDS_USERNAME");
    String password = System.getProperty("RDS_PASSWORD");
    String hostname = System.getProperty("RDS_HOSTNAME");
    String port = System.getProperty("RDS_PORT");
    // String jdbcUrl = "jdbc:mysql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password;
    String jdbcUrl = "jdbc:mysql://ec2-52-38-15-248.us-west-2.compute.amazonaws.com:3306/hitech-smart-factory?user=hitech&password=hitech";

    String results = "";
    // Load the JDBC driver
    try {
        results += "<br><br>" + "Loading driver...";
        Class.forName("com.mysql.jdbc.Driver");
        results += "<br><br>" + "Driver loaded!";
    } catch (ClassNotFoundException e) {
        throw new RuntimeException("Cannot find the driver in the classpath!", e);
    }

    Connection conn = null;
    Statement setupStatement = null;
    Statement readStatement = null;
    ResultSet resultSet = null;
    int numresults = 0;
    String statement = null;

    try {
        // Create connection to RDS DB instance
        conn = DriverManager.getConnection(jdbcUrl);

        // Create a table and write two rows
        setupStatement = conn.createStatement();
        String createTable = "CREATE TABLE Beanstalk (Resource char(50));";
        String insertRow1 = "INSERT INTO Beanstalk (Resource) VALUES ('EC2 Instance');";
        String insertRow2 = "INSERT INTO Beanstalk (Resource) VALUES ('RDS Instance');";

        setupStatement.addBatch(createTable);
        setupStatement.addBatch(insertRow1);
        setupStatement.addBatch(insertRow2);
        setupStatement.executeBatch();
        setupStatement.close();

    } catch (SQLException ex) {
        // Handle any errors
        results += "<br><br>" + "SQLException: " + ex.getMessage();
        results += "<br><br>" + "SQLState: " + ex.getSQLState();
        results += "<br><br>" + "VendorError: " + ex.getErrorCode();
    } finally {
        results += "<br><br>" + "Closing the connection.";
        if (conn != null) try { conn.close(); } catch (SQLException ignore) {}
    }

    try {
        conn = DriverManager.getConnection(jdbcUrl);

        readStatement = conn.createStatement();
        resultSet = readStatement.executeQuery("SELECT Resource FROM Beanstalk;");

        resultSet.first();
        results = resultSet.getString("Resource");
        resultSet.next();
        results += ", " + resultSet.getString("Resource");

        resultSet.close();
        readStatement.close();
        conn.close();

    } catch (SQLException ex) {
        // Handle any errors
        results += "<br><br>" + "SQLException: " + ex.getMessage();
        results += "<br><br>" + "SQLState: " + ex.getSQLState();
        results += "<br><br>" + "VendorError: " + ex.getErrorCode();
    } finally {
        results += "<br><br>" + "Closing the connection.";
        if (conn != null) try { conn.close(); } catch (SQLException ignore) {}
    }
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
<p>Established connection to RDS. Read first two rows: <%= results %></p>
<p>JDBC URL: <%= jdbcUrl %> </p>

</body>
</html>
