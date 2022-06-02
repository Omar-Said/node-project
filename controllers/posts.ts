import { getPosts, sortByParams, directionParams } from "../services/posts";

const fetchPosts = async (req: any, res: any) => {
  if (!req?.query?.tags || req?.query?.tags === "") {
    res.status(400).json({ error: "tags parameter is required" });
  }

  if (req?.query?.sortBy && !sortByParams.includes(req?.query?.sortBy)) {
    res.status(400).json({ error: "sortBy parameter is invalid" });
  }

  if (
    req?.query?.direction &&
    !directionParams.includes(req?.query?.direction)
  ) {
    res.status(400).json({ error: "direction parameter is required" });
  }

  const posts = await getPosts(false, { tags: req.query.tags });
  res.status(200).json({ posts });
};

export default fetchPosts;
