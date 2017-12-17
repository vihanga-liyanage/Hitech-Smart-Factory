package com.hitech.smartfactory.model;

/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
public class User {
    private int uid;
    private String name;
    private String username;
    private String type;
    private int factory;
    private int branch;
    private int section;
    private int prodline;

    public User() {
        branch = 0;
        section = 0;
        prodline = 0;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setFactory(int factory) {
        this.factory = factory;
    }

    public void setBranch(int branch) {
        this.branch = branch;
    }

    public void setSection(int section) {
        this.section = section;
    }

    public void setProdline(int prodline) {
        this.prodline = prodline;
    }

    public int getUid() {
        return uid;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public String getType() {
        return type;
    }

    public int getFactory() {
        return factory;
    }

    public int getBranch() {

        return branch;
    }

    public int getSection() {
        return section;
    }

    public int getProdline() {
        return prodline;
    }

    @Override
    public String toString() {
        return "{" +
                "\"uid\":" + uid +
                ", \"name\":\"" + name + '\"' +
                ", \"username\":\"" + username + '\"' +
                ", \"type\":\"" + type + '\"' +
                ", \"factory\":" + factory +
                '}';
    }
}
