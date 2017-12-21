package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.Branch;
import com.hitech.smartfactory.model.User;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
public class UserDAO {
    private Connection connection;

    public UserDAO() {
        this.connection = DbUtil.getConnection();
    }

    public List<User> getAllUsersByFactory(int fid) {
        List<User> users = new ArrayList<>();
        try {
            Statement statement1 = connection.createStatement();
            ResultSet rs = statement1.executeQuery("SELECT * FROM user WHERE factory=" + fid);
            while (rs.next()) {
                User user = new User();
                user.setUid(rs.getInt("uid"));
                user.setName(rs.getString("name"));
                user.setUsername(rs.getString("username"));
                user.setType(rs.getString("type"));
                user.setFactory(rs.getInt("factory"));

                if (Objects.equals(user.getType(), "b")) {
                    Statement statement2 = connection.createStatement();
                    ResultSet rs1 = statement2.executeQuery("SELECT * FROM user_branch WHERE uid=" + user.getUid());
                    // add all branches to list since cannot append to array directly
                    List<Integer> temp = new ArrayList<>();
                    while (rs1.next()) {
                        temp.add(rs1.getInt("bid"));
                    }
                    int[] branches = new int[temp.size()];
                    for (int i = 0; i < branches.length; i++) {
                        branches[i] = temp.get(i).intValue();
                    }
                    user.setBranches(branches);
                } else if (Objects.equals(user.getType(), "s")) {
                    Statement statement2 = connection.createStatement();
                    ResultSet rs1 = statement2.executeQuery("SELECT * FROM user_section WHERE uid=" + user.getUid());
                    // add all sections to list since cannot append to array directly
                    List<Integer> temp = new ArrayList<>();
                    while (rs1.next()) {
                        temp.add(rs1.getInt("sid"));
                    }
                    int[] sections = new int[temp.size()];
                    for (int i = 0; i < sections.length; i++) {
                        sections[i] = temp.get(i).intValue();
                    }
                    user.setSections(sections);
                } else if (Objects.equals(user.getType(), "p")) {
                    Statement statement2 = connection.createStatement();
                    ResultSet rs1 = statement2.executeQuery("SELECT * FROM user_prodline WHERE uid=" + user.getUid());
                    // add all prodlines to list since cannot append to array directly
                    List<Integer> temp = new ArrayList<>();
                    while (rs1.next()) {
                        temp.add(rs1.getInt("pid"));
                    }
                    int[] prodlines = new int[temp.size()];
                    for (int i = 0; i < prodlines.length; i++) {
                        prodlines[i] = temp.get(i).intValue();
                    }
                    user.setProdlines(prodlines);
                }

                // Omit super admin
                if (!Objects.equals(user.getType(), "x")) {
                    users.add(user);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
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
            System.out.println("Create new user complete: " + user.getName());

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

            // Remove old record
            deleteAssociateUserRecords(oldUser);

            // insert new record
            insertAssociateUserRecords(newUser);

            System.out.println("Update user complete: " + newUser.getName());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteUser(User user) {
        try {
            // should delete associate records first due to foreign key constraints
            deleteAssociateUserRecords(user);

            PreparedStatement preparedStatement = connection
                    .prepareStatement("DELETE FROM user WHERE uid=?");
            // Parameters start with 1
            preparedStatement.setString(1, Integer.toString(user.getUid()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void insertAssociateUserRecords(User user) {
        try {
            switch (user.getType()) {
                case "b": {
                    for (int b:user.getBranches()) {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("INSERT INTO user_branch(uid, bid) VALUES (?, ?)");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(user.getUid()));
                        preparedStatement2.setString(2, Integer.toString(b));
                        preparedStatement2.executeUpdate();
                    }
                    break;
                }
                case "s": {
                    for (int s:user.getSections()) {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("INSERT INTO user_section(uid, sid) VALUES (?, ?)");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(user.getUid()));
                        preparedStatement2.setString(2, Integer.toString(s));
                        preparedStatement2.executeUpdate();
                    }
                    break;
                }
                case "p": {
                    for (int p:user.getProdlines()) {
                        PreparedStatement preparedStatement2 = connection
                                .prepareStatement("INSERT INTO user_prodline(uid, pid) VALUES (?, ?)");
                        // Parameters start with 1
                        preparedStatement2.setString(1, Integer.toString(user.getUid()));
                        preparedStatement2.setString(2, Integer.toString(p));
                        preparedStatement2.executeUpdate();
                    }
                    break;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void deleteAssociateUserRecords(User user) {
        try {
            switch (user.getType()) {
                case "b": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("DELETE FROM user_branch WHERE uid=?");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.executeUpdate();
                    break;
                }
                case "s": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("DELETE FROM user_section WHERE uid=?");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.executeUpdate();
                    break;
                }
                case "p": {
                    PreparedStatement preparedStatement2 = connection
                            .prepareStatement("DELETE FROM user_prodline WHERE uid=?");
                    // Parameters start with 1
                    preparedStatement2.setString(1, Integer.toString(user.getUid()));
                    preparedStatement2.executeUpdate();
                    break;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
