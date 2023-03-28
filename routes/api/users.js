import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const users = {
  getusers: async (req, res) => {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    res.json(users);
  },

  postUser: async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          status: true,
        },
      });
      return res.status(201).json({
        success: true,
        message: "User Created Successfully",
        data: user,
      });
    } catch (error) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "user creation error email already exists",
      });
    }
  },

  updateUser: async (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    res.json(user);
  },
  deactivateUser: async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { status },
    });
    res.json(user);
  },
  getUser: async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma.user.findMany({
      where: { id },
      include: {
        posts: true,
      },
    });
    if (user.length > 0) {
      res.json(user);
    } else res.json(`No user found with id of ${id}`);
  },

  deleteUser: async (req, res) => {
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      if (user) {
        res.json({ message: "User Deleted", user });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  deleteusers: async (req, res) => {
    let id = req.body.ids;
    try {
      if (id && id.length > 0) {
        const user = await prisma.user.deleteMany({
          where: {
            id: { in: id },
          },
        });
        if (user?.count > 0) {
          res.status(200).json({
            message: user.count + " User(s) Deleted Successfully",
          });
        }
        {
          res.status(404).send({ message: "Users not found" });
        }
      } else {
        res
          .status(400)
          .send({ message: "Please Proviode id(s) of users to delete" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
export default users;
