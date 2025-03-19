import { getMatch } from "../db/queries/select";

const matchHandler = (shortcode: string) => {
  const rawMatchData = getMatch(shortcode);

  return rawMatchData;
};

export default matchHandler;
