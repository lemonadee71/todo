const uuid = (length = 12) => Math.random().toString(36).substr(2, length);

export default uuid;
