import prisma from "./lib/prisma";

async function backfill(): Promise<void> {
  await prisma.channel.update({
    where: { id: "UC8mWYDxedkJmUReAiA3ze9w" },
    data: { handle: "@EnglishFairyTales" },
  });

  await prisma.channel.update({
    where: { id: "UCDHPWuB2KusoPuai3HAjaRw" },
    data: { handle: "@RussianFairyTales" },
  });

  console.log("Backfilled channel handles");
}

backfill().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
