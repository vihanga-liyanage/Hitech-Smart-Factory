package com.hitech.smartfactory.model;

import java.util.Arrays;

/**
 * Created by Vihanga Liyanage on 12/16/2017.
 */
public class User {
    private int uid;
    private String name;
    private String username;
    private String password;
    private String type;
    private int factory;
    private String factoryName;
    private int[] branches;
    private int[] sections;
    private int[] prodlines;

    public User() {
        branches = null;
        sections = null;
        prodlines = null;
        factoryName = "";
    }

    public String getFactoryName() {
        return factoryName;
    }

    public void setFactoryName(String factoryName) {
        this.factoryName = factoryName;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setFactory(int factory) {
        this.factory = factory;
    }

    public void setBranches(int[] branches) {
        this.branches = branches;
    }

    public void setSections(int[] sections) {
        this.sections = sections;
    }

    public void setProdlines(int[] prodlines) {
        this.prodlines = prodlines;
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

    public String getPassword() {
        return password;
    }

    public String getType() {
        return type;
    }

    public int getFactory() {
        return factory;
    }

    public int[] getBranches() {
        return branches;
    }

    public int[] getSections() {
        return sections;
    }

    public int[] getProdlines() {
        return prodlines;
    }

    @Override
    public String toString() {
        return "{" +
                "\"uid\":" + uid +
                ", \"name\":\"" + name + '\"' +
                ", \"username\":\"" + username + '\"' +
                ", \"type\":\"" + type + '\"' +
                ", \"factory\":" + factory +
                ", \"factoryName\":\"" + factoryName + '\"' +
                ", \"branches\":" + Arrays.toString(branches) +
                ", \"sections\":" + Arrays.toString(sections) +
                ", \"prodlines\":" + Arrays.toString(prodlines) +
                '}';
    }
}
