import { PrismaClient, Petal } from 'generated/prisma'

const prisma = new PrismaClient()

interface PetalData {
  dayOfWeek: string
  timeOfDay: string
  currentEmotion: string
  desiredEmotion: string
  text: string
}

export const petalModel = {
  async getAllPetals(): Promise<Petal[]> {
    try {
      return await prisma.petal.findMany()
    } catch (error) {
      console.error('Error al obtener los pétalos desde el modelo:', error)
      throw error
    }
  },
  async createNewPetal(data: PetalData): Promise<Petal> {
    try {
      const petal = await prisma.petal.create({
        data: {
          day_of_week: data.dayOfWeek,
          time_of_day: data.timeOfDay,
          current_emotion: data.currentEmotion,
          desired_emotion: data.desiredEmotion,
          text: data.text,
        },
      })
      return petal
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
  async getPetalById(id: string) {
    return prisma.petal.findUnique({
      where: { id },
    })
  },
}
