import { PrismaClient, Petal } from 'generated/prisma'

const prisma = new PrismaClient()

export const petalModel = {
  async getAllPetals(): Promise<Petal[]> {
    try {
      return await prisma.petal.findMany()
    } catch (error) {
      console.error('Error al obtener los pétalos desde el modelo:', error)
      throw error
    }
  },
}
