import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const logs = {
  getLogs: async (req, res) => {
    const { authData } = req.body;
    if (authData) {
      let logs = await prisma.logger.findMany({
        where: {
          user_id: authData.id,
        },
      });
      res.json(logs);
    } else {
      res.status(400).json({
        message: "User is not logged in.",
      });
    }
  },
};
export default logs;
