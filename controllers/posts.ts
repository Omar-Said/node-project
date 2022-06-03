import { getPosts, SortBy, Direction } from "../services/posts";

const fetchPosts = async (req: any, res: any) => {
  if (!req?.query?.tags || req?.query?.tags === "") {
    res.status(400).json({ error: "tags parameter is required" });
  }

  if (
    req?.query?.sortBy &&
    !Object.values(SortBy).includes(req?.query?.sortBy)
  ) {
    res.status(400).json({ error: "sortBy parameter is invalid" });
  }

  if (
    req?.query?.direction &&
    !Object.values(Direction).includes(req?.query?.direction)
  ) {
    res.status(400).json({ error: "direction parameter is required" });
  }

  const posts = await getPosts(false, {
    tags: req.query.tags,
    ...(req.query.sortBy && { sortBy: req.query.sortBy }),
    ...(req.query.direction && { direction: req.query.direction }),
  });
  res.status(200).json({ posts });
};

export default fetchPosts;
