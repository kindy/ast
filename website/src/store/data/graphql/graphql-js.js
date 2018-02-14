export const config = {};

export const defaultInput = `
# Paste or drop some GraphQL queries or schema
# definitions here and explore the syntax tree
# created by the GraphQL parser.

query GetUser($userId: ID!) {
  user(id: $userId) {
    id,
    name,
    isViewerFriend,
    profilePicture(size: 50)  {
      ...PictureFragment
    }
  }
}

fragment PictureFragment on Picture {
  uri,
  width,
  height
}
`.trim();

export function depends({context: {load}, config}) {
  return load.packd([
    'graphql/language/index.js',
  ]).then(([{parse}]) => ({parse}));
}

export default function run({input, config, depends: {parse}}) {
  const ast = parse(input, {noSource: true});

  return {
    ast,
  };
};
