import axios from "axios";
import { API_URL } from "../common/config";

const pingServer = async (req: any, res: any) => {
  try {
    await axios.get(`${API_URL}tech`);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export default pingServer;
