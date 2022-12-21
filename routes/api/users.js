import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const users = {
  getusers: async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
  },

  postUser: async (req, res) => {
    const { name, email } = req.body
    const user = await prisma.user.create({
      data: {
        name,
        email,
        status: true
      },
    })
    res.json(user)
  },

  updateUser: async (req, res) => {
    const id = Number(req.params.id)
    const { name, email } = req.body
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    })
    res.json(user)
  },
  deactivateUser: async (req, res) => {
    const id = Number(req.params.id)
    const { status } = req.body
    const data = await prisma.user.findMany({
      where: { id },
    })
    const user = await prisma.user.update({
      where: { id },
      data: { ...data[0], status },
    })
    res.json(user)
  },
  getUser: async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.findMany({
      where: { id },
    })
    if (user.length > 0) {
      res.json(user)
    }
    else
      res.json(`No user found with id of ${id}`)
  },

  deleteUser: async (req, res) => {
    const id = Number(req.params.id)
    const user = await prisma.user.delete({
      where: {
        id,
      },
    })
    res.json(user)
  },
  deleteusers: async (req, res) => {
    let id = req.body.id

    const user = await prisma.user.deleteMany({
      where: {
        id: { in: id }
      }
    })
    res.json(user)
  }
}
export default users