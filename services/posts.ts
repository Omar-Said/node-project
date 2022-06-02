import axios from "axios";
import cache from "memory-cache";

const sortByParams = ["id", "reads", "likes", "popularity"];
const directionParams = ["asc", "desc"];

interface IPostsParams {
  tags: string;
  sortBy?: typeof sortByParams;
  direction?: typeof directionParams;
}

// add try catch
const getPosts = async (ping: boolean = false, queryParam?: IPostsParams) => {
  // update cache on different params
  // if (cache.get("posts")?.length > 0 && !ping) {
  //   console.log("CACHED BABY");
  //   return JSON.parse(cache.get("posts"));
  // }

  const posts = await axios.get(
    `https://api.hatchways.io/assessment/blog/posts?tag=${queryParam?.tags}`
  );
  cache.put("posts", JSON.stringify(posts.data.posts), 60000);

  return posts.data.posts;
};

export { getPosts, sortByParams, directionParams };
