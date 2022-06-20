import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle} from 'react'
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { db, storage } from '../../data/firebase';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { updateDoc } from 'firebase/firestore/lite';
import { ref as imageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useStateContext } from '../../contexts/ContextProvider';


const NewColumn = forwardRef((props, ref) => {
  
  const { setShowDialog, rowData, dataStatus, setLoading } = useStateContext();

  const usercollection = collection(db, "tradeData")
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);

  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState();
  const [buyValue, setBuyValue] = useState();
  const [sellValue, setSellValue] = useState();
  const [buyDate, setBuyDate] = useState(null);
  const [sellDate, setSellDate] = useState(null);
  const [image, setImage] = useState({})


  useEffect(() =>{
      if(dataStatus === 'update' && rowData){
        setSymbol(rowData.symbol);
        setType(rowData.type);
        setQuantity(rowData.quantity);
        setBuyValue(rowData.buyValue);
        setSellValue(rowData.sellValue);
        setBuyDate(rowData.buyDate);
        setSellDate(rowData.sellDate);
        setImage(rowData.image)
      }
    }, [rowData, dataStatus])

  useImperativeHandle(ref, () => ({
    callChildFunction(e){
      if(e === 'add'){
        addRow();
      }else{
        updateRow(rowData)
      }
    }
  }))

  const addRow = async (e) => {
    try {
      await setDoc(doc(usercollection), {
        symbol: symbol,
        type: type,
        quantity: Number(quantity),
        buyValue: Number(buyValue),
        sellValue: Number(sellValue),
        buyDate: buyDate,
        sellDate: sellDate,
        image: image.img,
        timeStamp: serverTimestamp(),
      });
      setShowDialog(false);
    } catch (err) {
      console.log(err);
    }

    
  }

  // const addRow = async () => {
  //   setLoading(true)
  //   setShowDialog(false);
  //   await addDoc(usercollection, {
  //     symbol: symbol,
  //     type: type,
  //     quantity: Number(quantity),
  //     buyValue: Number(buyValue),
  //     sellValue: Number(sellValue),
  //     buyDate: buyDate,
  //     sellDate: sellDate,
  //     image: image
  //   })
  //   setLoading(false)
  // };

  // useEffect(() =>{
  //   const getData = async () => {
  //     const data = await getDocs(usercollection);
  //     setData(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
  //   }

  //   getData();
  // }, [])


  const updateRow = async(rowData)=>{
    setShowDialog(false);
    setLoading(true)
    const userDoc = doc(db, "tradeData", rowData.id);
    const updateRowData = {
      symbol: symbol,
      type: type,
      quantity: Number(quantity),
      buyValue: Number(buyValue),
      sellValue: Number(sellValue),
      buyDate: buyDate,
      sellDate: sellDate,
    };
    await updateDoc(userDoc, updateRowData);
    setLoading(false)
  }


  // const handleImageChange = (e) => {
  //   if(e.target.files[0]){
  //     setImage(e.target.files[0]);
  //   }
  // }

  useEffect(() => {
    const uploadFile = () => {
      setImage(image)
      const name = new Date().getTime() + file.name;

      const storageRef = imageRef(storage, file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(() => ({ img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  return (
    <div className='w-full'>
      <div className="flex pt-5">
        <span className="p-float-label w-full mr-4">
          <InputText id="in" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full" />
          <label htmlFor="in">Symbol</label>
        </span>

        <span className="p-float-label w-full">
          <InputText id="in" value={type} onChange={(e) => setType(e.target.value)} className="w-full" />
          <label htmlFor="in">Type</label>
        </span>
      </div>
      <div className="flex pt-5">
        <span className="p-float-label w-full mr-4">
          <InputNumber id="in" value={quantity} onChange={(e) => setQuantity(e.value)} className="w-full" />
          <label htmlFor="in">Quantity</label>
        </span>

        <span className="p-float-label w-full mr-4">
          <InputNumber id="in" mode="decimal" minFractionDigits={0} maxFractionDigits={3} className="w-full" value={buyValue} onChange={(e) => setBuyValue(e.value)} />
          <label htmlFor="in">Value 1</label>
        </span>

        <span className="p-float-label w-full">
          <InputNumber id="in" minFractionDigits={0} maxFractionDigits={3} className="w-full" value={sellValue} onChange={(e) => setSellValue(e.value)} />
          <label htmlFor="in">Value 2</label>
        </span>

      </div>
      <div className="flex pt-5">
        <span className="p-float-label w-full mr-4">
          <Calendar value={buyDate} dateFormat="dd/mm/yy" onChange={(e) => setBuyDate(e.value)} className="w-full"></Calendar>
          <label htmlFor="in">start Date</label>
        </span>
        <span className="p-float-label w-full">
          <Calendar value={sellDate} dateFormat="dd/mm/yy" onChange={(e) => setSellDate(e.value)} className="w-full"></Calendar>
          <label htmlFor="in">end Date</label>
        </span>

      </div>
      <div>

      </div>
      <div className="flex pt-5">
        <span className="p-float-label w-full">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <img src={ image } alt="" />
        </span>

      </div>
    </div>
  )
})

export default NewColumn;