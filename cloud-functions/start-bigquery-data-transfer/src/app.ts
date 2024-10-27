import { DataTransferServiceClient } from "@google-cloud/bigquery-data-transfer";
import type { Request, Response } from "express";

const client = new DataTransferServiceClient();

const getTransferConfigId = async (
  project_number: string,
  transferDisplayName: string
) => {
  const [transferConfigs] = await client.listTransferConfigs({
    parent: `projects/${project_number}/locations/asia-northeast1`,
  });

  return transferConfigs.find(
    (config) => config.displayName === transferDisplayName
  )?.name;
};

exports.startBigQueryDataTransfer = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const { jst_date, project_number, transfer_display_name } = req.body;
  const TransferConfigId = await getTransferConfigId(
    project_number,
    transfer_display_name
  );

  const requestedRunTime = new Date(`${jst_date}T00:00:00Z`);

  try {
    const [response] = await client.startManualTransferRuns({
      parent: TransferConfigId!,
      requestedRunTime: {
        seconds: Math.floor(requestedRunTime.getTime() / 1000),
      },
    });

    const runName = response.runs?.[0]?.name;

    if (!runName) {
      throw new Error("No run name found in the response");
    }

    res.status(200).send(runName);
    console.log(`started bigquery. data transfer:`, runName);
  } catch (error) {
    res.status(500).send(`Failed to start bigquery data transfer: ${error}`);
    console.error(`Failed to start bigquery data transfer:`, error);
  }
};
