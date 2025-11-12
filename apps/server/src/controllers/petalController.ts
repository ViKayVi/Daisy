import { Request, Response } from 'express'
import { petalModel } from '../models/petalModel'
<<<<<<< HEAD
import { prisma } from '../lib/prisma'

=======
import { PrismaClient, Petal } from 'generated/prisma'

const prisma = new PrismaClient()

>>>>>>> a7b1998 (feat(client): enhance client app with new components and dependencies)
const petalController = {
  async getPetals(_req: Request, res: Response) {
    try {
      const petals = await petalModel.getAllPetals()
      res.json(petals)
    } catch (error) {
      console.error('Error retrieving petals from the controller', error)
      res.status(500).json({
        error: 'Failed to retrieve petals',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  async createPetal(req: Request, res: Response) {
    try {
      const { dayOfWeek, timeOfDay, currentEmotion, desiredEmotion, text } =
        req.body

      if (
        !dayOfWeek ||
        !timeOfDay ||
        !currentEmotion ||
        !desiredEmotion ||
        !text
      ) {
        return res.status(400).json({ error: 'All fields are required' })
      }

      const petalData = {
        dayOfWeek,
        timeOfDay,
        currentEmotion,
        desiredEmotion,
        text,
      }

      const savedPetal = await petalModel.createNewPetal(petalData)
      res.status(201).json(savedPetal)
    } catch (error) {
      console.error('Error creating petal:', error)
      res.status(500).json({
        error: 'Failed to create petal',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  async getPetalById(req: Request, res: Response) {
    const { id } = req.params

    try {
      const petal = await petalModel.getPetalById(id)

      if (!petal) {
        return res.status(404).json({ error: 'Petal not found' })
      }

      res.json(petal)
    } catch (error) {
      console.error('Error retrieving petal by ID from the controller', error)
      res.status(500).json({
        error: 'Failed to retrieve petal',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  async deletePetal(req: Request, res: Response) {
    try {
      const petalId = req.params.id
      const deletedPetal = await prisma.petal.delete({
        where: {
          id: petalId,
        },
      })

      res
        .status(200)
        .json({ message: 'Petal deleted successfully', deletedPetal })
    } catch (error) {
      console.error('Error deleting petal:', error)
      res.status(500).json({
        error: 'Error deleting petal',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  async updatePetal(req: Request, res: Response) {
    const { id } = req.params
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    try {
      const updatedPetal = await prisma.petal.update({
        where: { id },
        data: { text },
      })

      res.json(updatedPetal)
    } catch (error: any) {
      console.error('Error updating petal:', error)

      res.status(500).json({ error: 'Failed to update petal' })
    }
  },
  async createPetal(req: Request, res: Response) {
    try {
      const { dayOfWeek, timeOfDay, currentEmotion, desiredEmotion, text } =
        req.body

      if (
        !dayOfWeek ||
        !timeOfDay ||
        !currentEmotion ||
        !desiredEmotion ||
        !text
      ) {
        res.status(400).json({ error: 'All fields are required' })
      }

      const petalData = {
        dayOfWeek,
        timeOfDay,
        currentEmotion,
        desiredEmotion,
        text,
      }

      const savedPetal = await petalModel.createNewPetal(petalData)
      res.status(201).json(savedPetal)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create petal' })
    }
  },
  async getPetalById(req: Request, res: Response) {
    const { id } = req.params

    try {
      const petal: Petal | null = await petalModel.getPetalById(id)

      if (!petal) {
        res.status(404).json({ error: 'Petal not found' })
      }

      res.json(petal)
    } catch (error) {
      console.error('Error retrieving petal by ID from the controller', error)
      res.status(500).json({ error: 'Failed to retrieve petal' })
    }
  },
  async deletePetal(req: Request, res: Response) {
    try {
      const petalId = req.params.id
      const deletedPetal = await prisma.petal.delete({
        where: {
          id: petalId,
        },
      })

      res
        .status(200)
        .json({ message: 'Petal deleted successfully', deletedPetal })
    } catch (error) {
      res.status(500).json({ error: 'Error deleting petal' })
    }
  },
  async updatePetal(req: Request, res: Response) {
    const { id } = req.params
    const { text } = req.body

    if (!text) {
      res.status(400).json({ error: 'Text is required' })
    }

    try {
      const updatedPetal = await prisma.petal.update({
        where: { id },
        data: { text },
      })

      res.json(updatedPetal)
    } catch (error: any) {
      console.error('Error updating petal:', error)

      res.status(500).json({ error: 'Failed to update petal' })
    }
  },
}

export default petalController
