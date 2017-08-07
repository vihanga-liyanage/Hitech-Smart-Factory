package com.hitech.smartfactory.util;

import java.io.*;
import java.util.Properties;

/**
 * Created by Vihanga Liyanage on 8/5/2017.
 */
public class FileUtil {
    private String FILE_SERVER_BASE;

    public FileUtil() {
        Properties prop = new Properties();
        InputStream inputStream = DbUtil.class.getClassLoader().getResourceAsStream("system.properties");
        try {
            prop.load(inputStream);
            FILE_SERVER_BASE = prop.getProperty("file-server-base");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

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
    }
}
