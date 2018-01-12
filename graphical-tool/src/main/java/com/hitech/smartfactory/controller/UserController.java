package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.UserDAO;
import com.hitech.smartfactory.model.User;
import jdk.nashorn.internal.parser.JSONParser;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
import java.util.List;
import java.util.Objects;

/**
 * Created by Vihanga Liyanage on 12/17/2017.
 */
public class UserController extends HttpServlet {
    private UserDAO dao;

    public UserController(){
        super();
        dao = new UserDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action != null && action.equalsIgnoreCase("listAllUsers")) {
            int fid = Integer.parseInt(request.getParameter("id"));
            String out = buildUserString(dao.getAllUsersByFactory(fid));

            response.setContentType("text/plain");
            response.getWriter().write(out);
        } else if (action != null && action.equalsIgnoreCase("listAllAdminUsers")) {
            String out = buildUserString(dao.getAllAdminUsers());

            response.setContentType("text/plain");
            response.getWriter().write(out);
        } else if (action != null && action.equalsIgnoreCase("getAdminUserManager")) {
            RequestDispatcher view = request.getRequestDispatcher("/admin-user-manager.jsp");
            view.forward(request, response);
        } else if (action != null && action.equalsIgnoreCase("getUserManager")) {
            RequestDispatcher view = request.getRequestDispatcher("/user-manager.jsp");
            view.forward(request, response);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = new User();

        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("addUser")) {
            // add new user
            user.setName(request.getParameter("name"));
            user.setUsername(request.getParameter("username"));
            user.setPassword(request.getParameter("password"));
            user.setType(request.getParameter("type"));
            user.setFactory(Integer.parseInt(request.getParameter("factory")));

            user.setBranches(getIntArrayFromString(request.getParameter("branches")));
            user.setSections(getIntArrayFromString(request.getParameter("sections")));
            user.setProdlines(getIntArrayFromString(request.getParameter("prodlines")));

            dao.addUser(user);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("updateUser")){
            // update user
            user.setUid(Integer.parseInt(request.getParameter("uid")));
            user.setName(request.getParameter("newName"));
            user.setType(request.getParameter("newType"));
            user.setBranches(getIntArrayFromString(request.getParameter("newBranches")));
            user.setSections(getIntArrayFromString(request.getParameter("newSections")));
            user.setProdlines(getIntArrayFromString(request.getParameter("newProdlines")));

            User oldUser = new User();
            oldUser.setUid(Integer.parseInt(request.getParameter("uid")));
            oldUser.setType(request.getParameter("oldType"));
            dao.updateUser(oldUser, user);
            response.setContentType("text/plain");
            response.getWriter().write("Success");

        } else if (action.equalsIgnoreCase("deleteUser")){
            // delete user
            user.setUid(Integer.parseInt(request.getParameter("uid")));
            user.setType(request.getParameter("type"));
            dao.deleteUser(user);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        }
    }

    private int[] getIntArrayFromString(String s) {
        s = s.replaceAll("\"", "");
        s = s.substring(1, s.length() - 1);

        if (Objects.equals(s, "")) {
            return new int[0];
        } else {
            String[] s2 = s.split(",");

            int[] out = new int[s2.length];
            if (!s.equals("")) {
                for (int i = 0; i < s2.length; i++) {
                    out[i] = Integer.parseInt(s2[i]);
                }
            }
            System.out.println(out);
            return out;
        }
    }

    private String buildUserString(List<User> users) {
        String out = "";
        if (users.size() > 0) {
            out = "[";
            for (User user : users) {
                out += user.toString() + ", ";
            }
            out = (out.substring(0, out.length() - 2)) + "]";
        }
        return out;
    }
}
