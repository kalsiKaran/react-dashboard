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
import db from '../../data/firebase';
import { collection, getDocs, doc, query, onSnapshot } from "firebase/firestore";
import { deleteDoc, updateDoc } from 'firebase/firestore/lite';
import { useStateContext } from '../../contexts/ContextProvider';


function Table() {

    const { showDialog, setShowDialog, dataStatus, setDataStatus, setRowData, loading, setLoading } = useStateContext();

    const usercollection = collection(db, "tradeData")
    const [data, setData] = useState([]);
    const [selectedDataRow, setSelectedDataRow] = useState(null);
    const cm = useRef(null);

    const menuModel = [
        {label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => editDataRow(selectedDataRow)},
        {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteDataRow(selectedDataRow)}
    ];

    const childRef = useRef(null);
//     useEffect(() =>{
//         const getData = async () => {
//         const querySnapshot = await getDocs(usercollection);
//         querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         });
//     }
//     return () => getData();
// }, [loading])

    useEffect(() =>{
        getDocs(usercollection)
        .then(res => {
            const data = res.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                buyDate: doc.data().buyDate.toDate(),
                sellDate: doc.data().sellDate.toDate(),
            }))
            setLoading(false)
            setData(data)
            console.log('data', data);
        })
        .catch(err => console.log(err))
      }, [loading])

    const editDataRow = (e) =>{
        setRowData(e)
        setShowDialog(true);
        setDataStatus('update')
    }

    const deleteDataRow = async(e)=>{
        setLoading(true);
        const userDoc = doc(db, "tradeData", e.id);
        await deleteDoc(userDoc);
        setLoading(false)
    }

    const addNew = ()=>{
        setShowDialog(true);
        setDataStatus('add');
    }

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData);
    }

    const statusTemplate = (rowData) => {
        return <span className={`py-1 px-2 rounded text-xs bg-${(rowData.buyValue > rowData.sellValue ? 'rose' : 'teal')}-600`}>{(rowData.buyValue > rowData.sellValue ? 'Failure' : 'Success')}</span>;
    }

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`/assets/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    // }
    
    const renderFooter = () => {
        return (
            <div>
                <button className="btn btn-primary border-solid border-2 border-red-500 hover:bg-red-500 transition-all" onClick={() => setShowDialog(false)}>Cancel</button>
                <button className="btn btn-primary border-solid border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 transition-all" onClick={() => childRef.current.callChildFunction(dataStatus)}>{dataStatus === 'add' ? 'Add' : 'Update'}</button>
            </div>
        );
    }

  return (
    <div className='primary-box w-full text-dark dark:text-white'>
        <div className="flex items-center justify-between">
            <h1 className='font-medium text-xl'>Data Table</h1>
            <button className='btn-outline-primary border-solid border-2 border-blue-500  hover:bg-blue-500 transition-all' onClick={() => addNew()}><i className="fas fa-add mr-2"></i>Add New</button>
        </div>

        {/* dialog for add new row */}
        <Dialog header={dataStatus === 'add' ? 'Add New' : 'Update Columns'}
            visible={showDialog}
            style={{width: '50vw'}}
            breakpoints={{'960px':'75vw', '640px': '100vw'}}
            draggable={false}
            footer={renderFooter('displayBasic')} 
            onHide={() => setShowDialog(false)}
            dismissableMask={true} 
            >
            <NewColumn ref={childRef}/>
        </Dialog>

        {/* context menu for table */}
        <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedDataRow(null)}/>

        {/* data table */}
        <div className='mt-8'>
            <DataTable value={data} rowClassName='table-row' responsiveLayout="stack" breakpoint="1080px" scrollHeight="570px" style={{overflow: 'hidden auto'}} contextMenuSelection={data} onContextMenuSelectionChange={e => setSelectedDataRow(e.value)} onContextMenu={e => cm.current.show(e.originalEvent)} >

                {/* <Column field="id" header="ID" sortable/> */}
                <Column field="symbol" header="Name" sortable/>
                {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                <Column field="type" header="Type" sortable/>
                <Column field="quantity" header="Quantity" sortable/>
                <Column field="buyValue" header="value1" sortable/>
                <Column field="sellValue" header="value2" sortable/>
                <Column field="buyDate" header="Date1" dataType="date" 
                body={e => dateBodyTemplate(e.buyDate)} sortable/>
                <Column field="sellDate" header="Date2" dataType="date" body={e => dateBodyTemplate(e.sellDate)} sortable/>
                <Column field="status" header="Status" body={statusTemplate} sortable/>
            </DataTable>
        </div>
    </div>
  )
}

export default Table