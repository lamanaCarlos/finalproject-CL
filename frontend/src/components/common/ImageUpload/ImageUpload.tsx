import { useState, useRef } from 'react';
import { Button } from '../Button';
import { Loader } from '../Loader';
import { Image } from '../Image';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import apiClient from '../../../services/api/client';
import { useLanguage } from '../../../context/LanguageContext';
import type { AxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
};

export interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  disabled?: boolean;
}

export const ImageUpload = ({
  value = [],
  onChange,
  multiple = true,
  maxImages = 10,
  disabled = false,
}: ImageUploadProps) => {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - value.length;

    if (filesArray.length > remainingSlots) {
      toast.error(
        `${t('upload.maxImagesReached') || 'Solo puedes subir'} ${remainingSlots} ${t('upload.images') || 'imagen(es) más'}`
      );
      return;
    }

    // Subir cada archivo
    for (const file of filesArray) {
      await uploadFile(file);
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error(t('upload.invalidFileType') || 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t('upload.fileTooLarge') || 'El archivo es demasiado grande. Tamaño máximo: 5MB');
      return;
    }

    setUploading(file.name);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.data?.url) {
        const newUrl = response.data.data.url;
        if (multiple) {
          onChange([...value, newUrl]);
        } else {
          onChange([newUrl]);
        }
        toast.success(t('upload.success') || 'Imagen subida exitosamente');
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError?.response?.data?.message || 'Error al subir la imagen';
      toast.error(errorMessage);
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Preview de imágenes */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  aspectRatio="square"
                  objectFit="cover"
                  className="w-full"
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Eliminar imagen"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botón de subida */}
      {canAddMore && !disabled && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload-input"
            disabled={uploading !== null}
          />
          <label htmlFor="image-upload-input">
            <Button
              type="button"
              variant="outline"
              leftIcon={uploading ? <Loader size="sm" /> : <FiUpload className="w-4 h-4" />}
              disabled={uploading !== null || disabled}
              className="w-full"
            >
              {uploading
                ? `${t('upload.uploading') || 'Subiendo'} ${uploading}...`
                : multiple
                ? `${t('upload.uploadMultiple') || 'Subir Imágenes'} (${value.length}/${maxImages})`
                : value.length === 0
                ? (t('upload.uploadImage') || 'Subir Imagen')
                : (t('upload.replaceImage') || 'Reemplazar Imagen')}
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {t('upload.helpText') || 'Formatos permitidos: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB por imagen.'}
          </p>
        </div>
      )}

      {!canAddMore && (
        <div className="text-sm text-gray-500 text-center py-2">
          {`${t('upload.maxLimitReached') || 'Has alcanzado el límite de'} ${maxImages} ${t('upload.images') || 'imagen(es)'}`}
        </div>
      )}
    </div>
  );
};
