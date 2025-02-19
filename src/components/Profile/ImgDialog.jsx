import { Button, Dialog, IconButton, Slider, Typography } from '@mui/material';
import { CameraAltOutlined, CheckSharp, Clear, ClearOutlined, Publish } from '@mui/icons-material';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import { editLiteUser, editUser } from '../../Redux/Actions/user-info';
import { getCroppedImg } from './canvasUtils';
import Resizer from 'react-image-file-resizer';
import { useStyles } from './styles';
import captureImg from '../../assets/icons/capture-icon.jpeg';
import Webcam from 'react-webcam';
import './profile.css';

export default function ImgDialog({
  open,
  handleClose,
  image,
  profileData,
  forEdit,
  showImg,
  forLiteUI,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [showPreviewBtn, setShowPreviewBtn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [newImage, setNewImage] = useState(image);
  const [openCamera, setOpenCamera] = useState(false);
  // TODO FIXME fileName is never used
  // eslint-disable-next-line no-unused-vars
  const [fileName, setFileName] = useState('');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImg = await getCroppedImg(
        newImage ? newImage : image,
        croppedAreaPixels,
        rotation,
      );
      await fetch(croppedImg).then((r) => {
        r.blob().then((blob) => {
          const contentType = r.headers.get('content-type');
          let type = blob.type.split('/');
          let fileName =
            (forEdit || forLiteUI ? profileData.name : 'new_user') + Date.now() + '.' + type[1];
          blob['name'] = fileName;
          const newFile = new File([blob], fileName, { contentType });
          setFile(newFile);
          dispatch(show(true));
          const formData = new FormData();
          formData.append('avatar', newFile);
          if (forEdit) {
            showImg({ img: croppedImage, file: file });
            dispatch(editUser({ id: profileData?.id, data: formData, onlyStaff: true }));
          }
          if (!forEdit) {
            showImg({ img: croppedImage, file: file });
            dispatch(show(false));
          }
          if (forLiteUI) {
            dispatch(editLiteUser({ data: formData, card_id: profileData?.card }));
          }
          if (!loader.show) {
            handleClear(true);
          }
        });
      });
      setCroppedImage(croppedImg);
    } catch (_e) {
      // TODO handle error
    }
  };

  const handleImage = useCallback(async (e) => {
    const file = e.target.files[0];
    setFileName(file?.name);
    setShowPreviewBtn(true);
    let resizedImg = await resizeFile(file);
    setNewImage(resizedImg);
  }, []);

  const handleClear = useCallback(
    (close) => {
      setCroppedImage(null);
      setNewImage(image);
      setRotation(0);
      setZoom(1);
      setShowPreviewBtn(false);
      if (close) handleClose();
    },
    [croppedImage, newImage, zoom, rotation, showPreviewBtn],
  );
  const loader = useSelector((state) => state.showLoader);
  const webcamRef = React.useRef(null);
  const handleCapture = React.useCallback(() => {
    const capturedImg = webcamRef.current.getScreenshot();
    if (capturedImg) {
      setNewImage(capturedImg);
      setOpenCamera(false);
      setShowPreviewBtn(true);
    }
  }, [webcamRef]);

  React.useEffect(() => {
    setNewImage(image);
  }, [image]);

  React.useEffect(() => {}, [file]);

  const startCamera = () => {
    setOpenCamera(!openCamera);
  };

  const videoConstraints = {
    width: 300,
    height: 400,
    facingMode: 'user',
  };
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth="sm"
    >
      <div>
        <IconButton
          style={{ float: 'right' }}
          onClick={() => handleClear(true)}
        >
          <Clear style={{ fontSize: 30, color: '#999' }} />
        </IconButton>
      </div>
      <div className={classes.cropContainer}>
        {openCamera ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              videoConstraints={videoConstraints}
            />
          </div>
        ) : (
          <Cropper
            image={newImage && newImage}
            crop={crop}
            zoom={zoom}
            cropShape={'round'}
            cropSize={{ width: 250, height: 250 }}
            aspect={7 / 7}
            showGrid={false}
            rotation={rotation}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={(e) => setZoom(e)}
          />
        )}
      </div>
      <div>
        <div className={classes.controls}>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              classes={{ root: classes.slider }}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
          <div className={classes.sliderContainer}>
            <Typography
              variant="overline"
              classes={{ root: classes.sliderLabel }}
            >
              Rotate
            </Typography>
            <Slider
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              classes={{ root: classes.slider }}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </div>
        </div>
        {openCamera ? (
          <div style={{ display: 'flex', padding: 5, justifyContent: 'center' }}>
            <IconButton onClick={handleCapture}>
              <img
                src={captureImg}
                style={{ height: 50, width: 50 }}
              />
            </IconButton>
            <IconButton onClick={startCamera}>
              <ClearOutlined style={{ fontSize: 50, color: '#627daf' }} />
            </IconButton>
          </div>
        ) : (
          <div>
            {showPreviewBtn || zoom > 1 || rotation > 1 ? (
              // <Button
              //     style={{
              //         borderRadius:20,
              //         padding:'5px 10px',
              //         height:'auto',
              //         color:'#ffffff',
              //         backgroundColor: '#627daf',
              //         textTransform:'none'
              //     }}
              //     onClick={showCroppedImage}
              //     startIcon={<SaveAltOutlined/>}
              // >
              //     Save
              // </Button>
              <div className="d-flex justify-space-between p-2">
                <IconButton
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#627daf',
                    fontSize: 16,
                  }}
                  onClick={() => handleClear(false)}
                >
                  <Clear />
                </IconButton>
                <IconButton
                  onClick={showCroppedImage}
                  style={{
                    backgroundColor: '#627daf',
                    color: '#ffffff',
                    fontSize: 16,
                  }}
                >
                  <CheckSharp />
                </IconButton>
              </div>
            ) : (
              <div className="d-flex justify-space-between p-2">
                <input
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: 'none' }}
                  id="pick-image"
                  type="file"
                />
                <label
                  htmlFor="pick-image"
                  className="upload-btn"
                >
                  <Publish />
                  Upload
                </label>
                <Button
                  style={{
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                    backgroundColor: '#627daf',
                    textTransform: 'none',
                  }}
                  onClick={startCamera}
                  startIcon={<CameraAltOutlined />}
                >
                  Take Picture
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* {croppedImage && 
                <div 
                    className='d-flex-column'
                    style={{backgroundColor:'rgba(0,0,0,0.4)', padding:15}}
                >
                    <div className='d-flex-justify'>
                        <Avatar
                        style={{
                            height: 205,
                            width: 205
                        }}
                        src={croppedImage}
                        />
                    </div>
                </div>
            } */}
    </Dialog>
  );

  function resizeFile(file) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'base64',
      );
    });
  }
}
