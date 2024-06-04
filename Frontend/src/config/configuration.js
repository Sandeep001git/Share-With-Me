import {
  ApiError,
  encryption,
  ApiResponse,
  decryption,
} from "../util/index.js";
import { peer } from "../peer/peer.js";

const fileSharing = async (file) => {
  try {
    if (!file) {
      throw new ApiError(400, "No file provided");
    }

    const encryptionAndDecryptionPassword =
      // eslint-disable-next-line no-undef
      process.env.ENCRYPTION_AND_DECRYPTION_PASSWARD;

    if (!encryptionAndDecryptionPassword) {
      throw new ApiError(500, "Encryption password not found");
    }
    const conn = peer.connectionstatechange;
    if (!conn) {
      throw new ApiError(500, "Sender is not connected");
    }

    const encryptedFile = encryption(file, encryptionAndDecryptionPassword);
    peer.send(encryptedFile);
    return new ApiResponse(200, "File sent successfully");
  } catch (error) {
    throw new ApiError(500, "Error sending file", error);
  }
};

const reciverDataStoreage = () => {
  const encryptionAndDecryptionPassward =
    // eslint-disable-next-line no-undef
    process.env.ENCRYPTION_AND_DECRYPTION_PASSWARD;
  let receivedChunks = [];
  let totalSize = 0;
  const conn = peer.connectionstatechange;

  if (!conn) {
    throw new ApiError("400", "user and sender is not connected");
  }

  peer.on("data", (data) => {
    if (data.type === "file") {
      totalSize = data.size;
    } else {
      receivedChunks.push(data);

      let receivedSize = receivedChunks.reduce(
        (acc, chunk) => acc + chunk.length,
        0
      );
      const file = decryption(receivedChunks, encryptionAndDecryptionPassward);
      if (receivedSize === totalSize) {
        const fileData = new Blob(file, {
          type: "application/octet-stream",
        });
        const fileURL = URL.createObjectURL(fileData);

        const a = document.createElement("a");
        a.href = fileURL;
        a.download = data.name;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(fileURL);

        receivedChunks = [];
      }
    }
  });
};

const closeConnection = () => {
  peer.close();
};

export { fileSharing, closeConnection, reciverDataStoreage };
