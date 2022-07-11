import React, { useEffect, useState, useRef } from 'react';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { db, storage } from '../data/firebase';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../contexts/ContextProvider';
import { Image } from 'primereact/image';


function ImageGallery() {

  const { loading, setLoading } = useStateContext();
    
  const [images, setImages] = useState([])

  let effectOnce = useRef(false);

  let storageRef = ref(storage, "gs://react-dashboard-dd469.appspot.com");


  const getFromFirebase = () => {
    // setLoading(true);
    listAll(storageRef).then(function (res) {
        res.items.forEach((imageRef) => {
          getDownloadURL(imageRef).then( url => {
                if (images.indexOf(url) === -1) {
                  setImages((images) => [...images, url]);
                }
            })
            // setLoading(false)
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    };

useEffect(() => {
  if(effectOnce.current === false){
      getFromFirebase();
      return() => {
        effectOnce.current = true;
      }
    }
}, [])



const deleteFromFirebase = (url) => {
  const imageRef = ref(storage, url);
  // Delete the file
    deleteObject(imageRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      console.error(error);
    });
};
   

  return (
    <div className='primary-box w-full text-dark dark:text-white h-[100vh] sm:h-auto'>
        <h1 className='font-medium text-xl mb-5'>Image Gallery</h1>
        <div className="hidden items-center justify-between md:flex">
            {images.map( (image, i) => {
              return <div key={i}>
                        <Image src={image} height="200" width="300" preview />
                        <button onClick={() => deleteFromFirebase(image)}>
                          Delete
                        </button>
                     </div>
            })}
        </div>

    </div>
  )
}

export default ImageGallery