package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.BranchDAO;
import com.hitech.smartfactory.util.FileUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Vihanga Liyanage on 8/6/2017.
 */
public class FileController extends HttpServlet {
    private FileUtil fileUtil;

    public FileController(){
        super();
        fileUtil = new FileUtil();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("saveFile")) {
            String name = request.getParameter("name");
            String content = request.getParameter("xml");
            response.setContentType("text/plain");
            if (fileUtil.saveTextFile(name, content)) {
                response.getWriter().write("Success");
            } else {
                response.getWriter().write("Error");
            }
        }
    }
}
