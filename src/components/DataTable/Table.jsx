import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/md-dark-indigo/theme.css";
import { ProductService } from '../../data/ProductService';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '../../styles/tables.scss';
import NewColumn from './NewColumn';

function Table() {
    const [products, setProducts] = useState([]);
    const [displayBasic, setDisplayBasic] = useState(false);
    const productService = new ProductService();

    useEffect(() => {
        productService.getProductsSmall().then(data => setProducts(data));
    }, []);

    const statusTemplate = (rowData) => {
        return <span className={`product-badge status-${(rowData.inventoryStatus ? rowData.inventoryStatus.toLowerCase() : '')}`}>{rowData.inventoryStatus}</span>;
    }
    const imageBodyTemplate = (rowData) => {
        return <img src={`/assets/${rowData.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    }
    const renderFooter = (name) => {
        return (
            <div>
                <button className="btn btn-primary border-solid border-2 border-red-500 hover:bg-red-500 transition-all">Cancel</button>
            </div>
        );
    }

  return (
    <div className='primary-box w-full text-dark dark:text-white'>
        <div className="flex items-center justify-between">
            <h1 className='font-medium text-xl'>Data Table</h1>
            <button className='btn-outline-primary border-solid border-2 border-blue-500  hover:bg-blue-500 transition-all' onClick={() => setDisplayBasic(true)}><i className="fas fa-add mr-2"></i>Add New</button>
        </div>

                <Dialog header="Add New" visible={displayBasic} style={{ width: '70vw' }} draggable={false} footer={renderFooter('displayBasic')} onHide={() => setDisplayBasic(false)}>
                    <NewColumn />
                </Dialog>
        <div className='mt-8'>
            <DataTable value={products} rowClassName='table-row' responsiveLayout="stack" breakpoint="960px" scrollHeight="570px" scrollable>
                <Column field="code" header="Code" sortable/>
                <Column field="name" header="Name" sortable/>
                <Column header="Image" body={imageBodyTemplate}></Column>
                <Column field="category" header="Category" sortable/>
                <Column field="quantity" header="Quantity" sortable/>
                <Column field="inventoryStatus" header="Status" body={statusTemplate} sortable/>
            </DataTable>
        </div>
    </div>
  )
}

export default Table