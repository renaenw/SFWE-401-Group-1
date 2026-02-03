package com.example.backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		// make a list to store students and scholarships
		List<Student> students = new ArrayList<>();
		List<Scholarship> scholarships = new ArrayList<>();

		// read in student csv
		try (BufferedReader reader = Files.newBufferedReader(Paths.get("student.csv"))) {
			String headerLine = reader.readLine();
			if (headerLine != null) {
				String[] headers = headerLine.split(",");
				Map<String, Integer> headerIndex = new HashMap<>();
				for (int i = 0; i < headers.length; i++) {
					headerIndex.put(headers[i].trim(), i);
				}

				String line;
				while ((line = reader.readLine()) != null) {
					// store all fields as separate strings
					String[] fields = line.split(",", -1);
					String fName = headerIndex.containsKey("First Name") ? fields[headerIndex.get("First Name")].trim() : "";
					String lName = headerIndex.containsKey("Last Name") ? fields[headerIndex.get("Last Name")].trim() : "";
					String gpa = headerIndex.containsKey("GPA") ? fields[headerIndex.get("GPA")].trim() : "";
					String major = headerIndex.containsKey("Major") ? fields[headerIndex.get("Major")].trim() : "";
					String schoolYear = headerIndex.containsKey("Year") ? fields[headerIndex.get("Year")].trim() : "";
					String score = headerIndex.containsKey("Score") ? fields[headerIndex.get("Score")].trim() : "";

					// store data in a list of Student objects
					// matchScore initialized to null
					Student student = new Student(fName, lName, major, gpa, schoolYear, score, null);
					students.add(student);

				}
			}
		} catch (IOException e) {	// error reading file
			System.out.println("Can't read file: " + e.getMessage());
		}

		// read in scholarships csv		
			// onlly need gpa, major, school year
			// store scholarships in a list

		try (BufferedReader reader = Files.newBufferedReader(Paths.get("scholarships.csv"))) {
			String headerLine = reader.readLine();
			if (headerLine != null) {
				String[] headers = headerLine.split(",");
				Map<String, Integer> headerIndex = new HashMap<>();
				for (int i = 0; i < headers.length; i++) {
					headerIndex.put(headers[i].trim(), i);
				}

				String line;
				while ((line = reader.readLine()) != null) {
					// as in students, store all fields as separate strings
					String[] fields = line.split(",", -1);
					String scholarshipId = headerIndex.containsKey("id") ? fields[headerIndex.get("id")].trim() : "";
					String scholarshipName = headerIndex.containsKey("name") ? fields[headerIndex.get("name")].trim() : "";
					String scholarshipStatus = headerIndex.containsKey("status") ? fields[headerIndex.get("status")].trim() : "";
					String scholarshipAmount = headerIndex.containsKey("amount") ? fields[headerIndex.get("amount")].trim() : "";
					String scholarshipDeadline = headerIndex.containsKey("deadline") ? fields[headerIndex.get("deadline")].trim() : "";
					String scholarshipMajor = headerIndex.containsKey("major") ? fields[headerIndex.get("major")].trim() : "";
					String scholarshipGpa = headerIndex.containsKey("gpa") ? fields[headerIndex.get("gpa")].trim() : "";
					String scholarshipYear = headerIndex.containsKey("year") ? fields[headerIndex.get("year")].trim() : "";
					String scholarshipPs = headerIndex.containsKey("ps") ? fields[headerIndex.get("ps")].trim() : "";

					// store data in a list of scholarships
					Scholarship currScholarship = new Scholarship(scholarshipId, scholarshipName, scholarshipStatus, 
					scholarshipAmount, scholarshipDeadline, scholarshipMajor, scholarshipGpa, scholarshipYear, scholarshipPs);

					scholarships.add(currScholarship);

				}
			}
		} catch (IOException e) {	// error reading file	
			System.out.println("Can't read file: " + e.getMessage());
		}

		// automatic scoring 
			// give each scholarship a "score" and then sort by highest score
			// score is based on how well you match to the scholarship
			// if one requirement is not met score = 0
			// calculate score for each student
			
			for (Student currStudent : students) {
				int currScore = 0;		
				int matches = 0;
				int scholarshipCount = scholarships.size();
				int currIndex = 0;

				for (Scholarship currScholarship : scholarships) {
					// check each requirement
					boolean eligible = true;
					double studentGpa = Double.parseDouble(currStudent.getGpa());
					double minGpa = Double.parseDouble(currScholarship.getGpa());

					// major
					if (!(currScholarship.getMajor().equals(currStudent.getMajor()))) {
						eligible = false;
					}
					// gpa
					else if (studentGpa < minGpa) {
						eligible = false;
					}
					// year
					else if (!(currStudent.getYear().equals(currScholarship.getYear()))) {
						eligible = false;
					}
					// if eligible increment matches by one
					if (eligible) {
						matches++;

						// score logic
						// add a point for every 0.1 above min gpa
						int gpaPoints = (int)((studentGpa - minGpa) * 10.0);
						currScore += gpaPoints;

						// add points based on monetary value
						// 1 point for every 1000 dollars
						String amountStr = currScholarship.getAmount().replaceAll("[$,]", "");
						try {
							double amount = Double.parseDouble(amountStr);
							int amountPoints = (int)(amount / 1000.0);
							currScore += amountPoints;
						} catch (NumberFormatException nfe) {
							// invalid amount format, no points
						}

	
					} 
					else {
						// not eligible
						// do not increment matches
						currScore = 0;
					}

					// add current score to student object
					currStudent.setMatchScore(currScore, currIndex);
					currIndex++;

				}
				// calculate match %
				double matchPercent = ((double)matches / (double)scholarshipCount) * 100.0;
				// add match percent to student object
				String matchPercentStr = String.format("%.2f", matchPercent);
				currStudent.setScore(matchPercentStr);
			}


		// suggest scholarships
			// System shall recommend scholarships to applicants based on gpa, major, and school year
			// suggest based on score
			// use the list of match scores, index corresponds to scholarship id
			
		// write scores back to CSV 
		try {
			writeScoresToCsv(Paths.get("student.csv"), students);
		} catch (IOException e) {
			System.out.println("Failed to write scores to CSV: " + e.getMessage());
		}	}

	// Write student scores and matchScores back into the CSV file.
	private static void writeScoresToCsv(Path path, List<Student> students) throws IOException {
		List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
		// make sure there is at least a header
		if (lines.isEmpty()) return;

		String header = lines.get(0);
		String[] headerCols = header.split(",", -1);

		int scoreIdx = -1;
		int matchScoreIdx = -1;
		
		// Find existing Score and matchScore columns
		for (int i = 0; i < headerCols.length; i++) {
			if (headerCols[i].trim().equalsIgnoreCase("score")) { 
				scoreIdx = i; 
			}
			if (headerCols[i].trim().equalsIgnoreCase("matchScore")) { 
				matchScoreIdx = i; 
			}
		}

		// Track if we need to append new columns
		boolean appendedScore = false;
		boolean appendedMatchScore = false;
		
		if (scoreIdx == -1) {
			appendedScore = true;
			header = header + ",score";
		}
		if (matchScoreIdx == -1) {
			appendedMatchScore = true;
			header = header + ",matchScore";
		}

		List<String> out = new ArrayList<>();
		out.add(header);

		int rowCount = Math.max(lines.size() - 1, students.size());
		for (int i = 0; i < rowCount; i++) {
			String origLine = (i + 1 < lines.size()) ? lines.get(i + 1) : "";
			String[] cols = origLine.isEmpty() ? new String[0] : origLine.split(",", -1);

			String scoreVal = (i < students.size()) ? students.get(i).getScore() : "";
			
			// Convert matchScore list to comma-separated string
			String matchScoreVal = "";
			if (i < students.size()) {
				List<Integer> matchScores = students.get(i).getMatchScore();
				if (matchScores != null && !matchScores.isEmpty()) {
					StringBuilder sb = new StringBuilder();
					for (int j = 0; j < matchScores.size(); j++) {
						if (j > 0) sb.append(",");
						sb.append(matchScores.get(j));
					}
					matchScoreVal = sb.toString();
				}
			}

			// Rebuild the line with both score and matchScore
			if (appendedScore && appendedMatchScore) {
				// Both columns are appended at the end
				String newLine = origLine.isEmpty() ? 
					csvEscape(scoreVal) + "," + csvEscape(matchScoreVal) : 
					origLine + "," + csvEscape(scoreVal) + "," + csvEscape(matchScoreVal);
				out.add(newLine);
			} else if (appendedScore) {
				// Only score appended
				String newLine = origLine.isEmpty() ? 
					csvEscape(scoreVal) : 
					origLine + "," + csvEscape(scoreVal);
				out.add(newLine);
			} else if (appendedMatchScore) {
				// Only matchScore appended
				String newLine = origLine.isEmpty() ? 
					csvEscape(matchScoreVal) : 
					origLine + "," + csvEscape(matchScoreVal);
				out.add(newLine);
			} else {
				// Both columns exist, update them in place
				String[] newCols = Arrays.copyOf(cols, headerCols.length);
				for (int k = 0; k < newCols.length; k++) if (newCols[k] == null) newCols[k] = "";
				
				if (scoreIdx >= 0) newCols[scoreIdx] = scoreVal;
				if (matchScoreIdx >= 0) newCols[matchScoreIdx] = matchScoreVal;
				
				StringBuilder sb = new StringBuilder();
				for (int k = 0; k < newCols.length; k++) {
					if (k > 0) sb.append(',');
					sb.append(csvEscape(newCols[k]));
				}
				out.add(sb.toString());
			}
		}

		Path parent = path.toAbsolutePath().getParent();
		if (parent == null) {
			// when path is running with relative single-name file, use working dir
			parent = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
		}
		Path tmp = Files.createTempFile(parent, "student-", ".csv");
		Files.write(tmp, out, StandardCharsets.UTF_8);
		try {
			Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
		} catch (IOException atomicEx) {
			// If atomic move not supported, fallback to non-atomic replace
			Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING);
		}
	}

private static String csvEscape(String s) {
    if (s == null) return "";
    if (s.contains(",") || s.contains("\"") || s.contains("\n") || s.contains("\r")) {
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }
    return s;
}

}
