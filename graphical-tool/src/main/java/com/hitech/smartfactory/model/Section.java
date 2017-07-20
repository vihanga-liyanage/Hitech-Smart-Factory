package com.hitech.smartfactory.model;

/**
 * Created by Vihanga Liyanage on 7/20/2017.
 */
public class Section {
    private int sid;
    private String name;
    private int branch;

    public int getSid() {
        return sid;
    }

    public String getName() {
        return name;
    }

    public int getBranch() {
        return branch;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBranch(int branch) {
        this.branch = branch;
    }

    @Override
    public String toString() {
        return "{" +
                "\"sid\":" + sid +
                ", \"name\":\"" + name + '\"' +
                ", \"branch\":" + branch +
                '}';
    }
}
