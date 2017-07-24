package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.ProdLineDAO;
import com.hitech.smartfactory.dao.SectionDAO;
import com.hitech.smartfactory.model.ProdLine;
import com.hitech.smartfactory.model.Section;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class ProdLineController extends HttpServlet {
    private ProdLineDAO dao;

    public ProdLineController(){
        super();
        dao = new ProdLineDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("listProdLines")) {
            int sid = Integer.parseInt(request.getParameter("id"));
            List<ProdLine> prodLines = dao.getAllProdLinesBySection(sid);

            String out = "";
            if (prodLines.size() > 0) {
                out = "[";
                for (ProdLine prodLine : prodLines) {
                    out += prodLine.toString() + ", ";
                }
                out = (out.substring(0, out.length() - 2)) + "]";
            }
            response.setContentType("text/plain");
            response.getWriter().write(out);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ProdLine prodLine = new ProdLine();
        prodLine.setName(request.getParameter("name"));

        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("addProdLine")) {
            // add new prodLine
            prodLine.setSection(Integer.parseInt(request.getParameter("section")));
            dao.addProdLine(prodLine);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("updateProdLine")){
            // update prodLine
            prodLine.setPid(Integer.parseInt(request.getParameter("id")));
            dao.updateProdLine(prodLine);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        } else if (action.equalsIgnoreCase("deleteProdLine")){
            // delete prodLine
            prodLine.setPid(Integer.parseInt(request.getParameter("id")));
            dao.deleteProdLine(prodLine);
            response.setContentType("text/plain");
            response.getWriter().write("Success");
        }
    }
}
