package com.hitech.smartfactory.util;

import java.io.*;

/**
 * Created by Vihanga Liyanage on 8/5/2017.
 */
public class FileUtil {
    private String FILE_SERVER_BASE = "C:\\xampp\\htdocs\\hitech-smart-factory\\";

    public boolean saveTextFile (String name, String content) {
        File file = new File(FILE_SERVER_BASE + name);
        file.getParentFile().mkdirs();
        try {
            FileWriter writer = new FileWriter(file);
            writer.write(content);
            writer.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
//        try {
//            PrintWriter out = new PrintWriter(FILE_SERVER_BASE + name);
//            out.write(content);
//            out.close();
//            return true;
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//            return false;
//        }
    }
}
