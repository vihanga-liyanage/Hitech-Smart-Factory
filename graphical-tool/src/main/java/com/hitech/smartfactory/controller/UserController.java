package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.UserDAO;
import com.hitech.smartfactory.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

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
//        String action = request.getParameter("action");
//        if (action.equalsIgnoreCase("listBranches")) {
//            int fid = Integer.parseInt(request.getParameter("id"));
//            List<Branch> branches = dao.getAllBranchesByFactory(fid);
//
//            String out = "";
//            if (branches.size() > 0) {
//                out = "[";
//                for (Branch branch : branches) {
//                    out += branch.toString() + ", ";
//                }
//                out = (out.substring(0, out.length() - 2)) + "]";
//            }
//            response.setContentType("text/plain");
//            response.getWriter().write(out);
//        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = new User();

        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("addUser")) {
            // add new user
            user.setName(request.getParameter("name"));
            user.setUsername(request.getParameter("username"));
            user.setType(request.getParameter("type"));
            user.setFactory(Integer.parseInt(request.getParameter("factory")));
            user.setBranch(Integer.parseInt(request.getParameter("branch")));
            user.setSection(Integer.parseInt(request.getParameter("section")));
            user.setProdline(Integer.parseInt(request.getParameter("prodline")));

            dao.addUser(user);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("updateUser")){
            // update user
            user.setUid(Integer.parseInt(request.getParameter("uid")));
            user.setName(request.getParameter("newName"));
            user.setUsername(request.getParameter("username"));
            user.setType(request.getParameter("newType"));
            user.setFactory(Integer.parseInt(request.getParameter("factory")));
            user.setBranch(Integer.parseInt(request.getParameter("newBranch")));
            user.setSection(Integer.parseInt(request.getParameter("newSection")));
            user.setProdline(Integer.parseInt(request.getParameter("newProdline")));

            User oldUser = new User();
            oldUser.setUid(Integer.parseInt(request.getParameter("uid")));
            oldUser.setName(request.getParameter("oldName"));
            oldUser.setUsername(request.getParameter("username"));
            oldUser.setType(request.getParameter("oldType"));
            oldUser.setFactory(Integer.parseInt(request.getParameter("factory")));
            oldUser.setBranch(Integer.parseInt(request.getParameter("oldBranch")));
            oldUser.setSection(Integer.parseInt(request.getParameter("oldSection")));
            oldUser.setProdline(Integer.parseInt(request.getParameter("oldProdline")));
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
}
