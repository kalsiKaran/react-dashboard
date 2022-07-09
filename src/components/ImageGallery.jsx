import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { db, storage } from '../data/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../contexts/ContextProvider';
import { Image } from 'primereact/image';


function ImageGallery() {

    const { loading, setLoading } = useStateContext();
    
    const [images, setImages] = useState([])
    const usercollection = collection(db, "tradeData")

    // get data from firebase
//     useEffect(() => {
//     // LISTEN (REALTIME)
//     const unsub = onSnapshot(
//       usercollection,
//       (snapShot) => {
//         let list = [];
//         snapShot.docs.forEach((doc) => {
//           list.push({ id: doc.id, image: doc.data().image
//              });
//         });
//         setImages(list);
//       },
//       (error) => {
//         // console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, []);

let storageRef = ref(storage, "gs://react-dashboard-dd469.appspot.com");


  const getFromFirebase = () => {
    
    listAll(storageRef).then(function (res) {
        
        res.items.forEach((imageRef) => {
            getDownloadURL(imageRef).then( url => {
                // imgArr.push({img: url})
                setImages((images) => [...images, url]);
            })
        });
      })
      .catch(function (error) {
        console.log(error);
      });
      setLoading(false)
    };

useEffect(() => {
    getFromFirebase();
}, [])
   

  return (
    <div className='primary-box w-full text-dark dark:text-white h-[100vh] sm:h-auto'>
        <div className="hidden items-center justify-between md:flex">
            <h1 className='font-medium text-xl'>Image Gallery</h1>
            {images.map( image => {
                // return console.log(image);
                return <div key={image}>
                        <img src={image} height="200" width="300" />
                        </div>
            })}
        </div>

    </div>
  )
}

export default ImageGallery