import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const passwordHashEdu = await bcrypt.hash('1105', 10)
  const passwordHashJulia = await bcrypt.hash('teamo', 10)

  await prisma.user.upsert({
    where: { email: 'teamo@cantinho.app' },
    update: {},
    create: { name: 'Eduardo', email: 'teamo@cantinho.app', passwordHash: passwordHashEdu },
  })

  await prisma.user.upsert({
    where: { email: 'julia@cantinho.app' },
    update: {},
    create: { name: 'Julia', email: 'julia@cantinho.app', passwordHash: passwordHashJulia },
  })

  console.log('✅ Seed concluído!')
  console.log('👤 teamo@cantinho.app / 1105')
  console.log('👤 julia@cantinho.app / teamo')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
