// React component for upload file button

import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";

const jsonSchema = z.object({
  columns: z.array(
    z.object({
      field: z.string(),
      key: z.string(),
      meta: z.object({
        supplier_id: z.number(),
      }),
      totals: z.array(z.number().nullable()).length(3),
      type: z.string(),
    })
  ),
  rows: z.array(
    z.object({
      field: z.string(),
      key: z.string(),
      meta: z.object({ is_total: z.boolean() }),
      totals: z.array(z.number()).length(3),
      values: z.array(z.array(z.number().nullable()).length(3)),
    })
  ),
});

export type JsonData = z.infer<typeof jsonSchema>;

interface UploadFileButtonProps {
  setJsonData: (jsonData: JsonData) => void;
}

export const UploadJsonFileButton: React.FC<UploadFileButtonProps> = ({
  setJsonData,
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files) return;
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (!e?.target?.result) {
        alert("Invalid file");
        return;
      }

      const result = e.target.result as string;
      const base64JsonData = result.split(",")[1];

      if (!base64JsonData) {
        // next alert
        alert("Invalid file");
        return;
      }

      const jsonData = JSON.parse(
        Buffer.from(base64JsonData, "base64").toString("utf-8")
      );
      const parsedJson = jsonSchema.parse(jsonData);
      console.log("parsedJson", parsedJson);
      setJsonData(parsedJson);
    };
  }, [file]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
