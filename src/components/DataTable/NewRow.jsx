import React, { useState, useEffect } from 'react';
import 'primereact/resources/primereact.css';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { db, storage } from '../../data/firebase';
import { typeOptions } from '../../data/data';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';

import { collection, doc, serverTimestamp, setDoc, } from "firebase/firestore";
import { updateDoc } from 'firebase/firestore/lite';
import { ref as imageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useStateContext } from '../../contexts/ContextProvider';


function NewRow() {
  
  const { setShowDialog, rowData, dataStatus, setLoading, showDialog } = useStateContext();

  const usercollection = collection(db, "tradeData")
  const [file, setFile] = useState("");
  const [per, setPerc] = useState(null);

  const [image, setImage] = useState({})

  let defaultValues = {
    symbol: '',
    tradeType: '',
    quantity: '',
    buyValue: '',
    sellValue: '',
    date: null,
    image: {},
  };

  // set row data to input fields if updating
    if(dataStatus === 'update'){
      let date;
      if(rowData.date[1]){
        date = [rowData.date[0].toDate(), rowData.date[1].toDate()]
      }else{
        date = [rowData.date[0].toDate()]
      }
      defaultValues = {
        symbol: rowData.symbol,
        tradeType: rowData.tradeType,
        quantity: rowData.quantity,
        buyValue: rowData.buyValue,
        sellValue: rowData.sellValue,
        image: rowData.image,
        date: date
      }
    }

    useEffect(() => {
      if(dataStatus === 'update'){
        setImage(rowData.image)
      }
    }, [rowData])
    
  const { handleSubmit, formState: { errors }, reset, control } = useForm({ defaultValues });

  // function for adding new row 
  const addRow = async (e) => {
    try {
      await setDoc(doc(usercollection), {
        formData: e,
        image: image,
        timeStamp: serverTimestamp(),
      });
      setShowDialog(false);
    } catch (err) {
      console.log(err);
    }
  }

  // function for updating rowdata 
  const updateRow = async(e)=>{
    setShowDialog(false);
    setLoading(true)
    const userDoc = doc(db, "tradeData", rowData.id);
    const updateRowData = {
      formData: e,
      image: image,
      timeStamp: serverTimestamp(),
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
            <button type='submit' onClick={handleSubmit(dataStatus === 'add' ? addRow : updateRow)} className="btn btn-primary border-solid border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 transition-all" >{dataStatus === 'add' ? 'Add' : 'Update'}</button>
        </div>
    );
}

const getFormErrorMessage = (name) => {
  return errors[name] && <small className="p-error text-xs">{errors[name].message}</small>
};

  return (
    <div className='w-full'>
      <Dialog header={dataStatus === 'add' ? 'Add New' : 'Update Columns'}
            visible={showDialog}
            draggable={false}
            // breakpoints={{'960px': '75vw', '640px': '100vw'}} //not working
            // style={{width: '50vw'}}
            footer={renderFooter('displayBasic')} 
            onHide={() => setShowDialog(false)}
            dismissableMask={true} 
            >
        
      <div className="block sm:flex pt-3">
        <div className='w-full mr-4 mb-4 sm:mb-0'>
          <span className="p-float-label">
          <Controller name="symbol" control={control} rules={{ required: 'Symbol is required.' }} render={({ field, fieldState }) => (
            <InputText id={field.symbol} value={field.value} onChange={field.onChange} className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
            )} />
            <label htmlFor="symbol" className={classNames({ 'p-error': errors.symbol })}>Symbol</label>
          </span>
          {getFormErrorMessage('symbol')}
        </div>

        <div className="w-full">
          <span className="p-float-label">
          <Controller name="tradeType" control={control} rules={{ required: 'Please select trade type.' }} render={({ field, fieldState }) => (
          <Dropdown id={field.tradeType} {...field} value={field.value} options={typeOptions} onChange={(e) => field.onChange(e.value)} optionLabel="name" placeholder="Select Type" className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
          
          )} />
          </span>
          {getFormErrorMessage('tradeType')}
        </div>
      </div>

      <div className="block sm:flex pt-5">
        <div className="w-full mr-4 mb-4 sm:mb-0">
          <span className="p-float-label">
          <Controller name="quantity" control={control} rules={{ required: 'Quantity is required.' }} render={({ field, fieldState }) => (
            <InputText id={field.quantity} value={field.value} onChange={field.onChange} keyfilter="money" className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
            )} />
            <label htmlFor="quantity" className={classNames({ 'p-error': errors.quantity })}>Quantity</label>
          </span>
          {getFormErrorMessage('quantity')}
        </div>

        <div className="w-full mr-4 mb-4 sm:mb-0">
          <span className="p-float-label">
            <Controller name="buyValue" control={control} rules={{ required: 'Buy Value is required.' }} render={({ field, fieldState }) => (
              <InputText id={field.buyValue} value={field.value} onChange={field.onChange} keyfilter="money" className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
              )} />
              <label htmlFor="buyValue" className={classNames({ 'p-error': errors.buyValue })}>Value1</label>
          </span>
          {getFormErrorMessage('buyValue')}
        </div>

        <div className="w-full">
          <span className="p-float-label">
          <Controller name="sellValue" control={control} rules={{ required: 'Sell Value is required.' }} render={({ field, fieldState }) => (
            <InputText id={field.sellValue} value={field.value} onChange={field.onChange} keyfilter="money" className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`} />
            )} />
            <label htmlFor="sellValue" className={classNames({ 'p-error': errors.sellValue })}>Value 2</label>
          </span>
          {getFormErrorMessage('sellValue')}
        </div>
      </div>


      <div className="block sm:flex pt-5">
        <div className="w-full">
          <span className="p-float-label">
          <Controller name="date" control={control} rules={{ required: 'Date is required.' }} render={({ field, fieldState }) => (
            <Calendar id={field.date} value={field.value} selectionMode='range' dateFormat="mm/dd/yy" onChange={(e) => field.onChange(e.value)} className={`w-full ${classNames({ 'p-invalid': fieldState.error })}`}></Calendar>
            )} />
            <label htmlFor="date" className={classNames({ 'p-error': errors.sellDate })}>Date</label>
          </span>
          {getFormErrorMessage('date')}
        </div>
      </div>
      <div>

      </div>
      <div className="flex pt-8">
        <div className="h-full w-full relative border border-neutral-500 rounded overflow-hidden block sm:flex sm:items-center">
          <div className="absolute bottom-0 z-20 w-full">
            <ProgressBar value={per} style={{ height: '6px', borderRadius: 0 }} color='slate-90'></ProgressBar>
          </div>

          <label className="h-60 w-full sm:w-1/2 flex justify-center items-center flex-col cursor-pointer px-4 py-3 z-10 relative bg-black/50 text-center" htmlFor="imageUpload">
            <i className="fas fa-upload text-5xl text-gray-200 mb-2"></i>
            Click here to upload image</label>
          <input type="file" id='imageUpload' className='hidden' accept="image/png, image/gif, image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
          {
            Object.keys(image).length !== 0 ?  //to check empty object
            <img src={ image.img } alt={image.img} className='w-full sm:w-1/2 h-60 object-cover' />
            : <i className="far fa-image text-9xl h-full w-full h-60 sm:w-1/2 flex items-center justify-center"></i>
          }
        </div>

      </div>
      </Dialog>
    </div>
  )
}

export default NewRow;