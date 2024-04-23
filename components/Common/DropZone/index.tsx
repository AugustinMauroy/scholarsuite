'use client';
import { useRef } from 'react';
import styles from './index.module.css';
import type { FC, DragEvent } from 'react';

type DropZoneProps = {
  title: string;
  file: File | null;
  setFile: (file: File) => void;
};

const DropZone: FC<DropZoneProps> = ({ file, setFile, title }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
  };

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileInputChange = () => {
    const file = hiddenFileInput.current?.files?.[0];
    if (file) setFile(file);
  };

  return (
    <>
      <div
        onDragOver={event => event.preventDefault()}
        onDrop={handleDrop}
        onClick={handleClick}
        className={styles.dropZone}
      >
        <strong>{title}</strong>
        {file && <p>{file.name}</p>}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={hiddenFileInput}
        onChange={handleFileInputChange}
        className={styles.hiddenInput}
      />
    </>
  );
};

export default DropZone;
