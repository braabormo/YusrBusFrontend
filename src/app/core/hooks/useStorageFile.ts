import { useRef } from "react";
import { StorageFile, StorageFileStatus } from "../data/storageFile";

export default function useStorageFile<T>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  fieldName: keyof T
)
{
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 1. Validate File Size (2MB = 2 * 1024 * 1024 bytes)
        const maxSizeInBytes = 2 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            alert("حجم الملف كبير جداً. الحد الأقصى هو 2 ميجابايت.");
            if (fileInputRef.current) 
                fileInputRef.current.value = "";
            return;
        }

        // 2. Validate File Type (JPG, PNG, GIF)
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("نوع الملف غير مدعوم. يرجى اختيار JPG أو PNG أو GIF.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(",")[1];

            setFormData((prev) => ({
            ...prev,
            [fieldName]: new StorageFile({
                url: base64String, 
                base64File: base64Data, 
                extension: `.${file.name.split(".").pop()}`,
                contentType: file.type,
                status: StorageFileStatus.New, 
            }),
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setFormData((prev) => {
        const currentFile = prev[fieldName] as any;
        return {
            ...prev,
            [fieldName]: currentFile?.status === StorageFileStatus.New 
            ? undefined 
            : { ...currentFile, status: StorageFileStatus.Delete },
        };
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDownload = async (e: React.MouseEvent, imageSrc: string, contentType : string) => {
        e.stopPropagation();
        if (!imageSrc) return;

        try {
        // 1. Fetch the image data
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        
        // 2. Create a local URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // 3. Create the temporary link
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `img.${
            contentType?.split("/")[1] || "png"
        }`;
        
        document.body.appendChild(link);
        link.click();
        
        // 4. Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
        console.error("Download failed:", error);
        // Fallback: If fetch fails (CORS issue), try opening in a new tab instead of the current one
        window.open(imageSrc, "_blank");
        }
    };

  return {fileInputRef, handleFileChange, handleRemoveFile, handleDownload};

}