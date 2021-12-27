const randomString = (length) => Math.random().toString(36).substr(2, length);

const uuid = (length = 20) => {
  const lengthA = Math.floor(length / 2);
  const lengthB = length - lengthA;

  return randomString(lengthA) + randomString(lengthB);
};

export default uuid;
