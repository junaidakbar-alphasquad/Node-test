import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();
const posts = {
  getPosts: async (req, res) => {
    const { authData } = req.body;
    // let posts = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const posts = await prisma.post.findMany({
      where: { auther_id: authData.id },
      select: {
        id: true,
        title: true,
        body: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(posts);
  },
  getAllPosts: async (req, res) => {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        body: true,
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json(posts);
  },

  postPost: async (req, res) => {
    const { title, body, authData } = req.body;
    try {
      const post = await prisma.post.create({
        data: {
          title,
          body,
          user: {
            connect: { id: authData.id },
          },
        },
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error,
      });
    }
  },

  updatePost: async (req, res) => {
    const id = Number(req.params.id);
    const { title, body } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { title, body },
    });
    res.json(post);
  },
  getPost: async (req, res) => {
    const id = Number(req.params.id);
    try {
      const post = await prisma.post.findFirst({
        where: { id },
      });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Post not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error,
      });
    }
  },

  deletePost: async (req, res) => {
    const id = Number(req.params.id);
    try {
      const post = await prisma.post.delete({
        where: {
          id,
        },
      });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Post not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error,
      });
    }
  },
  deleteposts: async (req, res) => {
    let id = req.body.id;
    try {
      const post = await prisma.post.deleteMany({
        where: {
          id: { in: id },
        },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Something went wrong",
        error,
      });
    }
  },
};
export default posts;
