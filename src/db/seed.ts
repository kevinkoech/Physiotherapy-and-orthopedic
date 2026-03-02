// This script seeds the database with default users
import { db } from "./index";
import { users } from "./schema";

const defaultUsers = [
  {
    name: "Kevin Koech",
    admissionNumber: "ADMIN001",
    className: "Admin",
    role: "admin",
  },
  {
    name: "Trainer User",
    admissionNumber: "TRAINER001",
    className: "Trainer",
    role: "trainer",
  },
  {
    name: "Demo Trainee",
    admissionNumber: "TP001/2024",
    className: "Biomedical Engineering",
    role: "trainee",
  },
  {
    name: "John Doe",
    admissionNumber: "TP002/2024",
    className: "Biomedical Engineering",
    role: "trainee",
  },
  {
    name: "Jane Smith",
    admissionNumber: "TP003/2024",
    className: "Biomedical Engineering",
    role: "trainee",
  },
];

async function seed() {
  console.log("Seeding database...");
  
  for (const user of defaultUsers) {
    try {
      await db.insert(users).values(user);
      console.log(`Inserted user: ${user.name} (${user.admissionNumber})`);
    } catch (error: any) {
      if (error?.message?.includes("UNIQUE constraint failed")) {
        console.log(`User already exists: ${user.admissionNumber}`);
      } else {
        console.error(`Error inserting user ${user.admissionNumber}:`, error);
      }
    }
  }
  
  console.log("Seeding complete!");
}

seed().catch(console.error);
