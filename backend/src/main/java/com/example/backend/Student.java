package com.example.backend;
import java.util.ArrayList;
import java.util.List;

public class Student {
    private String firstName;
    private String lastName;
    private String major;
    private String gpa;
    private String year;
    private String score;
    private List<Integer> matchScore = new ArrayList<>(); // used to rank scholarships

    public Student() {}
    // constructor (single matchScore int)
    public Student(String firstName, String lastName, String major, 
    String gpa, String year, String score, int matchScore) {
        this.firstName = firstName; 
        this.lastName = lastName;
        this.major = major; 
        this.gpa = gpa; 
        this.year = year;
        this.score = score;
        this.matchScore.add(matchScore);
    }
    
    // constructor (matchScore list)
    public Student(String firstName, String lastName, String major, 
    String gpa, String year, String score, List<Integer> matchScore) {
        this.firstName = firstName; 
        this.lastName = lastName;
        this.major = major; 
        this.gpa = gpa; 
        this.year = year;
        this.score = score;
        this.matchScore = matchScore != null ? matchScore : new ArrayList<>();
    }
    // getters + setters
    public String getFirstName(){return firstName;}
    public void setFirstName(String f){this.firstName=f;}
    public String getLastName(){return lastName;}
    public void setLastName(String l){this.lastName=l;}
    public String getMajor(){return major;}
    public void setMajor(String m){this.major=m;}
    public String getGpa(){return gpa;}
    public void setGpa(String g){this.gpa=g;}
    public String getYear(){return year;}
    public void setYear(String y){this.year=y;}
    public String getScore(){return score;}
    public void setScore(String s){this.score=s;}
    public List<Integer> getMatchScore(){return matchScore;}
    public void setMatchScore(int ms, int index){this.matchScore.add(index, ms);}
}