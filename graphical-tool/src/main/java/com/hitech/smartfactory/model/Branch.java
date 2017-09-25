package com.hitech.smartfactory.model;

/**
 * Created by Vihanga Liyanage on 7/19/2017.
 */
public class Branch {
    private int bid;
    private String name;
    private int factory;
    private String location;

    public int getBid() {
        return bid;
    }

    public String getName() {
        return name;
    }

    public int getFactory() {
        return factory;
    }

    public String getLocation() {
        return location;
    }

    public void setBid(int bid) {
        this.bid = bid;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFactory(int factory) {
        this.factory = factory;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "{" +
                "\"bid\":" + bid +
                ", \"name\":\"" + name + '\"' +
                ", \"factory\":" + factory +
                ", \"location\":\"" + location + '\"' +
                '}';
    }
}
