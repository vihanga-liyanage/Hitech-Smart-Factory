package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.Branch;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/19/2017.
 */
public class BranchDAO {
    private Connection connection;

    public BranchDAO() {
    this.connection = DbUtil.getConnection();
    }

    public void addBranch(Branch branch) {
        try {
            PreparedStatement preparedStatement = connection
                    .prepareStatement("INSERT INTO branch(name, factory, location) VALUES (?, ?, ?)");
            // Parameters start with 1
            preparedStatement.setString(1, branch.getName());
            preparedStatement.setString(2, Integer.toString(branch.getFactory()));
            preparedStatement.setString(3, branch.getLocation());
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Branch> getAllBranchesByFactory(int fid) {
        List<Branch> branches = new ArrayList<Branch>();
        try {
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM branch WHERE factory=" + fid);
            while (rs.next()) {
                Branch branch = new Branch();
                branch.setBid(rs.getInt("bid"));
                branch.setFactory(rs.getInt("factory"));
                branch.setName(rs.getString("name"));
                branch.setLocation(rs.getString("location"));
                branches.add(branch);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return branches;
    }
}
