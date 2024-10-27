import { DataTransferServiceClient } from "@google-cloud/bigquery-data-transfer";
import type { Request, Response } from "express";

const client = new DataTransferServiceClient();

exports.checkBigQueryDataTransferStatus = async (
  req: Request,
  res: Response
) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  if (!req.body.run_name) {
    res
      .status(500)
      .send(
        `Failed to check bigquery data transfer status: not found run_name`
      );
    console.error(
      `Failed to check bigquery data transfer status: not found run_name`
    );
    return;
  }

  const runName: string = req.body.run_name;

  try {
    const [transferRun] = await client.getTransferRun({ name: runName });
    if (transferRun.errorStatus && transferRun.errorStatus.message) {
      throw new Error(
        `transfer failed message: ${transferRun.errorStatus.message}`
      );
    }

    res.status(200).send(transferRun.state);
    console.log(`check bigquery data transfer status: ${transferRun.state}`);
  } catch (error) {
    res.status(500).send(`Failed to check transfer run status: ${error}`);
    console.error(`Failed to check bigquery data transfer status:`, error);
  }
};
