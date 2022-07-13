import { faker } from "@faker-js/faker";

const slugify = (...args: (string | number)[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

const generatePost = () => {
  const postTitle = faker.lorem.words();
  const postBody = `# ${faker.lorem.words()} \n${faker.lorem.words(20)}`;
  const postSlug = slugify(postTitle);

  return { postTitle, postBody, postSlug };
};

const generateCommunity = () => {
  const name = faker.lorem.words(2);
  const description = faker.lorem.words(20);

  return { name, description };
};

const generateCommentBody = () => {
  return `# ${faker.lorem.words()} \n${faker.lorem.words(20)}`;
};

export { generatePost, generateCommentBody, generateCommunity };
