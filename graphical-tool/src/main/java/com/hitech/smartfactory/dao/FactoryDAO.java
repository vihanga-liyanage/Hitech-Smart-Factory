package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.Factory;
import com.hitech.smartfactory.model.User;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/19/2017.
 */
public class FactoryDAO {
    private Connection connection;

    public FactoryDAO() {
        this.connection = DbUtil.getConnection();
    }

    public void addFactory(Factory factory) {
        try {
            PreparedStatement preparedStatement = connection
                    .prepareStatement("insert into factory(name) values (?)");
            // Parameters start with 1
            preparedStatement.setString(1, factory.getName());
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Factory> getAllFactories() {
        List<Factory> factories = new ArrayList<Factory>();
        try {
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("select * from factory");
            while (rs.next()) {
                Factory factory = new Factory();
                factory.setFid(rs.getInt("fid"));
                factory.setName(rs.getString("name"));
                factories.add(factory);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return factories;
    }
}
