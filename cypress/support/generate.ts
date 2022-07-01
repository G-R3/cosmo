import { faker } from "@faker-js/faker";

const generatePost = () => {
  const postTitle = faker.lorem.words();
  const postBody = `# ${faker.lorem.words()} \n${faker.lorem.text()}`;
  const postSlug = postTitle.toLowerCase().replace(/\s/g, "-");

  return { postTitle, postBody, postSlug };
};

const generateCommentBody = () => {
  return `# ${faker.lorem.words()} \n${faker.lorem.text()}`;
};

export { generatePost, generateCommentBody };
