package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.ProdLine;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class ProdLineDAO {
    private Connection connection;

    public ProdLineDAO() {
        this.connection = DbUtil.getConnection();
    }

    public void addProdLine(ProdLine prodLine) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO prodline(name, section) VALUES (?, ?)");
            preparedStatement.setString(1, prodLine.getName());
            preparedStatement.setString(2, Integer.toString(prodLine.getSection()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<ProdLine> getAllProdLinesBySection(int sid) {
        List<ProdLine> prodLines = new ArrayList<ProdLine>();
        try {
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM prodline WHERE section=" + sid);
            while (rs.next()) {
                ProdLine prodLine = new ProdLine();
                prodLine.setPid(rs.getInt("pid"));
                prodLine.setName(rs.getString("name"));
                prodLine.setSection(rs.getInt("section"));
                prodLines.add(prodLine);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return prodLines;
    }

    public void updateProdLine(ProdLine prodLine) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("UPDATE prodline SET name=? WHERE pid=?");
            preparedStatement.setString(1, prodLine.getName());
            preparedStatement.setString(2, Integer.toString(prodLine.getPid()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteProdLine(ProdLine prodLine) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM prodline WHERE pid=?");
            preparedStatement.setString(1, Integer.toString(prodLine.getPid()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
