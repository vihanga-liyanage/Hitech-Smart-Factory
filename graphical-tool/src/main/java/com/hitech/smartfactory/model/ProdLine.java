package com.hitech.smartfactory.model;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class ProdLine {
    private int pid;
    private String name;
    private int section;

    public int getPid() {
        return pid;
    }

    public String getName() {
        return name;
    }

    public int getSection() {
        return section;
    }

    public void setPid(int pid) {
        this.pid = pid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSection(int section) {
        this.section = section;
    }

    @Override
    public String toString() {
        return "{" +
                "\"pid\":" + pid +
                ", \"name\":\"" + name + '\"' +
                ", \"section\":" + section +
                '}';
    }
}
