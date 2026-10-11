/**
 * Canonical Java implementation of the Email Administration Application
 * matching the IT Support Administrator Specialist Project 1 specification.
 */

export const EMAIL_JAVA_CODE = `package emailapp;

import java.util.Scanner;

public class Email {
    private String firstName;
    private String lastName;
    private String password;
    private String department;
    private String email;
    private int mailboxCapacity = 500;
    private int defaultPasswordLength = 10;
    private String alternateEmail = "None";
    private String companySuffix = "aeycompany.com";

    // Constructor to receive the first name and last name
    public Email(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        
        // Call a method asking for the department - return the department
        this.department = setDepartment();
        
        // Call a method that returns a random password
        this.password = randomPassword(defaultPasswordLength);
        System.out.println("Your password is: " + this.password);
        
        // Combine elements to generate email syntax
        if (department.isEmpty()) {
            email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + companySuffix;
        } else {
            email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + department + "." + companySuffix;
        }
    }

    // Determine the department (sales, development, accounting), if none leave blank
    private String setDepartment() {
        System.out.print("New worker: " + firstName + ".\\nDEPARTMENT CODES:\\n1 for Sales\\n2 for Development\\n3 for Accounting\\n0 for none\\nEnter department code: ");
        Scanner in = new Scanner(System.in);
        int depChoice = in.nextInt();
        if (depChoice == 1) { 
            return "sales"; 
        } else if (depChoice == 2) { 
            return "dev"; 
        } else if (depChoice == 3) { 
            return "acct"; 
        } else { 
            return ""; 
        }
    }

    // Generate a random String for a password
    private String randomPassword(int length) {
        String passwordSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        char[] password = new char[length];
        for (int i = 0; i < length; i++) {
            int rand = (int) (Math.random() * passwordSet.length());
            password[i] = passwordSet.charAt(rand);
        }
        return new String(password);
    }

    // Set methods
    // Set the mailbox capacity
    public void setMailboxCapacity(int capacity) {
        this.mailboxCapacity = capacity;
    }

    // Define an alternate email address
    public void setAlternateEmail(String altEmail) {
        this.alternateEmail = altEmail;
    }

    // Change the password
    public void changePassword(String password) {
        this.password = password;
    }

    // Get methods
    public int getMailboxCapacity() { 
        return mailboxCapacity; 
    }
    
    public String getAlternateEmail() { 
        return alternateEmail; 
    }
    
    public String getPassword() { 
        return password; 
    }

    public String getName() {
        return firstName + " " + lastName;
    }

    public String getEmail() {
        return email;
    }

    // Show info method to display the name, email, and mailbox capacity
    public String showInfo() {
        return "DISPLAY NAME: " + firstName + " " + lastName + 
               "\\nCOMPANY EMAIL: " + email + 
               "\\nMAILBOX CAPACITY: " + mailboxCapacity + "mb" +
               "\\nALTERNATE EMAIL: " + alternateEmail;
    }
}
`;

export const EMAIL_APP_JAVA_CODE = `package emailapp;

public class EmailApp {

    public static void main(String[] args) {
        // Instantiate new Email object for new hire
        Email em1 = new Email("John", "Smith");

        // Demonstration of Class Set Methods
        em1.setAlternateEmail("jsmith.work@gmail.com");
        em1.setMailboxCapacity(1000);
        em1.changePassword("Secur3P@ssw0rd!2026");

        // Demonstration of Class Get Methods
        System.out.println("\\n--- GET METHODS VERIFICATION ---");
        System.out.println("Get Name: " + em1.getName());
        System.out.println("Get Email: " + em1.getEmail());
        System.out.println("Get Mailbox Capacity: " + em1.getMailboxCapacity() + "mb");
        System.out.println("Get Alternate Email: " + em1.getAlternateEmail());

        // Using the showInfo() method
        System.out.println("\\n--- SHOW INFO METHOD OUTPUT ---");
        System.out.println(em1.showInfo());
    }
}
`;

export const SPAM_FILTER_JAVA_CODE = `package emailapp;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class SpamFilterService {
    private double spamThreshold = 5.0;
    private List<String> spamKeywords = new ArrayList<>();
    private List<Pattern> suspiciousPatterns = new ArrayList<>();

    public SpamFilterService() {
        // Default enterprise heuristics
        spamKeywords.add("wire transfer");
        spamKeywords.add("urgent payment");
        spamKeywords.add("claim your prize");
        spamKeywords.add("verify your crypto");
        spamKeywords.add("password expiring");
        spamKeywords.add("nigerian prince");
    }

    public static class InspectionResult {
        public boolean isSpam;
        public double score;
        public List<String> triggeredRules = new ArrayList<>();

        public InspectionResult(boolean isSpam, double score) {
            this.isSpam = isSpam;
            this.score = score;
        }
    }

    public InspectionResult inspect(String sender, String subject, String body) {
        double score = 0.0;
        List<String> triggers = new ArrayList<>();
        String content = (subject + " " + body).toLowerCase();

        for (String keyword : spamKeywords) {
            if (content.contains(keyword)) {
                score += 2.5;
                triggers.add("Spam Keyword Trigger: '" + keyword + "'");
            }
        }

        if (subject.toUpperCase().equals(subject) && subject.length() > 8) {
            score += 2.0;
            triggers.add("All-Caps Subject Line");
        }

        if (sender.endsWith(".xyz") || sender.endsWith(".top") || sender.endsWith(".ru")) {
            score += 3.0;
            triggers.add("High-Risk Top Level Domain: " + sender);
        }

        boolean isSpam = score >= spamThreshold;
        InspectionResult result = new InspectionResult(isSpam, Math.min(10.0, score));
        result.triggeredRules = triggers;
        return result;
    }
}
`;
