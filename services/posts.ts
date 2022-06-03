import axios, { AxiosResponse } from "axios";
import cache from "memory-cache";
import { Direction, SortBy, IPosts } from "../common/types";
import _ from "lodash";

interface IPostsParams {
  tags: string;
  sortBy?: SortBy;
  direction?: Direction;
}

// add try catch
const getPosts = async (ping: boolean = false, queryParam?: IPostsParams) => {
  const tags = queryParam?.tags;
  const sortBy = queryParam?.sortBy || SortBy.ID;
  const direction = queryParam?.direction || Direction.ASC;

  const postTags: any[] = [];

  if (tags?.includes(",")) {
    postTags.push(...tags.split(","));
  } else {
    postTags.push(tags);
  }
  let posts: IPosts[] = [];
  const requestURLs: Promise<AxiosResponse<IPosts[], any>>[] = [];

  postTags.forEach((tag) => {
    const postsFromCache = getPostsFromCache(tag);
    if (postsFromCache.length === 0) {
      requestURLs.push(
        axios.get<IPosts[]>(
          `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`
        )
      );
    } else {
      posts.push(...postsFromCache);
    }
  });

  const result = await Promise.all(requestURLs);

  if (result.length > 0) {
    posts.push(...addPosts(result));
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
    savePostsToCache(data.posts);
    posts.push(...data.posts);
  });

  return posts;
};

const savePostsToCache = (posts: IPosts[]) => {
  const allTags: string[] = [];
  posts.forEach((post) => {
    allTags.push(...post.tags);
  });

  const tags = [...new Set(allTags)];

  tags.forEach((tag) => {
    const postsForTag = posts.filter((post) => {
      return post.tags.includes(tag);
    });
    cache.put(tag, JSON.stringify(postsForTag), 60000);
  });
};

const getPostsFromCache = (tag: string) => {
  const posts: IPosts[] = [];
  if (cache.get(tag)?.length > 0) {
    posts.push(...JSON.parse(cache.get(tag)));
  }

  return posts;
};

export { getPosts, SortBy, Direction };
