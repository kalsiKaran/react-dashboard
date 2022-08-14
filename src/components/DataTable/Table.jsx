import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { FilterMatchMode } from 'primereact/api';
import { ContextMenu } from 'primereact/contextmenu';
import { InputText } from 'primereact/inputtext';
import '../../styles/tables.scss';
import NewRow from './NewRow';
import { db, storage } from '../../data/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../../contexts/ContextProvider';
import { Image } from 'primereact/image';


function Table() {

    const { showDialog, setShowDialog, setDataStatus, setRowData, setLoading, selectedRows, setSelectedRows } = useStateContext();

    const usercollection = collection(db, "tradeData")
    const [data, setData] = useState([]);
    const [selectedDataRow, setSelectedDataRow] = useState(null);
    const cm = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);

    // context menu model
    const menuModel = [
        {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editDataRow(selectedDataRow)},
        {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteDataRow(selectedDataRow)}
    ];

    // get data from firebase
    useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      usercollection,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id,
                        ...doc.data().formData,
                        image: doc.data().image
             });
        });
        setData(list);
      },
      (error) => {
        // console.log(error);
      }
    );
    initFilters();

    return () => {
      unsub();
    };
  }, []);

    // edit row in datatable 
    const editDataRow = (e) =>{
        setRowData(e)
        setShowDialog(true);
        setDataStatus('update')
    }

    // delete row in datatable 
    const deleteDataRow = async(e)=>{
        setSelectedRows([])
        const userDoc = doc(db, "tradeData", e.id);
        await deleteDoc(userDoc);

        const imageRef = ref(storage, e.image.img);
        // Delete the file
          deleteObject(imageRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            console.error(error);
          });
    }
    
    const deleteMultipleRows = () => {
      selectedRows.forEach(async(e) => {
        const userDoc = doc(db, "tradeData", e.id);
        await deleteDoc(userDoc);
        
        const imageRef = ref(storage, e.image.img);
        // Delete the file
          deleteObject(imageRef).then(() => {
            // File deleted successfully
          }).catch((error) => {
            console.error(error);
          });
      })
      setSelectedRows([])
    }

    // add new data 
    const addNew = () => {
        setShowDialog(true);
        setDataStatus('add');
    }

    // formatting date
    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const typeTemplate = (rowData) => {
        return <span>{rowData.tradeType.name}</span>
    }

    // table date body template 
    const dateBodyTemplate = (rowData) => {
      let fromDate, toDate;
      fromDate = rowData[0].toDate();
      fromDate = formatDate(fromDate)
      if(rowData[1]){
        toDate = rowData[1].toDate();
        toDate = formatDate(toDate)
        return <span>{fromDate} - {toDate}</span>
      }
      return <span>{fromDate}</span>
    }

    // table winOrLoss template 
    const winOrLossTemplate = (rowData) => {
        return <span className={`py-1 px-2 rounded text-xs bg-${(parseInt(rowData.sellValue) <= parseInt(rowData.buyValue) ? 'danger' : 'success')}`}>
          {rowData.tradeType.code === 'FX' ?
          Math.round(((rowData.sellValue - rowData.buyValue) * 1000) * 100)/100 :
          rowData.tradeType.code === 'CT' ? 
            rowData.quantity * (rowData.sellValue - rowData.buyValue) + 10 :
            rowData.quantity * (rowData.sellValue - rowData.buyValue)
          }
        </span>;
    }

    // table image template
    const imageBodyTemplate = (rowData) => {
        return <Image src={`${rowData.image.img}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" preview />

    }

    const initFilters = () => {
      setFilters({
          'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
      });
      setGlobalFilterValue('');
  }

    const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };
      _filters['global'].value = value;
      
      setFilters(_filters);
      setGlobalFilterValue(value);
  }

  useEffect(() => {
    // console.log(selectedRows);
  }, [selectedRows])
  

  return (
    <div className='primary-box w-full text-dark dark:text-white h-[100vh] sm:h-auto'>
        <div className="hidden items-center justify-between md:flex">
            <h1 className='font-medium text-xl'>Table</h1>
            <div className='h-[2.5rem]'>
              <span className="p-input-icon-left h-full">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm h-full !py-2' />
              </span>
              {(selectedRows.length !== 0) && <button className='btn-outline-primary border-solid border-2 border-rose-500  hover:bg-rose-500 transition-all ml-5 h-full' onClick={() => deleteMultipleRows()}>
                <i className="fas fa-trash-alt mr-2"></i>Delete
              </button>}
              <button className='btn-outline-primary border-solid border-2 border-blue-500  hover:bg-blue-500 transition-all ml-5 h-full' onClick={() => addNew()}><i className="fas fa-add mr-2"></i>Add New</button>
            </div>
        </div>

        {/* for mobile view */}
        <div className="flex items-center justify-between mb-3 md:hidden">
          <h1 className='font-medium text-xl'>Table</h1>
        </div>
        <div className='h-[2.5rem] flex md:hidden'>
          <span className="p-input-icon-left h-full w-full">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm w-full h-full !py-2' />
          </span>
          {(selectedRows.length !== 0) && <button className='btn-primary delete-btn bg-rose-500 bottom-36 hover:bg-rose-600 transition-all' onClick={() => deleteMultipleRows()}><i className="fas fa-trash-can"></i></button>}
          <button className='btn-primary add-btn bg-blue-500 bottom-20 hover:bg-blue-600 transition-all' onClick={() => addNew()}><i className="fas fa-add"></i></button>
        </div>

        {/* dialog for add new row */}
        {showDialog && <NewRow />}

        {/* context menu for table */}
        <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedDataRow(null)}/>

        {/* data table */}
        <div className='mt-8'>
            <DataTable value={data} rowClassName='table-row'
             responsiveLayout="stack"
             breakpoint="1080px"
             scrollHeight="calc(100vh - 13rem)"
             dataKey="id"
             filters={filters}
             selection={selectedRows}
             onSelectionChange={e => setSelectedRows(e.value)}
             style={{overflow: 'hidden auto'}}
             contextMenuSelection={data}
             onContextMenuSelectionChange={e => setSelectedDataRow(e.value)}
             onContextMenu={e => cm.current.show(e.originalEvent)} >
                <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                <Column field="symbol" header="Name" sortable/>
                <Column field="tradeType" header="Type" body={typeTemplate} sortable/>
                <Column field="quantity" header="Quantity" sortable/>
                <Column field="buyValue" header="value1" sortable/>
                <Column field="sellValue" header="value2" sortable/>
                <Column field="winOrLoss" header="Total" body={winOrLossTemplate} sortable/>
                <Column field="date" header="Date" dataType="date" body={e => dateBodyTemplate(e.date)} sortable/>
                <Column field="image" header="Image" body={imageBodyTemplate} />
            </DataTable>
        </div>
    </div>
  )
}

export default Table