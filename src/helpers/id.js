const uuid = (length = 8) => Math.random().toString(36).substr(2, length);

export default uuid;
