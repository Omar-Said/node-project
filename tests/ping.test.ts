import axios from "axios";

test("testing ping", async () => {
  const response = await axios.get(
    "https://api.hatchways.io/assessment/blog/posts?tag=tech"
  );
  expect(Array.isArray(response.data.posts)).toBe(true);
});
