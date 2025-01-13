export const uploadFileToGridFS = async (applicationId, file, bucket) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('Invalid file or missing buffer');
    }

    if (!bucket) {
      throw new Error('GridFS bucket is not initialized');
    }

    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer);

    const fileRecord = {
      filename: file.originalname,
      fileId: uploadStream.id,
      applicationId: applicationId,
    };

    return fileRecord;
  } catch (error) {
    console.error('Error uploading file to GridFS:', error);
    throw error;
  }
};

export const getFileFromGridFS = async (fileId, gfs) => {
  return new Promise((resolve, reject) => {
    const downloadStream = gfs.openDownloadStream(fileId);
    const chunks = [];

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    downloadStream.on('error', (err) => {
      reject(err);
    });
  });
};

export const getFile = async (fileId, bucket) => {
  try {
    if (!bucket) {
      throw new Error('GridFS bucket is not initialized');
    }

    const fileRecord = await bucket.find({ _id: fileId }).toArray();
    return {
      id: fileRecord[0]._id,
      metadata: fileRecord[0]
    };
  } catch (error) {
    console.error('Error getting file record from GridFS:', error);
    throw error;
  }
};
