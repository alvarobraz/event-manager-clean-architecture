/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { prisma } from '@/infra/database/prisma/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

async function main() {
  console.log('🌱 Starting seed...')

  await prisma.registration.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.event.deleteMany()
  await prisma.attachment.deleteMany()
  console.log('🧹 Database cleaned')

  const attachmentId = uuidv4()
  await prisma.attachment.create({
    data: {
      id: attachmentId,
      title: 'Node.js Summit Banner',
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
    },
  })
  console.log('✅ Attachment created')

  const eventId = uuidv4()
  await prisma.event.create({
    data: {
      id: eventId,
      name: 'CWBCoding Tech Summit 2026',
      description: 'O maior evento de Clean Architecture de Curitiba.',
      date: new Date('2026-12-01T19:00:00Z'),
      bannerImageId: attachmentId,
    },
  })
  console.log('✅ Event created')

  console.log('⏳ Creating 15 participants and registrations...')

  for (let i = 1; i <= 15; i++) {
    const participantId = uuidv4()

    await prisma.participant.create({
      data: {
        id: participantId,
        name: `Participante Dev ${i}`,
        email: `dev${i}@cwbcoding.com.br`,
        phone: `419999900${i.toString().padStart(2, '0')}`,
      },
    })

    await prisma.registration.create({
      data: {
        id: uuidv4(),
        eventId: eventId,
        participantId: participantId,
      },
    })
  }

  console.log('✅ 15 Participants and Registrations created successfully!')
  console.log('🚀 Seed finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
