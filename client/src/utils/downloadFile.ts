const downloadFile = (
  fileData: BlobPart,
  fileName: string,
  fileType: string
) => {
  const blob = new Blob([fileData], { type: fileType });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export default downloadFile;
