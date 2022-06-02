import { getPosts } from "../services/posts";

// Test ping later
const pingServer = async (req: any, res: any) => {
  try {
    await getPosts();
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export default pingServer;
