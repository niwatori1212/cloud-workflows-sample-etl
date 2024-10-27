import {
  StorageTransferServiceClient,
  protos,
} from "@google-cloud/storage-transfer";
import type { Request, Response } from "express";
const { TransferOperation } = protos.google.storagetransfer.v1;

const client = new StorageTransferServiceClient();

exports.runStorageTransfer = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const { transfer_job_name, project_id } = req.body;

  const runRequest = {
    jobName: transfer_job_name,
    projectId: project_id,
  };

  try {
    const [operation] = await client.runTransferJob(runRequest);
    const [_, transferOperation] = await operation.promise();

    if (transferOperation.status != TransferOperation.Status.SUCCESS) {
      throw new Error(
        `transfer operation failed with status: ${transferOperation.status}`
      );
    }

    res.status(200).send("0K");
    console.log("run storage transfer:", "OK");
  } catch (error) {
    res.status(500).send(`Failed to run storage transfer: ${error}`);
    console.error("Failed to run storage transfer:", error);
  }
};
