import { PrismaClient } from '@prisma/client'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const posts = {
  getPosts: async (req, res) => {
    const {authData}=req.body
    const posts = await prisma.post.findMany({
      where:{ user_id: authData.user[0].id}}
    )
    res.json({ posts, })
  },

  postPost: async (req, res) => {
    const { title, body, authData } = req.body
    const post = await prisma.post.create({
      data: {
        title,
        body, user_id: authData.user[0].id

      },
    })
    res.json(post)
  },

  updatePost: async (req, res) => {
    const id = Number(req.params.id)
    const { title, body } = req.body
    const post = await prisma.post.update({
      where: { id },
      data: { title, body },
    })
    res.json(post)
  },
  getPost: async (req, res) => {
    const id = Number(req.params.id)
    const { title, body } = req.body
    const post = await prisma.post.findMany({
      where: { id },
    })
    res.json(post)
  },

  deletePost: async (req, res) => {
    const id = Number(req.params.id)
    const post = await prisma.post.delete({
      where: {
        id,
      },
    })
    res.json(post)
  },
  deleteposts: async (req, res) => {
    let id = req.body.id

    const post = await prisma.post.deleteMany({
      where: {
        id: { in: id }
      }
    })
    res.json(post)
  }
}
export default posts