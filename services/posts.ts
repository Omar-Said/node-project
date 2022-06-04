import axios, { AxiosResponse } from "axios";
import cache from "memory-cache";
import { Direction, SortBy, IPosts } from "../common/types";
import _ from "lodash";
import { API_URL } from "../common/config";

interface IPostsParams {
  tags: string;
  sortBy?: SortBy;
  direction?: Direction;
}

const getPosts = async (queryParam?: IPostsParams) => {
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
      requestURLs.push(axios.get<IPosts[]>(`${API_URL}${tag}`));
    } else {
      posts.push(...postsFromCache);
    }
  });

  const result = await Promise.all(requestURLs);

  if (result.length > 0) {
    posts.push(...addPosts(result));
  }

  return sortPosts(
    _.uniqBy(posts, (post) => post.id),
    direction,
    sortBy
  );
};

const sortPosts = (posts: IPosts[], direction: Direction, sortBy: SortBy) => {
  return posts.sort((a: IPosts, b: IPosts) => {
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

  return [];
};

export { getPosts, SortBy, Direction };
