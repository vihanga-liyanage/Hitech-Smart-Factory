package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.FactoryDAO;
import com.hitech.smartfactory.model.Factory;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Vihanga Liyanage on 7/19/2017.
 */
public class FactoryController extends HttpServlet {
    private FactoryDAO dao;

    public FactoryController() {
        super();
        dao = new FactoryDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("factories", dao.getAllFactories());
        RequestDispatcher view = request.getRequestDispatcher("/main.jsp");
        view.forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Factory factory = new Factory();
        factory.setName(request.getParameter("factory-name"));

        dao.addFactory(factory);

        RequestDispatcher view = request.getRequestDispatcher("/main.jsp");
        request.setAttribute("factories", dao.getAllFactories());
        view.forward(request, response);
    }


}
