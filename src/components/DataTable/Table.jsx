import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import { ContextMenu } from 'primereact/contextmenu';

import '../../styles/tables.scss';
import NewColumn from './NewColumn';
import { db } from '../../data/firebase';
import { collection, getDocs, doc, query, onSnapshot } from "firebase/firestore";
import { deleteDoc, updateDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../../contexts/ContextProvider';


function Table() {

    const { showDialog, setShowDialog, setDataStatus, setRowData, loading, setLoading } = useStateContext();

    const usercollection = collection(db, "tradeData")
    const [data, setData] = useState([]);
    const [selectedDataRow, setSelectedDataRow] = useState(null);
    const cm = useRef(null);
    const childRef = useRef(null);

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
                        ...doc.data(),
                        buyDate: doc.data().formData.buyDate.toDate(),
                        sellDate: doc.data().formData.sellDate.toDate(),
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

    // edit row in datatable 
    const editDataRow = (e) =>{
        setRowData(e)
        setShowDialog(true);
        setDataStatus('update')
    }

    // delete row in datatable 
    const deleteDataRow = async(e)=>{
        setLoading(true);
        const userDoc = doc(db, "tradeData", e.id);
        await deleteDoc(userDoc);
        setLoading(false)
    }

    // add new data 
    const addNew = ()=>{
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
        return <span>{rowData.formData.tradeType.name}</span>
    }

    // table date body template 
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData);
    }

    // table status template 
    const statusTemplate = (rowData) => {
        return <span className={`py-1 px-2 rounded text-xs bg-${(rowData.buyValue > rowData.sellValue ? 'danger' : 'success')}`}>{(rowData.buyValue > rowData.sellValue ? 'Failure' : 'Success')}</span>;
    }

    // table image template
    const imageBodyTemplate = (rowData) => {
        return <img src={`${rowData.image.img}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />
    }
    
    

  return (
    <div className='primary-box w-full text-dark dark:text-white'>
        <div className="flex items-center justify-between">
            <h1 className='font-medium text-xl'>Data Table</h1>
            <button className='btn-outline-primary border-solid border-2 border-blue-500  hover:bg-blue-500 transition-all' onClick={() => addNew()}><i className="fas fa-add mr-2"></i>Add New</button>
        </div>

        {/* dialog for add new row */}
        {showDialog && <NewColumn />}

        {/* context menu for table */}
        <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedDataRow(null)}/>

        {/* data table */}
        <div className='mt-8'>
            {console.log(data)}
            <DataTable value={data} rowClassName='table-row' responsiveLayout="stack" breakpoint="1080px" scrollHeight="570px" style={{overflow: 'hidden auto'}} contextMenuSelection={data} onContextMenuSelectionChange={e => setSelectedDataRow(e.value)} onContextMenu={e => cm.current.show(e.originalEvent)} >

                <Column field="symbol" header="Name" sortable/>
                <Column field="tradeType" header="Type" body={typeTemplate} sortable/>
                <Column field="quantity" header="Quantity" sortable/>
                <Column field="buyValue" header="value1" sortable/>
                <Column field="sellValue" header="value2" sortable/>
                <Column field="buyDate" header="Date1" dataType="date" 
                body={e => dateBodyTemplate(e.buyDate)} sortable/>
                <Column field="sellDate" header="Date2" dataType="date" body={e => dateBodyTemplate(e.sellDate)} sortable/>
                <Column field="image" header="Image" body={imageBodyTemplate} />
                <Column field="status" header="Status" body={statusTemplate} sortable/>
            </DataTable>
        </div>
    </div>
  )
}

export default Table