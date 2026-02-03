package com.example.backend;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opencsv.CSVReader;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // simple CORS for dev
public class CsvController {

    @GetMapping("/students")
    public List<Student> getStudents() throws Exception {
        Path p1 = Paths.get("student.csv");
        CSVReader reader = null;
        Reader r = Files.newBufferedReader(p1);
        reader = new CSVReader(r);
            List<Student> out = new ArrayList<>();
            String[] row;
            boolean header = true;
            while ((row = reader.readNext()) != null) {
                if (header) { header = false; continue; } // skip header
                // defensive: ensure row length
                String fn = row.length>0?row[0]:"";
                String ln = row.length>1?row[1]:"";
                String major = row.length>2?row[2]:"";
                String gpa = row.length>3?row[3]:"";
                String year = row.length>4?row[4]:"";
                String score = row.length>5?row[5]:"";
                
                // Parse matchScore as a list of comma-separated integers
                List<Integer> matchScore = new ArrayList<>();
                if (row.length > 6 && !row[6].trim().isEmpty()) {
                    String[] matchScores = row[6].split(",");
                    for (String ms : matchScores) {
                        try {
                            matchScore.add(Integer.parseInt(ms.trim()));
                        } catch (NumberFormatException e) {
                            // Skip invalid numbers
                        }
                    }
                }
                
                out.add(new Student(fn, ln, major, gpa, year, score, matchScore));
            }
            return out;
        }

    @GetMapping("/scholarships")
    public List<Scholarship> getScholarships() throws Exception {
        Path p1 = Paths.get("scholarships.csv");
        CSVReader reader = null;
        Reader r = Files.newBufferedReader(p1);
        reader = new CSVReader(r);
            List<Scholarship> out = new ArrayList<>();
            String[] row;
            boolean header = true;
            while ((row = reader.readNext()) != null) {
                if (header) { header = false; continue; }
                String id = row.length>0?row[0]:"";
                String name = row.length>1?row[1]:"";
                String status = row.length>2?row[2]:"";
                String amount = row.length>3?row[3]:"";
                String deadline = row.length>4?row[4]:"";
                String major = row.length>5?row[5]:"";
                String gpa = row.length>6?row[6]:"";
                String year = row.length>7?row[7]:"";
                String ps = row.length>8?row[8]:"";
                out.add(new Scholarship(id, name, status, amount, deadline, major, gpa, year, ps));
            }
            return out;
    }
}