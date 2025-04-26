import { Request, Response } from 'express'
import { petalModel } from '../models/petalModel'
import { Petal } from 'generated/prisma'

export const petalController = {
  async getPetals(_req: Request, res: Response) {
    try {
      const petals: Petal[] = await petalModel.getAllPetals()
      res.json(petals)
    } catch (error) {
      console.error('Error retrieving petals from the controller', error)
      res.status(500).json({ error })
    }
  },
}
