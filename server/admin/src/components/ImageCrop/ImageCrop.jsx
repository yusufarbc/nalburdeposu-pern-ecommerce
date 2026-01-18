import React, { useState, useCallback } from 'react'
import { Box, Button, FormGroup, Label, Text, DropZone, BasePropertyProps } from '@adminjs/design-system'
import Cropper from 'react-easy-crop'
import styled from 'styled-components'
import getCroppedImg from './utils'

// Styled Components for the Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  height: 90vh;
  max-width: 800px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  position: relative;
`

const CropperContainer = styled.div`
  position: relative;
  flex: 1;
  background: #333;
  min-height: 400px;
`

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`

const ImageCrop = (props) => {
    const { property, onChange, record } = props

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(record?.params?.[property.name] || null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState(null)

    const onDrop = (files) => {
        if (files.length > 0) {
            const selectedFile = files[0]
            const objectUrl = URL.createObjectURL(selectedFile)
            setImageSrc(objectUrl)
            setIsModalOpen(true)
        }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        try {
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                0,
                { horizontal: false, vertical: false },
                { width: 1000, height: 1000 } // Force 1000x1000
            )

            // Create a File object from the Blob
            const fileName = `image-${Date.now()}.webp`
            const croppedFile = new File([croppedBlob], fileName, { type: 'image/webp' })

            // Pass the file to AdminJS
            onChange(property.name, croppedFile)

            // Update local preview
            setPreview(URL.createObjectURL(croppedBlob))

            // Close modal
            setIsModalOpen(false)
            setImageSrc(null)
        } catch (e) {
            console.error(e)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setImageSrc(null)
    }

    return (
        <Box marginY="lg">
            <FormGroup>
                <Label>{property.label}</Label>

                {/* Current Image Preview */}
                {preview && (
                    <Box marginBottom="lg">
                        <img
                            src={preview}
                            alt="Current"
                            style={{ width: '150px', height: '150px', objectFit: 'contain', border: '1px solid #ddd' }}
                        />
                    </Box>
                )}

                {/* DropZone */}
                <DropZone onChange={onDrop} multiple={false} />

                {/* Cropping Modal */}
                {isModalOpen && (
                    <ModalOverlay>
                        <ModalContent>
                            <Text as="h3" marginBottom="lg">Görseli Düzenle (1:1 Kare)</Text>

                            <CropperContainer>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1 / 1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </CropperContainer>

                            <Controls>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleCancel()
                                    }}
                                    variant="text"
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleSave(e)
                                    }}
                                    variant="primary"
                                >
                                    Kaydet ve Kırp (PRO)
                                </Button>
                            </Controls>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </FormGroup>
        </Box>
    )
}

export default ImageCrop
