import bcrypt from "bcryptjs";

const password = process.argv[2] || "admin123";

bcrypt.hash(password, 10).then((hash) => {
  console.log("\n✅ Password hash generated:");
  console.log(hash);
  console.log("\n📋 Copy this hash to MongoDB Atlas for the password field");
  console.log(`\nPassword: ${password}`);
  console.log(`Hash: ${hash}\n`);
  process.exit(0);
});

