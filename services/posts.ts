import axios, { AxiosResponse } from "axios";
import cache from "memory-cache";
import { Direction, SortBy, IPosts } from "../common/types";

interface IPostsParams {
  tags: string;
  sortBy?: SortBy;
  direction?: Direction;
}

// add try catch
const getPosts = async (ping: boolean = false, queryParam?: IPostsParams) => {
  // update cache on different params
  // if (cache.get("posts")?.length > 0 && !ping) {
  //   console.log("CACHED BABY");
  //   return JSON.parse(cache.get("posts"));
  // }

  const tags = queryParam?.tags;
  const sortBy = queryParam?.sortBy || SortBy.ID;
  const direction = queryParam?.direction || Direction.ASC;

  const postTags: any[] = [];

  if (tags?.includes(",")) {
    postTags.push(...tags.split(","));
  } else {
    postTags.push(tags);
  }

  const requestURLs = postTags.map((tag) => {
    return axios.get<IPosts[]>(
      `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`
    );
  });

  const result = await Promise.all(requestURLs);
  let posts: IPosts[] = [];

  if (result.length > 0) {
    posts = addPosts(result);
  }

  if (sortBy) {
    sortPosts(posts, direction, sortBy);
  }

  return posts;
};

const sortPosts = (posts: IPosts[], direction: Direction, sortBy: SortBy) => {
  posts.sort((a: IPosts, b: IPosts) => {
    return direction === Direction.ASC
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy];
  });
};

const addPosts = (result: AxiosResponse<any, any>[]) => {
  const posts: IPosts[] = [];

  result.forEach(({ data }) => {
    console.log("ADD SOME TEXT PLEAE", data);
    posts.push(...data.posts);
  });

  return posts;
};

export { getPosts, SortBy, Direction };
// cache.put("posts", JSON.stringify(posts.data.posts), 60000);
