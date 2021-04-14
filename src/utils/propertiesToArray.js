// Taken and modified from https://stackoverflow.com/a/53620876
export default function propertiesToArray(obj) {
  const isObject = val => typeof val === "object";

  const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);

  const paths = (obj = {}, head = "", visited_paths = []) => {
    for (let i in obj) {
      if (Array.isArray(obj)) {
        visited_paths.push(addDelimiter(head, obj[i]));
      } else {
        visited_paths.push(addDelimiter(head, i));
      }

      if (isObject(obj[i])) {
        paths(obj[i], addDelimiter(head, i), visited_paths);
      }
    }
    return visited_paths;
  };

  return paths(obj);
}
