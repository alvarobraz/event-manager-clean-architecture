import { app } from '@/infra/http/app'
import { prisma } from '@/infra/database/prisma/lib/prisma'
import request from 'supertest'
import { resolve } from 'node:path'
import { vi, describe, it, expect } from 'vitest'

vi.mock('@/infra/storage/cloudflare-r2-storage', () => {
  return {
    CloudflareR2Storage: vi.fn().mockImplementation(function () {
      return {
        upload: vi.fn().mockResolvedValue({ url: 'fake-image-key.png' }),
      }
    }),
  }
})

describe('Upload Attachment (E2E)', () => {
  it('should be able to upload an attachment', async () => {
    const filePath = resolve(process.cwd(), 'test/assets/test-image.png')

    const response = await request(app)
      .post('/attachments')
      .attach('file', filePath)

    expect(response.status).toBe(201)
    expect(response.body.attachment).toHaveProperty('id')

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: { id: response.body.attachment.id },
    })

    expect(attachmentOnDatabase).toBeTruthy()
  })

  it('should return 400 when no file is provided', async () => {
    const response = await request(app).post('/attachments').send({})

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('File is required')
  })
})
