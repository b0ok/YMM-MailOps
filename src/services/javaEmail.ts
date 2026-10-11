/**
 * Java Email OOP Simulation
 * Transpiled equivalent of the Java Email.java class
 * with 100% adherence to the IT Support Administrator specification.
 */

export class JavaEmail {
  private firstName: string;
  private lastName: string;
  private password: string;
  private department: string; // 'sales', 'dev', 'acct', or ''
  private email: string;
  private mailboxCapacity: number = 500;
  private defaultPasswordLength: number = 10;
  private alternateEmail: string = 'None';
  private companySuffix: string = 'aeycompany.com';
  
  // Execution history log for Java console output
  private consoleLogs: string[] = [];

  /**
   * Constructor to receive the first name and last name
   * @param firstName Worker's first name
   * @param lastName Worker's last name
   * @param depChoice Department code (1 = sales, 2 = dev, 3 = acct, 0 = none)
   * @param customCompanySuffix Optional company domain
   */
  constructor(
    firstName: string,
    lastName: string,
    depChoice: number | string = 0,
    customCompanySuffix: string = 'aeycompany.com'
  ) {
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
    this.companySuffix = customCompanySuffix.trim() || 'aeycompany.com';

    this.log(`Instantiating new Email object: new Email("${this.firstName}", "${this.lastName}")`);

    // Determine the department (sales, development, accounting), if none leave blank
    this.department = this.setDepartment(depChoice);
    this.log(`Department determined: "${this.department || '(None - blank)'}"`);

    // Call a method that returns a random password
    this.password = this.randomPassword(this.defaultPasswordLength);
    this.log(`Your password is: ${this.password}`);

    // Combine elements to generate email syntax
    // firstname.lastname@department.company.com (or firstname.lastname@company.com if none)
    const cleanFirst = this.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = this.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (this.department.length === 0) {
      this.email = `${cleanFirst}.${cleanLast}@${this.companySuffix}`;
    } else {
      this.email = `${cleanFirst}.${cleanLast}@${this.department}.${this.companySuffix}`;
    }

    this.log(`Email syntax generated: ${this.email}`);
  }

  /**
   * Determine the department (sales, development, accounting), if none leave blank
   * Java representation:
   * 1 for Sales -> "sales"
   * 2 for Development -> "dev"
   * 3 for Accounting -> "acct"
   * 0 for none -> ""
   */
  private setDepartment(choice: number | string): string {
    const numChoice = typeof choice === 'string' ? parseInt(choice, 10) : choice;
    if (numChoice === 1 || choice === 'sales') {
      return 'sales';
    } else if (numChoice === 2 || choice === 'dev' || choice === 'development') {
      return 'dev';
    } else if (numChoice === 3 || choice === 'acct' || choice === 'accounting') {
      return 'acct';
    } else {
      return '';
    }
  }

  /**
   * Generate a random String for a password
   */
  private randomPassword(length: number): string {
    const passwordSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let result = '';
    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * passwordSet.length);
      result += passwordSet.charAt(rand);
    }
    return result;
  }

  // ==========================================
  // IMPLEMENT CLASS SET METHODS
  // ==========================================

  /**
   * Set method: Set the mailbox capacity
   * @param capacity Capacity in megabytes
   */
  public setMailboxCapacity(capacity: number): void {
    this.mailboxCapacity = capacity;
    this.log(`Called em1.setMailboxCapacity(${capacity}) -> New capacity: ${capacity}mb`);
  }

  /**
   * Set method: Define an alternate email address
   * @param altEmail Alternate email address
   */
  public setAlternateEmail(altEmail: string): void {
    this.alternateEmail = altEmail;
    this.log(`Called em1.setAlternateEmail("${altEmail}")`);
  }

  /**
   * Set method: Change the password
   * @param newPassword New password string
   */
  public changePassword(newPassword: string): void {
    this.password = newPassword;
    this.log(`Called em1.changePassword("********") -> Password updated successfully`);
  }

  // ==========================================
  // IMPLEMENT CLASS GET METHODS
  // ==========================================

  /**
   * Get method: Display mailbox capacity
   */
  public getMailboxCapacity(): number {
    this.log(`Called em1.getMailboxCapacity() -> Returned: ${this.mailboxCapacity}`);
    return this.mailboxCapacity;
  }

  /**
   * Get method: Display alternate email
   */
  public getAlternateEmail(): string {
    this.log(`Called em1.getAlternateEmail() -> Returned: "${this.alternateEmail}"`);
    return this.alternateEmail;
  }

  /**
   * Get method: Display password
   */
  public getPassword(): string {
    this.log(`Called em1.getPassword() -> Returned: "${this.password}"`);
    return this.password;
  }

  /**
   * Get method: Display full name
   */
  public getName(): string {
    const fullName = `${this.firstName} ${this.lastName}`;
    this.log(`Called em1.getName() -> Returned: "${fullName}"`);
    return fullName;
  }

  /**
   * Get method: Display generated email
   */
  public getEmail(): string {
    this.log(`Called em1.getEmail() -> Returned: "${this.email}"`);
    return this.email;
  }

  // ==========================================
  // SHOW INFO METHOD
  // ==========================================

  /**
   * Using the showInfo() method to display the name, email, and mailbox capacity
   */
  public showInfo(): string {
    const output = 
      `DISPLAY NAME: ${this.firstName} ${this.lastName}\n` +
      `COMPANY EMAIL: ${this.email}\n` +
      `MAILBOX CAPACITY: ${this.mailboxCapacity}mb\n` +
      `ALTERNATE EMAIL: ${this.alternateEmail}`;
    
    this.log(`Called em1.showInfo():\n${output}`);
    return output;
  }

  // Internal helpers
  private log(message: string): void {
    this.consoleLogs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  public getConsoleLogs(): string[] {
    return [...this.consoleLogs];
  }

  public getRawData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      department: this.department,
      companySuffix: this.companySuffix,
      email: this.email,
      password: this.password,
      mailboxCapacity: this.mailboxCapacity,
      alternateEmail: this.alternateEmail,
    };
  }
}
