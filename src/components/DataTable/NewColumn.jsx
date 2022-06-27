import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle} from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { db, storage } from '../../data/firebase';
import { typeOptions } from '../../data/data';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

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
  
  const { setShowDialog, rowData, dataStatus, setLoading, showDialog } = useStateContext();

  const usercollection = collection(db, "tradeData")
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);

  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState(null);
  const [quantity, setQuantity] = useState();
  const [buyValue, setBuyValue] = useState();
  const [sellValue, setSellValue] = useState();
  const [buyDate, setBuyDate] = useState(null);
  const [sellDate, setSellDate] = useState(null);
  const [image, setImage] = useState({})

  const formControl = {
    symbol: '',
    tradeType: '',
    quantity: '',
    buyValue: '',
    sellValue: '',
    buyDate: null,
    sellDate: null,
    image: {},
  }

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ formControl });


  // set row data to input fields if updating 
  useEffect(() =>{
    if(dataStatus === 'update' && rowData){
        setSymbol(rowData.symbol);
        setTradeType(rowData.tradeType);
        setQuantity(rowData.quantity);
        setBuyValue(rowData.buyValue);
        setSellValue(rowData.sellValue);
        setBuyDate(rowData.buyDate);
        setSellDate(rowData.sellDate);
        setImage(rowData.image)
      }
    }, [rowData, dataStatus])


  // calling child function using forward ref 
//   useImperativeHandle(ref, () => ({
//     callChildFunction(e){
//       if(e === 'add'){
//         addRow();
//       }else{
//         updateRow(rowData)
//       }
//     }
//   }))

  // function for adding new row 
  const addRow = async (e) => {
    console.log(e);
    try {
      await setDoc(doc(usercollection), {
        formData: e,
        timeStamp: serverTimestamp(),
      });
      setShowDialog(false);
    } catch (err) {
      console.log(err);
    }
  }

  // function for updating rowdata 
  const updateRow = async(rowData)=>{
    console.log(rowData);
    setShowDialog(false);
    setLoading(true)
    const userDoc = doc(db, "tradeData", rowData.id);
    const updateRowData = {
      symbol: symbol,
      tradeType: tradeType,
      quantity: Number(quantity),
      buyValue: Number(buyValue),
      sellValue: Number(sellValue),
      buyDate: buyDate,
      sellDate: sellDate,
      image: image,
      timeStamp: serverTimestamp()
    };
    await updateDoc(userDoc, updateRowData);
    setLoading(false)
  }

  // for uploading image in firebase storage 
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
            setImage(() => ({ img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

// for rendering footer in dialog 
const renderFooter = () => {
    return (
        <div>
            <button className="btn btn-primary border-solid border-2 border-red-500 hover:bg-red-500 transition-all" onClick={() => setShowDialog(false)}>Cancel</button>
            <button type='submit' onClick={handleSubmit(addRow)} className="btn btn-primary border-solid border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 transition-all" >{dataStatus === 'add' ? 'Add' : 'Update'}</button>
        </div>
    );
}

  return (
    <div className='w-full'>
        <Dialog header={dataStatus === 'add' ? 'Add New' : 'Update Columns'}
            visible={showDialog}
            style={{width: '50vw'}}
            breakpoints={{'960px':'75vw', '640px': '100vw'}}
            draggable={false}
            footer={renderFooter('displayBasic')} 
            onHide={() => setShowDialog(false)}
            dismissableMask={true} 
            >
    {/* <form onSubmit={handleSubmit(addRow)}> */}

        
      <div className="flex pt-5">
        <span className="p-float-label w-full mr-4">
        <Controller name="symbol" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
          <InputText id={field.symbol} {...field}  className={classNames({ 'w-full p-invalid': fieldState.error })} />
          )} />
          <label htmlFor="symbol" className='block'>Symbol</label>
        </span>

        <span className="p-float-label w-full">
        <Controller name="tradeType" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
        <Dropdown id={field.tradeType} {...field} value={field.value} options={typeOptions} onChange={(e) => field.onChange(e.value)} optionLabel="name" placeholder="Select Type" className={classNames({ 'w-full p-invalid': fieldState.error })} />
        
        )} />
        </span>
      </div>
      <div className="flex pt-5">
        <span className="p-float-label w-full mr-4">
        <Controller name="quantity" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
          <InputText id={field.quantity} {...field} className={classNames({ 'w-full p-invalid': fieldState.error })} />
          )} />
          <label htmlFor="quantity">Quantity</label>
        </span>

        <span className="p-float-label w-full mr-4">
        <Controller name="buyValue" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
          <InputText id={field.buyValue} {...field} className={classNames({ 'w-full p-invalid': fieldState.error })} />
          )} />
          <label htmlFor="buyValue">Value 1</label>
        </span>

        <span className="p-float-label w-full">
        <Controller name="sellValue" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
          <InputText id={field.sellValue} {...field} className={classNames({ 'w-full p-invalid': fieldState.error })} />
          )} />
          <label htmlFor="sellValue">Value 2</label>
        </span>

      </div>
      <div className="flex pt-5">
        {/* Use selectionMode="range" instead of using start and end dates  */}
        <span className="p-float-label w-full mr-4">
        <Controller name="buyDate" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
          <Calendar id={field.buyDate} {...field} dateFormat="dd/mm/yy" onChange={(e) => field.onChange(e.value)} className={classNames({ 'w-full p-invalid': fieldState.error })}></Calendar>
            )} />
          <label htmlFor="startDate">Start Date</label>
        </span>
        <span className="p-float-label w-full">
        <Controller name="sellDate" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
          <Calendar id={field.sellDate} {...field} dateFormat="dd/mm/yy" onChange={(e) => field.onChange(e.value)} className={classNames({ 'w-full p-invalid': fieldState.error })}></Calendar>
          )} />
          <label htmlFor="endDate">End Date</label>
        </span>

      </div>
      <div>

      </div>
      <div className="flex pt-8">
        <div className="file-upload-container w-full relative border border-neutral-500 rounded overflow-hidden flex">
          <div className="absolute bottom-0 z-20 w-full">
            <ProgressBar value={per} style={{ height: '6px', borderRadius: 0 }} color='slate-90'></ProgressBar>
          </div>

          <label className="h-60 w-1/2 flex justify-center items-center flex-col cursor-pointer px-4 py-3 z-10 relative bg-black/50" htmlFor="imageUpload">
            <i className="fas fa-upload text-5xl text-gray-200 mb-2"></i>
            Click here to upload image</label>
          <input type="file" id='imageUpload' className='hidden' accept="image/png, image/gif, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
          {
            Object.keys(image).length !== 0 ?  //to check empty object
            <img src={ image.img } alt={image.img} className='w-1/2 h-60 object-cover' />
            : <i className="far fa-image text-9xl h-full w-1/2 flex items-center justify-center"></i>
          }
        </div>

      </div>
      {/* </form> */}
        </Dialog>
    </div>
  )
})

export default NewColumn;