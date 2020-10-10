const detectBoundary = ({ body, debug = false }) => {
  try {
    const regex = /(^|\n)(?<boundary>[^\r\n]+)\r?\n\W*Content-Disposition:/g;
    const matches = Array.from(body.matchAll(regex));
    const boundaries = matches.map((m) => m.groups.boundary);
    if (debug) console.log("boundaries:", boundaries);
    const set_of_boundaries = new Set(boundaries);
    if (set_of_boundaries.size === 1) {
      return Array.from(set_of_boundaries)[0].trim();
    } else if (set_of_boundaries.size > 1) {
      if (debug) console.log("couldn't decide between", set_of_boundaries);
      return null;
    } else {
      return null;
    }
  } catch (error) {
    if (debug)
      console.log("failed to detect content boundary because of", error);
    return null;
  }
};

module.exports = ({ body, debug = false }) => {
  if (debug) {
    console.log("starting multifarious with body");
    console.log(body);
    console.log([body]);
  }

  // detect content boundary
  const boundary = detectBoundary({ body, debug });
  if (debug) console.log("boundary:", [boundary]);

  // to-do: handle filenames with quotes in them
  // https://stackoverflow.com/questions/6830950/regex-for-filename-with-quotes-in-multipart
  // /filename="([^"\\]*(?:\\.[^"\\]*)*)"/i

  const contentDisposition = `(Content-Disposition: form-data(; name="(?<name>[^"]+)")?(; filename="(?<filename>[^"]+)")? ?)?`;
  const contentType = `(Content-Type: ?(?<contentType>[^\r\n]+))?`;

  const line_break = "(?:\r?\n)";

  const pattern = `(?<=${boundary} ?${line_break})${contentDisposition}${line_break}{0,2}${contentType}${line_break}{0,2}(?<content>[\\s\\S]+?)(?= ?${line_break}${boundary})`;

  const matches = Array.from(body.matchAll(new RegExp(pattern, "gm")));

  const files = [];
  for (const match of matches) {
    const info = {};
    const { groups } = match;
    for (let name in groups) {
      const value = groups[name];
      if (value !== undefined) {
        info[name] = value;
      }
    }
    files.push(info);
  }

  if (debug) console.log("files:", files);
  if (debug) console.log("finishing multifarious");

  return files;
};
