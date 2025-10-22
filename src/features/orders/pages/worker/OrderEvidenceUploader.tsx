// components/OrderEvidenceUploader.tsx
import React, { useCallback } from "react";
import { Upload, App, Typography } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { InboxOutlined } from "@ant-design/icons";
import { uploadOrderMaterial } from "../../../../shared/modules/worker";
import toast from "react-hot-toast";

const { Dragger } = Upload;
const { Paragraph, Text } = Typography;

type Props = {
    orderId: string;
    onUploaded?: (fileId?: string) => Promise<void> | void;
  };

const ACCEPT_MIME =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"; // jpg/png/webp/gif + mp4/webm/mov/avi/mkv

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export default function OrderEvidenceUploader({ orderId, onUploaded }: Props) {
  const { message } = App.useApp();

  /** Ограничения до начала загрузки */
  const beforeUpload: UploadProps["beforeUpload"] = useCallback((file:any) => {
    // размер
    if (file.size > MAX_BYTES) {
      message.error("Файл превышает 100 МБ");
      return Upload.LIST_IGNORE;
    }
    // тип
    const ok =
      ACCEPT_MIME.split(",").some((mt) => file.type === mt) ||
      // иногда браузер даёт пустой type — проверим по расширению
      /\.(jpe?g|png|webp|gif|mp4|webm|mov|avi|mkv)$/i.test(file.name);
    if (!ok) {
      message.error("Разрешены только фото и видео");
      return Upload.LIST_IGNORE;
    }
    return true;
  }, [message]);

  /** Кастомная отправка: сразу бьём на API */
  const customRequest: UploadProps["customRequest"] = useCallback(
    async (options: any) => {
      const { file, onProgress, onSuccess, onError } = options;
      try {
        const f = file as File;
  
        const resp = await uploadOrderMaterial(
          orderId,
          f,
          (pct) => onProgress?.({ percent: pct })
        );
  
        // подстрой под свой бэкенд: где приходит идентификатор файла
        const fileId =
          (resp as any)?.data?.fileId ||
          (resp as any)?.fileId ||
          (resp as any)?.data?.id ||
          undefined;
  
        onSuccess?.(resp, new XMLHttpRequest());
        toast.success("Файл загружен");
  
        // важна синхронизация: дождёмся обновления родителя
        await onUploaded?.(fileId);
      } catch (err) {
        console.error(err);
        toast.error("Не удалось загрузить файл");
        onError?.(err as any);
      }
    },
    [orderId, onUploaded, message]
  );

  const itemRender: UploadProps["itemRender"] = (_, file, files, actions) => {
    // дефолтный рендер пригоден; оставим кнопки remove/preview
    return UploadListItemDefault(_, file, files, actions);
  };

  return (
<div className="evi-uploader-mini">
  <Dragger
    multiple
    accept={ACCEPT_MIME}
    showUploadList={false}
    listType="picture-card"
    beforeUpload={beforeUpload}
    customRequest={customRequest}
    itemRender={itemRender}
  >
    <div className="drop-inner">
      <InboxOutlined className="icon" />
      <div className="text">Загрузите фото/видео</div>
      <div className="hint">jpg/png/webp/mp4</div>
    </div>
  </Dragger>

  <style>{`
    .evi-uploader-mini .ant-upload.ant-upload-drag {
      padding: 4px;
      border-radius: 8px;
      border: 1px dashed #d7dde5;
      background: #fafbfc;
      transition: all 0.2s ease;
    }
    .evi-uploader-mini .ant-upload.ant-upload-drag:hover {
      border-color: #9db5ff;
      background: #f8faff;
      box-shadow: 0 2px 8px rgba(47,107,255,.08);
    }

    .evi-uploader-mini .drop-inner {
      height: 58px;
      display: grid;
      place-items: center;
      text-align: center;
      gap: 2px;
    }

    .evi-uploader-mini .drop-inner .icon {
      font-size: 25px;
      color: #2f6bff;
      opacity: 0.9;
    }
    .evi-uploader-mini .drop-inner .text {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      line-height: 1;
    }
    .evi-uploader-mini .drop-inner .hint {
      font-size:11px;
      color: #6b7280;
      line-height: 1;
    }

    /* карточки превью */
    .evi-uploader-mini .ant-upload-list-picture-card-container {
      width: 68px;
      height: 68px;
      margin: 3px;
    }
    .evi-uploader-mini .ant-upload-list-picture-card .ant-upload-list-item {
      border-radius: 7px;
      box-shadow: 0 1px 3px rgba(0,0,0,.05);
    }
    .evi-uploader-mini .ant-upload-list-picture-card .ant-upload-list-item-thumbnail {
      border-radius: 6px;
    }

    /* ограничение по высоте списка */
    .evi-uploader-mini .ant-upload-list {
      max-height: 120px;
      overflow: auto;
      padding: 2px;
    }

    /* иконка добавления (+) */
    .evi-uploader-mini .ant-upload-select-picture-card {
      width: 68px;
      height: 68px;
      margin: 3px;
      border-radius: 7px;
      color: #64748b;
      font-size: 14px;
    }
    .evi-uploader-mini .ant-upload-select-picture-card:hover {
      border-color: #2f6bff;
      color: #2f6bff;
    }
  `}</style>
</div>

  
  );
}

/** Вспомогательный дефолтный рендер айтема (скопировано из antd типов) */
function UploadListItemDefault(
  originNode: React.ReactElement,
  _file: UploadFile,
  _fileList: UploadFile[],
  _actions: { download: () => void; preview: () => void; remove: () => void }
) {
  return originNode;
}
