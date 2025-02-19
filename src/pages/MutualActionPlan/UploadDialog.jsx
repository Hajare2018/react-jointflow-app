import React, { useState } from 'react';
import { Tooltip } from '@material-tailwind/react';
import { Button } from '../../component-lib/catalyst/button';
import {
  CloudArrowUpIcon,
  DocumentArrowUpIcon,
  PaperClipIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { useMutation } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import SpinnerIcon from '../../component-lib/icons/Spinner';

const UploadDialog = ({ boardId, taskId, onUploadSuccess }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const onClose = () => {
    setOpen(false);
    setFiles([]);
  };

  const uploadFileMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();

      formData.append('file', file);
      formData.append('board', boardId);
      formData.append('card', taskId);
      formData.append('name', file.name.split('.').slice(0, -1).join('.'));

      await HttpClient.postDocument({
        data: formData,
      });
    },
    onSuccess: () => {
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      onClose();
    },
  });

  return (
    <div>
      <Tooltip content="Attach file">
        <a
          onClick={() => setOpen(true)}
          className="text-slate-900 cursor-pointer"
        >
          <PaperClipIcon className="w-5 h-5" />
        </a>
      </Tooltip>
      <Dialog
        open={open}
        onClose={setOpen}
      >
        <DialogTitle>Upload a file</DialogTitle>
        <DialogBody>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-8 h-8 mb-4" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to select</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pick a file up to 6MB.</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(event) => {
                  setFiles(event.target.files);
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-y-4 mt-4">
            {Array.from(files).map((file) => {
              return (
                <div
                  key={file.name}
                  className="p-3 bg-white border border-solid border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-3">
                      <DocumentArrowUpIcon className="w-8 h-8" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          <span
                            className="truncate inline-block max-w-[300px] align-bottom"
                            data-hs-file-upload-file-name=""
                          >
                            {file.name}
                          </span>
                        </p>
                        <p
                          className="text-xs text-gray-500 dark:text-neutral-500"
                          data-hs-file-upload-file-size=""
                        >
                          {file.size}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-x-2">
                      <Button plain>
                        <TrashIcon className="w-8 h-8" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={onClose}
            disabled={uploadFileMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="rose"
            onClick={() => {
              uploadFileMutation.mutate(files[0]);
            }}
            disabled={files.length === 0 || uploadFileMutation.isPending}
          >
            {uploadFileMutation.isPending && <SpinnerIcon className="animate-spin w-5 h-5" />}
            {uploadFileMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDialog;
