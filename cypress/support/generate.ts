import { faker } from "@faker-js/faker";

const generatePost = () => {
  const postTitle = faker.lorem.words();
  const postBody = `# ${faker.lorem.words()} \n${faker.lorem.words(20)}`;

  return { postTitle, postBody };
};

const generateCommunity = () => {
  const communityName = faker.lorem.words(2).replace(/ /g, "");
  const communityDescription = faker.lorem.words(20);

  return { communityName, communityDescription };
};

const generateCommentBody = () => {
  return `# ${faker.lorem.words()} \n${faker.lorem.words(20)}`;
};

export { generatePost, generateCommentBody, generateCommunity };
