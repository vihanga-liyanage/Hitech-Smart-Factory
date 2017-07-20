package com.hitech.smartfactory.controller;

import com.hitech.smartfactory.dao.SectionDAO;
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
public class SectionController extends HttpServlet {
    private SectionDAO dao;

    public SectionController(){
        super();
        dao = new SectionDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if (action.equalsIgnoreCase("listSections")) {
            int bid = Integer.parseInt(request.getParameter("id"));
            List<Section> sections = dao.getAllSectionsByBranch(bid);

            String out = "";
            if (sections.size() > 0) {
                out = "[";
                for (Section section : sections) {
                    out += section.toString() + ", ";
                }
                out = (out.substring(0, out.length() - 2)) + "]";
            }
            response.setContentType("text/plain");
            response.getWriter().write(out);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // add new Section
        int bid = Integer.parseInt(request.getParameter("branch"));
        Section section = new Section();
        section.setName(request.getParameter("name"));
        section.setBranch(bid);

        dao.addSection(section);

        response.setContentType("text/plain");
        response.getWriter().write("Success");
    }
}
