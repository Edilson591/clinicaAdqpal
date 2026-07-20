import prisma from "../src/infrastructure/database/prismaClient";

// async function main() {
//   const patients = await prisma.patient.findMany({
//     where: {
//       registrationNumber: null,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });

//   console.log(`Encontrados ${patients.length} pacientes.`);

//   for (const patient of patients) {
//     const [{ nextval }] = await prisma.$queryRaw<
//       { nextval: bigint }[]
//     >`SELECT nextval('patient_registration_seq')`;

//     const registrationNumber = Number(nextval)
//       .toString()
//       .padStart(6, "0");

//     await prisma.patient.update({
//       where: { id: patient.id },
//       data: {
//         registrationNumber,
//       },
//     });

//     console.log(
//       `${patient.name} -> ${registrationNumber}`
//     );
//   }

//   console.log("Concluído!");
// }

// main()
//   .catch(console.error)
//   .finally(async () => {
//     await prisma.$disconnect();
//   });