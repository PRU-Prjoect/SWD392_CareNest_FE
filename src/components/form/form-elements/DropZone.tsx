import React, { useState } from "react";
import ComponentCard from "@/components/ui/Card";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

const DropZone: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="inline-flex rounded-md border border-gray-200 mb-2 mr-2 w-24 h-24 p-1"
    >
      <div className="flex min-w-0 overflow-hidden">
        <img
          src={file.preview}
          className="block w-auto h-full"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt="Preview"
        />
      </div>
    </div>
  ));

  React.useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <ComponentCard title="Drop Zone" desc="Drag and drop file upload">
      <div>
        <div
          {...getRootProps({
            className:
              "dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400",
          })}
        >
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside className="flex flex-wrap mt-4">{thumbs}</aside>
      </div>
    </ComponentCard>
  );
};

export default DropZone;
