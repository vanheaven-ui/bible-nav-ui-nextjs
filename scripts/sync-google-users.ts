import { prisma } from "../src/lib/prisma";

async function main() {
  // Get all Google accounts and include linked user
  const googleAccounts = await prisma.account.findMany({
    where: { provider: "google" },
    include: { user: true },
  });

  for (const account of googleAccounts) {
    if (account.user) {
      console.log(
        `User already exists for account: ${account.id}, username: ${account.user.username}`
      );
      continue;
    }

    // Create a new user with default values
    const newUser = await prisma.user.create({
      data: {
        id: account.userId,
        email: undefined, // no email available in Account
        username: `GoogleUser_${account.id.substring(0, 6)}`, // unique default
      },
    });

    console.log(`Created new user for Google account: ${account.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
