const rand = (length) => Math.random().toString(36).substr(2, length);

const uuid = (length = 12) => {
  const lengthA = Math.floor(length / 2);
  const lengthB = length - lengthA;

  return rand(lengthA) + rand(lengthB);
};

export default uuid;
