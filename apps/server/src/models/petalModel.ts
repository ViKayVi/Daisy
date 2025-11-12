import { prisma } from '../lib/prisma'

interface PetalData {
  dayOfWeek: string
  timeOfDay: string
  currentEmotion: string
  desiredEmotion: string
  text: string
}

interface PetalData {
  dayOfWeek: string
  timeOfDay: string
  currentEmotion: string
  desiredEmotion: string
  text: string
}

export const petalModel = {
  async getAllPetals() {
    try {
      return await prisma.petal.findMany()
    } catch (error) {
      console.error('Error al obtener los pétalos desde el modelo:', error)
      throw error
    }
  },
<<<<<<< HEAD
  async createNewPetal(data: PetalData) {
=======
  async createNewPetal(data: PetalData): Promise<Petal> {
>>>>>>> a7b1998 (feat(client): enhance client app with new components and dependencies)
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
