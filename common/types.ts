enum Direction {
  ASC = "asc",
  DESC = "desc",
}

enum SortBy {
  ID = "id",
  READS = "reads",
  LIKES = "likes",
  POPULARITY = "popularity",
}

interface IPosts {
  author: string;
  authorId: number;
  id: number;
  likes: number;
  popularity: number;
  reads: number;
  tags: string[];
}

export { Direction, SortBy, IPosts };
