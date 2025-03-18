import { getSeriesData } from "../db/queries/select";

export const matchHistoryHandler = async (seriesID: number) => {
  try {
    const seriesData = await getSeriesData(seriesID);
    if (!seriesData) {
      throw new Error("Series not found");
    }

    return seriesData;
  } catch (err) {
    console.error(err);
  }
};
