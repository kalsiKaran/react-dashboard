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

function ImageGallery() {

  const { loading, setLoading } = useStateContext();
    
  const [dialogVisible, setDialogVisible] = useState(false)
  const [images, setImages] = useState([])
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);
  const [data, setData] = useState([])

  const usercollection = collection(db, "images")

  // let storageRef = ref(storage, "gs://react-dashboard-dd469.appspot.com/images");


  // const getFromFirebase = () => {
  //   // setLoading(true);
  //   listAll(storageRef).then(function (res) {
  //       res.items.forEach((imageRef) => {
  //         getDownloadURL(imageRef).then( url => {
  //               if (images.indexOf(url) === -1) {
  //                 setImages((images) => [...images, url]);
  //               }
  //           })
  //           // setLoading(false)
  //       });
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  //   };


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

  // useEffect(() => {
  //   if(effectOnce.current === false){
  //     getFromFirebase();
  //     return() => {
  //       effectOnce.current = true;
  //     }
  //   }
  // }, [])


  // useEffect(() => {
  //   const deleteFromFirebase = () => {
  //     const imageRef = ref(storage, deleteImages);
  //     // Delete the file
  //       deleteObject(imageRef).then(() => {
  //         // File deleted successfully
  //       }).catch((error) => {
  //         console.error(error);
  //       });
  //   };
  //   deleteImages && deleteFromFirebase()

  // }, [deleteImages])

  const addRow = async (e) => {
    if(images.length){
    try {
      await setDoc(doc(usercollection), {
        image: images,
        timeStamp: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  }
    setImages([]);
  }

  // function for updating rowdata 
  // const editImageRow = async(id)=>{
  //   const userDoc = doc(db, "images", id);
  //   const updateRowData = {
  //     image: images,
  //     timeStamp: serverTimestamp(),
  //   };
  //   await updateDoc(userDoc, updateRowData);
  // }

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


  useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      usercollection,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, image: doc.data().image
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


  const renderFooter = () => {
    return <div>
      <button onClick={() => addRow()} disabled={(per < 100) ? true : false} className='btn btn-primary bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:bg-blue-500'>Upload</button>
      <button onClick={() => setDialogVisible(false)} className='btn btn-primary bg-rose-700 hover:bg-red-800 transition-all'>Cancel</button>
    </div>
  }

  return (
    <div className='primary-box w-full text-dark dark:text-white h-[100vh] sm:h-auto'>
        <div className="hidden items-center justify-between md:flex">
          <h1 className='font-medium text-xl mb-5'>Image Gallery</h1>
          <button onClick={() => setDialogVisible(true)}>upload</button>
        </div>

        <Dialog header="upload image"
            visible={dialogVisible}
            draggable={false}
            // breakpoints={{'960px': '75vw', '640px': '100vw'}} //not working
            style={{width: '50vw', overflow: 'hidden'}}
            footer={renderFooter('displayBasic')} 
            onHide={() => setDialogVisible(false)}
            dismissableMask={true} 
            >
              <div className='flex border border-gray border-neutral-600 rounded overflow-hidden relative'>
                <div className="absolute left-0 top-0 z-20 w-full">
                  <ProgressBar value={per} style={{ height: '4px', borderRadius: 0 }} color='slate-90'></ProgressBar>
                </div>
              <label className="h-60 w-full sm:w-1/2 flex justify-center items-center flex-col cursor-pointer px-4 py-3 z-10 relative bg-black/50 text-center" htmlFor="imageUpload">
                  <i className="fas fa-upload text-5xl text-gray-200 mb-2"></i>
                  Click here to upload image</label>
                <input type="file" id='imageUpload' className='hidden' accept="image/png, image/gif, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
                {console.log(images)}
                {
                  Object.keys(images).length !== 0 ?  //to check empty object
                  <img src={ images } alt={images} className='w-full sm:w-1/2 h-60 object-cover' />
                  : <i className="far fa-image text-9xl h-full w-full h-60 sm:w-1/2 flex items-center justify-center"></i>
                }
              </div>
            </Dialog>

            {data.map( (image, i) => {
              return <div key={i}>
                        <Image src={image.image} height="200" width="300" preview />
                        <div><button className='bg-rose-500 py-2 px-4 rounded' onClick={() => deleteImageRow(image)}>Delete</button></div>
                        {/* <button onClick={() => editImageRow(image.id)}>edit</button> */}
                     </div>
            })}
    </div>
  )
}

export default ImageGallery