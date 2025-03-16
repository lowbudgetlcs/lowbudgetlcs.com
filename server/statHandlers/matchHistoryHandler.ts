import { getSeriesData } from "../db/queries/select";

export const matchHistoryHandler = async (seriesID: number) => {
  try {
    const response = await getSeriesData(seriesID);
    return response;
  } catch (err) {
    console.error(err);
  }
};
