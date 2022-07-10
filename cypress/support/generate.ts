import { faker } from "@faker-js/faker";

const generatePost = () => {
  const postTitle = faker.lorem.words();
  const postBody = `# ${faker.lorem.words()} \n${faker.lorem.words(20)}`;
  const postSlug = postTitle.toLowerCase().replace(/\s/g, "-");

  return { postTitle, postBody, postSlug };
};

const generateCommunity = () => {
  const name = faker.lorem.words(2);
  const description = faker.lorem.words(20);

  return { name, description };
};

const generateCommentBody = () => {
  return `# ${faker.lorem.words()} \n${faker.lorem.text()}`;
};

export { generatePost, generateCommentBody, generateCommunity };
