package com.hitech.smartfactory.dao;

import com.hitech.smartfactory.model.Section;
import com.hitech.smartfactory.util.DbUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class SectionDAO {
    private Connection connection;

    public SectionDAO() {
        this.connection = DbUtil.getConnection();
    }

    public void addSection(Section section) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO section(name, branch) VALUES (?, ?)");
            preparedStatement.setString(1, section.getName());
            preparedStatement.setString(2, Integer.toString(section.getBranch()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Section> getAllSectionsByBranch(int bid) {
        List<Section> sections = new ArrayList<Section>();
        try {
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM section WHERE branch=" + bid);
            while (rs.next()) {
                Section section = new Section();
                section.setSid(rs.getInt("sid"));
                section.setName(rs.getString("name"));
                section.setBranch(rs.getInt("branch"));
                sections.add(section);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return sections;
    }

    public void updateSection(Section section) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("UPDATE section SET name=? WHERE sid=?");
            preparedStatement.setString(1, section.getName());
            preparedStatement.setString(2, Integer.toString(section.getSid()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteSection(Section section) {
        try {
            PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM section WHERE sid=?");
            preparedStatement.setString(1, Integer.toString(section.getSid()));
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
