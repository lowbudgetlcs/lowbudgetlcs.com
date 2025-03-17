import { getSeriesData } from "../db/queries/select";

export const matchHistoryHandler = async (seriesID: number) => {
  try {
    const seriesResponse = await getSeriesData(seriesID);
    if (!seriesResponse) {
      throw new Error("Series not found");
    }
    return seriesResponse;
  } catch (err) {
    console.error(err);
  }
};
