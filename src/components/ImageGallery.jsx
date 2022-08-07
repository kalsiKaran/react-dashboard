import React, { useEffect, useState, useRef } from 'react';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { db, storage } from '../data/firebase';
import { ref, deleteObject, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { deleteDoc, updateDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../contexts/ContextProvider';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { Editor } from 'primereact/editor';
import { Skeleton } from 'primereact/skeleton';

function ImageGallery() {

  const [dialogVisible, setDialogVisible] = useState(false)
  const [images, setImages] = useState([])
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState({});
  const [status, setStatus] = useState('new');
  const [description, setDescription] = useState('');
  const [infoDialog, setInfoDialog] = useState(false);
  const [infoText, setInfoText] = useState("")
  const usercollection = collection(db, "images")


  // upload image file 
  useEffect(() => {
    const uploadFile = () => {
      setImages(images)
      const name = new Date().getTime() + file.name;

      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          setPerc(progress);
          console.log(snapshot.state);
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImages(downloadURL);
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // add image row 
  const addRow = async (e) => {
    setDialogVisible(false)
    if(images.length){
    try {
      await setDoc(doc(usercollection), {
        description: description,
        image: images,
        timeStamp: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  }
    setImages([]);
    setDescription('');
    setPerc(null);
  }

  // on edit click 
  const onEditClick = (data) => {
    setEditData(data)
    setDialogVisible(true);
    setStatus('edit');
    setImages(data.image)
    setDescription(data.description)
  }
  // function for updating rowdata 
  const editImageRow = async()=>{
    setDialogVisible(false)
    const userDoc = doc(db, "images", editData.id);
    const updateRowData = {
      description: description,
      image: images,
      timeStamp: serverTimestamp(),
    };
    await updateDoc(userDoc, updateRowData);
  }

  // delete image in datatable 
  const deleteImageRow = async(e)=>{
    const userDoc = doc(db, "images", e.id);
    await deleteDoc(userDoc);

    const imageRef = ref(storage, e.image);
    // Delete the file
      deleteObject(imageRef).then(() => {
        // File deleted successfully
      }).catch((error) => {
        console.error(error);
      });
}

const onDialogClose = () => {
  setDialogVisible(false);
  setImages([]);
  setDescription();
  setPerc(null);
  setStatus('new');
}


  useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      usercollection,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, image: doc.data().image, description: doc.data().description
             });
        });
        setData(list);
      },
      (error) => {
        // console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const getInfo = desc => {
    setInfoDialog(true);
    setInfoText(desc);
  }

  const renderFooter = () => {
    return <div>
      <button onClick={status==='edit' ? () => editImageRow() : () => addRow()} disabled={(per < 100) && status==='new' ? true : false} className='btn btn-primary bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:bg-blue-500'>{status==='edit' ? 'Update' : 'Upload'}</button>
      <button onClick={() => onDialogClose()} className='btn btn-primary bg-rose-700 hover:bg-red-800 transition-all'>Cancel</button>
    </div>
  }

  return (
    <div className='primary-box w-full text-dark dark:text-white h-[100vh] sm:h-auto'>
        <div className="items-center justify-between md:flex">
          <h1 className='font-medium text-xl mb-5'>Image Gallery</h1>
          <button onClick={() => setDialogVisible(true)} className='hidden md:inline-block btn btn-primary bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:bg-blue-500'><i className="fas fa-upload"></i> upload</button>
        </div>
        {/* for mobile view  */}
        <button className='md:hidden btn-primary add-btn bg-blue-500 bottom-6 hover:bg-blue-600 transition-all' onClick={() => setDialogVisible(true)}><i className="fas fa-upload"></i></button>

        <Dialog header="upload image"
            visible={dialogVisible}
            draggable={false}
            footer={renderFooter('displayBasic')} 
            onHide={() => setDialogVisible(false)}
            dismissableMask={true} 
            >
              <div className='h-full w-full relative border border-neutral-500 rounded overflow-hidden block sm:flex sm:items-center mb-4'>
                <div className="absolute left-0 top-0 z-20 w-full">
                  <ProgressBar value={per} style={{ height: '4px', borderRadius: 0 }} color='slate-90'></ProgressBar>
                </div>
              <label className="h-60 w-full sm:w-1/2 flex justify-center items-center flex-col cursor-pointer px-4 py-3 z-10 relative bg-black/50 text-center" htmlFor="imageUpload">
                  <i className="fas fa-upload text-5xl text-gray-200 mb-2"></i>
                  Click here to upload image</label>
                <input type="file" id='imageUpload' className='hidden' accept="image/png, image/gif, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
                {
                  Object.keys(images).length !== 0 ?  //to check empty object
                  <img src={ images } alt={images} className='w-full sm:w-1/2 h-60 object-cover' />
                  : <i className="far fa-image text-9xl h-full w-full h-60 sm:w-1/2 flex items-center justify-center"></i>
                }
              </div>

              <Editor style={{ height: '150px' }} placeholder="Enter description(optional)" value={description} onTextChange={(e) => setDescription(e.htmlValue)} />

            </Dialog>


            <Dialog header="Description"
            visible={infoDialog}
            draggable={false}
            onHide={() => setInfoDialog(false)}
            dismissableMask={true} 
            >
              { (infoText === '') && <p className='text-center mb-10'>Oops! Description not available</p>}
              <span dangerouslySetInnerHTML={ { __html: infoText } }></span>
            </Dialog>

          <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] overflow-auto'>
            <div className='gallery grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
              {(data.length == 0) && 
                <>
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                  <Skeleton shape="square" height="250px" width='95%' className='mb-2' />
                </>
              }
            {data.map( (data, i) => {
              return <div key={i} className="gallery-item">
                          <Image src={data.image} className='gallery-image' preview />
                          <div className="menu">
                              <i className="fa-solid fa-ellipsis-vertical menu-btn" aria-haspopup></i>

                              <div className="more-options-menu">
                                <i className="fas fa-trash-alt bg-rose-500" onClick={() => deleteImageRow(data)}></i>
                                <i className="fas fa-pen bg-blue-500" onClick={() => onEditClick(data)}></i>
                                <i className="fas fa-info bg-cyan-500" onClick={() => getInfo(data.description)}></i>
                              </div>
                          </div>
                     </div>
            })}
            </div>
          </div>
    </div>
  )
}

export default ImageGallery