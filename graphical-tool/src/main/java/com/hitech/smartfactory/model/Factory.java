package com.hitech.smartfactory.model;

/**
 * Created by Vihanga Liyanage on 7/19/2017.
 */
public class Factory {
    private String name;
    private int fid;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public int getFid() {
        return fid;
    }

    public void setFid(int fid) {
        this.fid = fid;
    }

    @Override
    public String toString() {
        return "{" +
                "\"fid\":" + fid +
                ", \"name\":\"" + name + '\"' +
                '}';
    }
}
