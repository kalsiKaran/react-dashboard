import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
// import { Tag } from 'primereact/tag';
// import { Button } from 'primereact/button';

// import { FileUpload } from 'primereact/fileupload';
// import { ProgressBar } from 'primereact/progressbar';
import db from '../../data/firebase';
import storage from '../../data/firebase';
import { collection, addDoc, doc } from "firebase/firestore";
import { updateDoc } from 'firebase/firestore/lite';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStateContext } from '../../contexts/ContextProvider';


const NewColumn = forwardRef((props, ref) => {
  
  const { setShowDialog, rowData, dataStatus, loading, setLoading } = useStateContext();

  // const [totalSize, setTotalSize] = useState(0);
  // const toast = useRef(null);
  // const fileUploadRef = useRef(null);

//   const onTemplateUpload = (e) => {
//     let _totalSize = 0;
//     e.files.forEach(file => {
//         _totalSize += (file.size || 0);
//     });

//     setTotalSize(_totalSize);
//     toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
//   }

//   const onTemplateSelect = (e) => {
//     let _totalSize = totalSize;
//     e.files.forEach(file => {
//         _totalSize += file.size;
//     });

//     setTotalSize(_totalSize);
//   }

//   const onTemplateClear = () => {
//     setTotalSize(0);
//   }

//   const onTemplateRemove = (file, callback) => {
//     setTotalSize(totalSize - file.size);
//     callback();
// }

//   const headerTemplate = (options) => {
//     const { className, chooseButton, uploadButton, cancelButton } = options;
//     const value = totalSize/10000;
//     const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

//     return (
//         <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
//             {chooseButton}
//             {uploadButton}
//             {cancelButton}
//             <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
//         </div>
//     );
//   }

//   const itemTemplate = (file, props) => {
//     return (
//         <div className="flex align-items-center flex-wrap">
//             <div className="flex align-items-center" style={{width: '40%'}}>
//                 <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
//                 <span className="flex flex-column text-left ml-3">
//                     {file.name}
//                     <small>{new Date().toLocaleDateString()}</small>
//                 </span>
//             </div>
//             <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
//             <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
//         </div>
//     )
// }

//   const emptyTemplate = () => {
//     return (
//         <div className="flex align-items-center flex-column">
//             <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
//             <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
//         </div>
//     )
//   }

//   const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
//   const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
//   const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};



  const usercollection = collection(db, "tradeData")

  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState();
  const [buyValue, setBuyValue] = useState();
  const [sellValue, setSellValue] = useState();
  const [buyDate, setBuyDate] = useState(null);
  const [sellDate, setSellDate] = useState(null);
  const [image, setImage] = useState(null)
  const [url, setUrl] = useState(null)


  useEffect(() =>{
      if(dataStatus === 'update' && rowData){
        setSymbol(rowData.symbol);
        setType(rowData.type);
        setQuantity(rowData.quantity);
        setBuyValue(rowData.buyValue);
        setSellValue(rowData.sellValue);
        setBuyDate(rowData.buyDate);
        setSellDate(rowData.sellDate);
      }
    }, [])

  useImperativeHandle(ref, () => ({
    callChildFunction(e){
      if(e === 'add'){
        addRow();
      }else{
        updateRow(rowData)
      }
    }
  }))

  const addRow = async () => {
    setLoading(true)
    setShowDialog(false);
    await addDoc(usercollection, {
      symbol: symbol,
      type: type,
      quantity: Number(quantity),
      buyValue: Number(buyValue),
      sellValue: Number(sellValue),
      buyDate: buyDate,
      sellDate: sellDate,
    })
    setLoading(false)
  };

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


  const handleImageChange = (e) => {
    if(e.target.files[0]){
      setImage(e.target.files[0]);
    }
  }

  const handleSubmit = () => {
    const imageRef = storageRef(storage, "image");
    uploadBytes(imageRef, image)
    .then(() => {
      getDownloadURL(imageRef)
      .then((url) => {
          setUrl(url);
      })
      .catch((error) => {
        console.log(error.message, "error message");
      })
    })
    .catch((error) => {
      console.log(error.message);
    })
  }
  // const deleteData = async(id)=>{
  //   const userDoc = doc(db, "tradeData", id);
  //   await deleteDoc(userDoc)
  // }

  return (
    <div className='w-full'>

    <input type="file" onChange={handleImageChange} />
    <button type="submit" onClick={handleSubmit}>submit</button>
    <img src={url} alt="" />
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
      {/* <div className="flex pt-5">
        <span className="p-float-label w-full">
        <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" multiple accept="image/*" maxFileSize={1000000}
                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </span>

      </div> */}
    </div>
  )
})

export default NewColumn;