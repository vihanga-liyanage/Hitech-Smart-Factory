package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.User;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.Objects;

/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
public class UserDAO {
    private Connection connection;

    public UserDAO() {
        this.connection = DbUtil.getConnection();
    }

    public void addUser(User user) {
        try {
            // Insert user record
            PreparedStatement preparedStatement1 = connection.prepareStatement(
                    "INSERT INTO user(name, username, type, factory) VALUES (?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
            // Parameters start with 1
            preparedStatement1.setString(1, user.getName());
            preparedStatement1.setString(2, user.getUsername());
            preparedStatement1.setString(3, user.getType());
            preparedStatement1.setString(4, Integer.toString(user.getFactory()));

            // Getting inserted uid
            int affectedRows = preparedStatement1.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating user failed, no rows affected.");
            }
            try (ResultSet generatedKeys = preparedStatement1.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setUid(generatedKeys.getInt(1));

                    // insert associate table record depending on the type
                    insertAssociateUserRecords(user);
                }
                else {
                    throw new SQLException("Creating user failed, no ID obtained.");
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updateUser(User oldUser, User newUser) {
        try {
            PreparedStatement preparedStatement1 = connection
                    .prepareStatement("UPDATE user SET name=?, type=? WHERE uid=?");
            // Parameters start with 1
            preparedStatement1.setString(1, newUser.getName());
            preparedStatement1.setString(2, newUser.getType());
            preparedStatement1.setString(3, Integer.toString(newUser.getUid()));
            preparedStatement1.executeUpdate();

            //See if associate table update is required
            if (!Objects.equals(oldUser.getType(), newUser.getType())) {
                // Remove old record
                switch (oldUser.getType()) {
                    case "b": {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("DELETE FROM user_branch WHERE uid=?");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(oldUser.getUid()));
                        preparedStatement2.executeUpdate();
                        break;
                    }
                    case "s": {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("DELETE FROM user_section WHERE uid=?");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(oldUser.getUid()));
                        preparedStatement2.executeUpdate();
                        break;
                    }
                    case "p": {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("DELETE FROM user_prodline WHERE uid=?");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(oldUser.getUid()));
                        preparedStatement2.executeUpdate();
                        break;
                    }
                }

                // insert new record
                insertAssociateUserRecords(newUser);

            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

//    public void deleteUser(User user) {
//        try {
//            PreparedStatement preparedStatement = connection
//                    .prepareStatement("DELETE FROM branch WHERE bid=?");
//            // Parameters start with 1
//            preparedStatement.setString(1, Integer.toString(user.getBid()));
//            preparedStatement.executeUpdate();
//
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//    }

    private void insertAssociateUserRecords(User user) {
        try {
            switch (user.getType()) {
                case "b": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("INSERT INTO user_branch(uid, bid) VALUES (?, ?)");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.setString(2, Integer.toString(user.getBranch()));
                    preparedStatement2.executeUpdate();
                    break;
                }
                case "s": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("INSERT INTO user_section(uid, bid, sid) VALUES (?, ?, ?)");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.setString(2, Integer.toString(user.getBranch()));
                    preparedStatement2.setString(3, Integer.toString(user.getSection()));
                    preparedStatement2.executeUpdate();
                    break;
                }
                case "p": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("INSERT INTO user_prodline(uid, bid, sid, pid) VALUES (?, ?, ?, ?)");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.setString(2, Integer.toString(user.getBranch()));
                    preparedStatement2.setString(3, Integer.toString(user.getSection()));
                    preparedStatement2.setString(4, Integer.toString(user.getProdline()));
                    preparedStatement2.executeUpdate();
                    break;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}