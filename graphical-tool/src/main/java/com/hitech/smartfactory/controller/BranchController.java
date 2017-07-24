package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.BranchDAO;
import com.hitech.smartfactory.model.Branch;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class BranchController extends HttpServlet {
    private BranchDAO dao;

    public BranchController(){
        super();
        dao = new BranchDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("listBranches")) {
            int fid = Integer.parseInt(request.getParameter("id"));
            List<Branch> branches = dao.getAllBranchesByFactory(fid);

            String out = "";
            if (branches.size() > 0) {
                out = "[";
                for (Branch branch : branches) {
                    out += branch.toString() + ", ";
                }
                out = (out.substring(0, out.length() - 2)) + "]";
            }
            response.setContentType("text/plain");
            response.getWriter().write(out);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Branch branch = new Branch();
        branch.setName(request.getParameter("name"));
        branch.setLocation(request.getParameter("location"));

        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("addBranch")) {
            // add new branch
            branch.setFactory(Integer.parseInt(request.getParameter("factory")));
            dao.addBranch(branch);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("updateBranch")){
            // update branch
            branch.setBid(Integer.parseInt(request.getParameter("id")));
            dao.updateBranch(branch);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("deleteBranch")){
            // delete branch
            branch.setBid(Integer.parseInt(request.getParameter("id")));
            dao.deleteBranch(branch);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        }
    }
}
